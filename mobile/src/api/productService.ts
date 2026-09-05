import { supabase } from './supabaseClient';
import { logger } from '@/utils/logger';
import { MultilingualText } from './catalogSynthesisService';

export interface CreateProductPayload {
  title: MultilingualText;
  description: MultilingualText;
  craftCategoryCode: string;
  sellingPrice: number;
  aiSuggestedPrice: number;
  laborHours?: number;
  stockQuantity: number;
  stockType: 'READY_STOCK' | 'MADE_TO_ORDER';
  images: { url: string; isPrimary: boolean }[];
  tags: string[];
  careInstructions?: string;
}

export interface ProductListing {
  id: string;
  status: 'ACTIVE' | 'DRAFT';
  title: MultilingualText;
  description: MultilingualText;
  sellingPrice: number;
  passportQrUrl: string;
  createdAt: string;
}

export class ProductService {
  /**
   * Upload an image file to Supabase Storage bucket 'product-images'
   */
  public async uploadProductImage(fileUri: string, artisanId: string): Promise<string> {
    try {
      const filename = `${artisanId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

      const response = await fetch(fileUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        logger.warn('PRODUCT_SERVICE', 'Supabase storage upload notice', { error: error.message });
        return fileUri;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      logger.warn('PRODUCT_SERVICE', 'Fallback to provided image URI', { err });
      return fileUri;
    }
  }

  /**
   * Publishes new product listing with Digital Craft Passport QR to Supabase
   */
  public async createProduct(payload: CreateProductPayload): Promise<ProductListing> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const artisanId = session?.user?.id || '00000000-0000-0000-0000-000000000001';

      // 1. Insert product row into public.products
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .insert({
          artisan_id: artisanId,
          title: payload.title,
          description: payload.description,
          craft_category_code: payload.craftCategoryCode || 'PAINTING_FOLK',
          selling_price: payload.sellingPrice,
          ai_suggested_price: payload.aiSuggestedPrice || payload.sellingPrice,
          labor_hours: payload.laborHours || 12,
          stock_quantity: payload.stockQuantity || 1,
          stock_type: payload.stockType || 'READY_STOCK',
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (prodErr || !product) {
        logger.error('PRODUCT_SERVICE', 'Failed to insert product row in Supabase', {
          error: prodErr?.message,
        });
        throw prodErr || new Error('Product insert failed');
      }

      // 2. Upload/Insert images into public.product_images
      if (payload.images && payload.images.length > 0) {
        const imageInserts = payload.images.map((img, idx) => ({
          product_id: product.id,
          raw_image_url: img.url,
          enhanced_image_url: img.url,
          thumbnail_url: img.url,
          is_primary: img.isPrimary || idx === 0,
          sort_order: idx,
        }));

        const { error: imgErr } = await supabase.from('product_images').insert(imageInserts);
        if (imgErr) {
          logger.warn('PRODUCT_SERVICE', 'Images insertion notice', { error: imgErr.message });
        }
      }

      // 3. Create Craft Passport in public.craft_passports
      const productId = product?.id || (Array.isArray(product) ? product[0]?.id : null) || `prod_${Date.now()}`;
      const safeId = String(productId).replace(/[^a-zA-Z0-9]/g, '');
      const passportCode = `PASS-${safeId.substring(0, 8).toUpperCase()}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kalakarsetu.in/passport/${passportCode}`;

      await supabase.from('craft_passports').insert({
        product_id: productId,
        passport_code: passportCode,
        qr_code_svg_url: qrUrl,
        public_verification_url: `https://kalakarsetu.in/passport/${passportCode}`,
      });

      logger.info('PRODUCT_SERVICE', `Product published to Supabase: ${productId}`);

      return {
        id: productId,
        status: 'ACTIVE',
        title: payload.title,
        description: payload.description,
        sellingPrice: payload.sellingPrice,
        passportQrUrl: qrUrl,
        createdAt: product?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      logger.error('PRODUCT_SERVICE', 'Product publication failed in Supabase', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
