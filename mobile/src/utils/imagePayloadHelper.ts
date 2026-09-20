import { logger } from './logger';

export interface ResolvedImagePayload {
  base64: string;
  mimeType: string;
  byteCount: number;
}

/**
 * Resolves any image input (local file://, content://, data:image/..., or https://)
 * into a valid base64 payload with detected MIME type for Multimodal Vision AI.
 */
export async function resolveImagePayload(
  uriOrBase64?: string | null
): Promise<ResolvedImagePayload | null> {
  if (!uriOrBase64 || typeof uriOrBase64 !== 'string') {
    logger.warn('AI-VISION', 'No image URI or base64 provided to resolver');
    return null;
  }

  const trimmed = uriOrBase64.trim();
  if (trimmed.length === 0) return null;

  try {
    // 1. Check if already a Data URL (e.g. data:image/jpeg;base64,...)
    if (trimmed.startsWith('data:')) {
      const match = trimmed.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        const mimeType = match[1] || 'image/jpeg';
        const base64 = match[2].replace(/\s/g, '');
        const byteCount = Math.round((base64.length * 3) / 4);

        logger.info('AI-VISION', 'Resolved image from data URI', {
          imageUri: 'data:[present]',
          mimeType,
          imageBytes: 'present',
          byteCount,
          visionRequest: 'ready',
        });

        return { base64, mimeType, byteCount };
      }
    }

    // 2. Check if already clean raw base64 string
    const isCleanBase64 =
      !trimmed.includes('://') &&
      !trimmed.startsWith('file:') &&
      !trimmed.startsWith('content:') &&
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('\\') &&
      /^[A-Za-z0-9+/=\s]+$/.test(trimmed) &&
      trimmed.length > 40;

    if (isCleanBase64) {
      const cleanData = trimmed.replace(/\s/g, '');
      const byteCount = Math.round((cleanData.length * 3) / 4);
      logger.info('AI-VISION', 'Resolved image from direct base64', {
        imageUri: 'raw_base64',
        mimeType: 'image/jpeg',
        imageBytes: 'present',
        byteCount,
        visionRequest: 'ready',
      });
      return {
        base64: cleanData,
        mimeType: 'image/jpeg',
        byteCount,
      };
    }

    // 3. Resolve local file (file://), Android content URI (content://), or remote HTTP URL
    let mimeType = 'image/jpeg';
    if (trimmed.toLowerCase().endsWith('.png')) {
      mimeType = 'image/png';
    } else if (trimmed.toLowerCase().endsWith('.webp')) {
      mimeType = 'image/webp';
    } else if (trimmed.toLowerCase().endsWith('.gif')) {
      mimeType = 'image/gif';
    }

    const response = await fetch(trimmed);
    const blob = await response.blob();

    if (blob.type && blob.type.startsWith('image/')) {
      mimeType = blob.type;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && result.includes('base64,')) {
          resolve(result.split('base64,')[1].replace(/\s/g, ''));
        } else {
          reject(new Error('FileReader did not return base64 string'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });

    const byteCount = Math.round((base64.length * 3) / 4);

    logger.info('AI-VISION', 'Resolved image bytes from URI', {
      imageUri: 'present',
      mimeType,
      imageBytes: 'present',
      byteCount,
      visionRequest: 'ready',
    });

    return {
      base64,
      mimeType,
      byteCount,
    };
  } catch (error) {
    logger.error('AI-VISION', 'Failed to resolve image payload from URI', error);
    return null;
  }
}
