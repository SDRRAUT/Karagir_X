import { imageProcessingService } from '@/services/imageProcessingService';
import { kalakarIpPassportService } from '@/services/kalakarIpPassportService';

describe('Smart Cataloger Services', () => {
  describe('ImageProcessingService', () => {
    it('should enhance craft image and return quality metrics', async () => {
      const mockUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/';
      const result = await imageProcessingService.enhanceCraftImage(mockUri);

      expect(result).toBeDefined();
      expect(result.originalUri).toBe(mockUri);
      expect(result.enhancedUri).toBeDefined();
      expect(result.metrics.brightnessScore).toBeGreaterThan(0);
      expect(result.metrics.sharpnessScore).toBeGreaterThan(0);
      expect(result.metrics.authenticityScore).toBe(100);
    });
  });

  describe('KalakarIpPassportService', () => {
    it('should generate a unique Kalakar IP Tag with cryptographic signature', () => {
      const ipTag = kalakarIpPassportService.generateIpTag({
        artisanName: 'Ramesh Kumbhar',
        district: 'Kolhapur',
        craftCategory: 'POTTERY_TERRACOTTA',
        productTitle: 'Handcrafted Terracotta Diya',
      });

      expect(ipTag.ipTagId).toMatch(/^KALAKAR-IP-MH-\d{4}-8492-[A-Z0-9]{4}$/);
      expect(ipTag.artisanName).toBe('Ramesh Kumbhar');
      expect(ipTag.artisanDistrict).toBe('Kolhapur');
      expect(ipTag.verificationUrl).toContain(ipTag.ipTagId);
      expect(ipTag.authenticityHash).toMatch(/^0x[0-9a-f]+$/);
      expect(ipTag.copyrightNotice).toContain('Ramesh Kumbhar');
    });
  });
});
