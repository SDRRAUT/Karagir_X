import { supabase } from './supabaseClient';
import { logger } from '@/utils/logger';
import {
  AdminPlatformMetrics,
  AdminKycApplication,
  AdminFlaggedListing,
  AdminEscrowTransaction,
} from './types';

const INITIAL_METRICS: AdminPlatformMetrics = {
  totalGmv: 486250,
  activeArtisansCount: 428,
  activeBuyersCount: 1845,
  totalProductsCount: 1290,
  totalEscrowLocked: 64200,
  platformCommissionRevenue: 24313,
  pendingKycCount: 4,
  flaggedListingsCount: 3,
  activeDisputesCount: 2,
};

const INITIAL_KYC_QUEUE: AdminKycApplication[] = [
  {
    id: 'kyc_app_1',
    artisanId: 'art_001',
    artisanName: 'Kamala Devi',
    phone: '+91 98350 12489',
    craftSpecialty: 'Madhubani Painting on Tussar Silk',
    craftCategory: 'PAINTINGS',
    state: 'Bihar',
    district: 'Madhubani',
    aadhaarLast4: '4821',
    pehchanCardId: 'DC-HD-2024-8841',
    verificationStatus: 'PENDING',
    submittedAt: '2 hours ago',
    reliabilityScore: 96,
    notes: 'National Merit Certificate holder. Authentic natural pigment sample attached.',
  },
  {
    id: 'kyc_app_2',
    artisanId: 'art_002',
    artisanName: 'Budhram Baghel',
    phone: '+91 94252 67104',
    craftSpecialty: 'Bastar Lost-Wax Dokra Metal Casting',
    craftCategory: 'BELL_METAL',
    state: 'Chhattisgarh',
    district: 'Bastar (Kondagaon)',
    aadhaarLast4: '9034',
    pehchanCardId: 'DC-HD-2023-1120',
    verificationStatus: 'PENDING',
    submittedAt: '5 hours ago',
    reliabilityScore: 92,
    notes: 'Bell metal craft cooperative member. 3rd generation tribal artisan.',
  },
  {
    id: 'kyc_app_3',
    artisanId: 'art_003',
    artisanName: 'Santosh Kumar Chitrakar',
    phone: '+91 97341 82901',
    craftSpecialty: 'Pattachitra Scroll Painting & Palm Leaf',
    craftCategory: 'PAINTINGS',
    state: 'Odisha',
    district: 'Puri (Raghurajpur)',
    aadhaarLast4: '6178',
    pehchanCardId: 'TRIFED-OD-402',
    verificationStatus: 'PENDING',
    submittedAt: '1 day ago',
    reliabilityScore: 94,
    notes: 'GI Heritage village master craftsman.',
  },
  {
    id: 'kyc_app_4',
    artisanId: 'art_004',
    artisanName: 'Savita Kumbhar',
    phone: '+91 98224 45678',
    craftSpecialty: 'Terracotta Acoustic Amplifiers & Planters',
    craftCategory: 'POTTERY',
    state: 'Maharashtra',
    district: 'Kolhapur',
    aadhaarLast4: '3349',
    verificationStatus: 'PENDING',
    submittedAt: '1 day ago',
    reliabilityScore: 88,
    notes: 'Self Help Group lead with 12 women potters.',
  },
];

const INITIAL_FLAGGED_LISTINGS: AdminFlaggedListing[] = [
  {
    id: 'flag_001',
    productId: 'prod_flag_1',
    title: 'Banarasi Zari Brocade Katan Saree',
    artisanName: 'Mohd. Aslam Ansari',
    craftCategory: 'HANDLOOM_TEXTILES',
    price: 1850,
    fairPriceSuggested: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    flagReason: 'Underpricing Anomaly: Listed price is 64% below minimum living-wage labor calculation. Check for powerloom imitation.',
    aiRiskScore: 78,
    status: 'PENDING',
    createdAt: '3 hours ago',
  },
  {
    id: 'flag_002',
    productId: 'prod_flag_2',
    title: 'Warli Village Harmony Wall Decor Plate',
    artisanName: 'Dinesh Vatha',
    craftCategory: 'HOME_DECOR',
    price: 950,
    fairPriceSuggested: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    flagReason: 'Potential Screen-print: AI edge detection spotted uniform dot matrix rather than handmade bamboo-stick strokes.',
    aiRiskScore: 62,
    status: 'PENDING',
    createdAt: '6 hours ago',
  },
  {
    id: 'flag_003',
    productId: 'prod_flag_3',
    title: 'Channapatna Non-Toxic Wooden Toy Train',
    artisanName: 'Venkatesh Murthy',
    craftCategory: 'WOOD_CRAFT',
    price: 650,
    fairPriceSuggested: 600,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    flagReason: 'Missing GI Certificate tag for Channapatna Lacquerware toys.',
    aiRiskScore: 45,
    status: 'PENDING',
    createdAt: '12 hours ago',
  },
];

const INITIAL_ESCROW_TRANSACTIONS: AdminEscrowTransaction[] = [
  {
    id: 'escrow_001',
    orderId: 'ord_101',
    orderNumber: 'KS-OD-892104',
    buyerName: 'Vikramaditya Roy',
    artisanName: 'Kamala Devi',
    craftTitle: 'Madhubani Tree of Life Painting',
    amount: 3200,
    escrowStatus: 'HELD_IN_NODAL_VAULT',
    trackingNumber: 'SP49201948IN',
    deliveryMilestone: 'Out for Delivery (Patna GPO)',
    hoursRemaining: 36,
    hasDispute: false,
  },
  {
    id: 'escrow_002',
    orderId: 'ord_102',
    orderNumber: 'KS-OD-773419',
    buyerName: 'Ananya Deshmukh',
    artisanName: 'Budhram Baghel',
    craftTitle: 'Dokra Nandi Bull Figurine',
    amount: 1850,
    escrowStatus: 'RELEASE_PENDING',
    trackingNumber: 'SP88203192IN',
    deliveryMilestone: 'Delivered ~ Escrow Auto-release in 14h',
    hoursRemaining: 14,
    hasDispute: false,
  },
  {
    id: 'escrow_003',
    orderId: 'ord_103',
    orderNumber: 'KS-OD-619280',
    buyerName: 'Siddharth Menon',
    artisanName: 'Santosh Kumar Chitrakar',
    craftTitle: 'Pattachitra Jagannath Scroll',
    amount: 4500,
    escrowStatus: 'DISPUTED',
    trackingNumber: 'SP10293847IN',
    deliveryMilestone: 'Delivered (Damaged in Transit claimed)',
    hoursRemaining: 0,
    hasDispute: true,
    disputeReason: 'Buyer reported moisture damage to packaging during monsoon transit. Requested replacement or escrow refund.',
  },
  {
    id: 'escrow_004',
    orderId: 'ord_104',
    orderNumber: 'KS-OD-549102',
    buyerName: 'Meera Sengupta',
    artisanName: 'Savita Kumbhar',
    craftTitle: 'Handcrafted Terracotta Chai Set (6 pcs)',
    amount: 1200,
    escrowStatus: 'RELEASED_TO_ARTISAN',
    trackingNumber: 'SP99382104IN',
    deliveryMilestone: 'Completed & IMPS Disbursed to Bank',
    hoursRemaining: 0,
    hasDispute: false,
  },
];

export class AdminService {
  private metrics: AdminPlatformMetrics = { ...INITIAL_METRICS };
  private kycQueue: AdminKycApplication[] = [...INITIAL_KYC_QUEUE];
  private flaggedListings: AdminFlaggedListing[] = [...INITIAL_FLAGGED_LISTINGS];
  private escrowTransactions: AdminEscrowTransaction[] = [...INITIAL_ESCROW_TRANSACTIONS];

  public async getPlatformMetrics(): Promise<AdminPlatformMetrics> {
    try {
      // Query counts from real Supabase tables if connected
      const [prodRes, orderRes, artisanRes] = await Promise.all([
        supabase.from('products').select('id, base_price', { count: 'exact' }),
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        supabase.from('artisans').select('id', { count: 'exact' }),
      ]);

      if (prodRes.count && prodRes.count > 0) {
        this.metrics.totalProductsCount = Math.max(prodRes.count, this.metrics.totalProductsCount);
      }
      if (artisanRes.count && artisanRes.count > 0) {
        this.metrics.activeArtisansCount = Math.max(artisanRes.count, this.metrics.activeArtisansCount);
      }
      if (orderRes.data && orderRes.data.length > 0) {
        const liveGmv = orderRes.data.reduce((acc, row) => acc + (Number(row.total_amount) || 0), 0);
        if (liveGmv > 0) {
          this.metrics.totalGmv = liveGmv;
          this.metrics.platformCommissionRevenue = Math.round(liveGmv * 0.05);
        }
      }

      this.metrics.pendingKycCount = this.kycQueue.filter((k) => k.verificationStatus === 'PENDING').length;
      this.metrics.flaggedListingsCount = this.flaggedListings.filter((l) => l.status === 'PENDING').length;
      this.metrics.activeDisputesCount = this.escrowTransactions.filter((e) => e.hasDispute).length;

      logger.info('ADMIN_SERVICE', 'Platform metrics refreshed', this.metrics as unknown as Record<string, unknown>);
      return { ...this.metrics };
    } catch (err) {
      logger.warn('ADMIN_SERVICE', 'Failed to fetch live metrics, using cached metrics', { error: String(err) });
      return { ...this.metrics };
    }
  }

  public async getPendingKycList(): Promise<AdminKycApplication[]> {
    return [...this.kycQueue];
  }

  public async updateKycStatus(
    appId: string,
    status: 'APPROVED' | 'REJECTED',
    notes?: string
  ): Promise<AdminKycApplication> {
    const item = this.kycQueue.find((k) => k.id === appId);
    if (!item) {
      throw new Error(`KYC application not found: ${appId}`);
    }

    item.verificationStatus = status;
    if (notes) item.notes = notes;

    this.metrics.pendingKycCount = this.kycQueue.filter((k) => k.verificationStatus === 'PENDING').length;
    if (status === 'APPROVED') {
      this.metrics.activeArtisansCount += 1;
    }

    logger.info('ADMIN_SERVICE', `KYC Application ${appId} updated to ${status}`);
    return { ...item };
  }

  public async getFlaggedListings(): Promise<AdminFlaggedListing[]> {
    return [...this.flaggedListings];
  }

  public async moderateListing(
    listingId: string,
    action: 'APPROVED' | 'REJECTED'
  ): Promise<AdminFlaggedListing> {
    const listing = this.flaggedListings.find((l) => l.id === listingId);
    if (!listing) {
      throw new Error(`Flagged listing not found: ${listingId}`);
    }

    listing.status = action;
    this.metrics.flaggedListingsCount = this.flaggedListings.filter((l) => l.status === 'PENDING').length;

    logger.info('ADMIN_SERVICE', `Listing ${listingId} moderated: ${action}`);
    return { ...listing };
  }

  public async getEscrowTransactions(): Promise<AdminEscrowTransaction[]> {
    return [...this.escrowTransactions];
  }

  public async forceReleaseEscrow(escrowId: string): Promise<AdminEscrowTransaction> {
    const txn = this.escrowTransactions.find((e) => e.id === escrowId);
    if (!txn) {
      throw new Error(`Escrow transaction not found: ${escrowId}`);
    }

    txn.escrowStatus = 'RELEASED_TO_ARTISAN';
    txn.hoursRemaining = 0;
    txn.hasDispute = false;

    this.metrics.totalEscrowLocked = Math.max(0, this.metrics.totalEscrowLocked - txn.amount);
    this.metrics.activeDisputesCount = this.escrowTransactions.filter((e) => e.hasDispute).length;

    logger.info('ADMIN_SERVICE', `Escrow ${escrowId} released to artisan`);
    return { ...txn };
  }

  public async resolveDispute(
    escrowId: string,
    resolution: 'REFUND_BUYER' | 'RELEASE_TO_ARTISAN'
  ): Promise<AdminEscrowTransaction> {
    const txn = this.escrowTransactions.find((e) => e.id === escrowId);
    if (!txn) {
      throw new Error(`Escrow transaction not found: ${escrowId}`);
    }

    txn.hasDispute = false;
    if (resolution === 'REFUND_BUYER') {
      txn.escrowStatus = 'REFUNDED_TO_BUYER';
    } else {
      txn.escrowStatus = 'RELEASED_TO_ARTISAN';
    }
    txn.hoursRemaining = 0;

    this.metrics.totalEscrowLocked = Math.max(0, this.metrics.totalEscrowLocked - txn.amount);
    this.metrics.activeDisputesCount = this.escrowTransactions.filter((e) => e.hasDispute).length;

    logger.info('ADMIN_SERVICE', `Dispute resolved for ${escrowId}: ${resolution}`);
    return { ...txn };
  }
}

export const adminService = new AdminService();
