import { visionService, StageInfo } from '@/api/visionService';

describe('VisionService', () => {
  it('enhances product photo and reports stage progress', async () => {
    const progressStages: StageInfo[] = [];

    const result = await visionService.enhancePhoto(
      'file:///mock/raw_photo.jpg',
      'TEXTILE_HANDLOOM',
      (info) => {
        progressStages.push(info);
      }
    );

    expect(result.enhanced_asset_url).toBeDefined();
    expect(result.quality_metrics.segmentation_confidence).toBeGreaterThan(0.9);
    expect(result.quality_metrics.sharpness_score).toBeGreaterThan(0.9);
    expect(result.quality_metrics.color_accuracy_score).toBeGreaterThan(0.9);
    expect(progressStages.length).toBeGreaterThanOrEqual(3);
  });

  it('analyzes image quality heuristics with score', () => {
    const analysis = visionService.analyzeImageQuality('file:///mock/photo.jpg');

    expect(analysis.status).toBe('GOOD');
    expect(analysis.sharpnessScore).toBeGreaterThanOrEqual(0.9);
    expect(analysis.messageHi).toContain('क्वालिटी');
  });
});
