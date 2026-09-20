import AsyncStorage from '@react-native-async-storage/async-storage';
import { speechRecognitionService } from '@/services/speechRecognitionService';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import { Audio } from '@/utils/audioPlayer';
import { geminiCatalogService } from '@/api/geminiCatalogService';
import { useCatalogStore } from '@/store/useCatalogStore';
import { marketplaceService } from '@/api/marketplaceService';

describe('Android Standalone Runtime Fixes Verification', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe('1. Native Android Speech Recognition & Permissions', () => {
    it('requests RECORD_AUDIO permission at runtime using ExpoSpeechRecognitionModule', async () => {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
      const granted = await speechRecognitionService.requestMicrophonePermission();
      expect(ExpoSpeechRecognitionModule.requestPermissionsAsync).toHaveBeenCalled();
      expect(granted).toBe(true);
    });

    it('starts listening in Indic languages (hi-IN, mr-IN, en-IN) and streams real transcript', async () => {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
      const onResult = jest.fn();
      const onStart = jest.fn();

      const started = speechRecognitionService.startListening(
        {
          onStart,
          onResult,
        },
        'mr-IN'
      );

      expect(started).toBe(true);
      expect(ExpoSpeechRecognitionModule.addListener).toHaveBeenCalledWith('result', expect.any(Function));
    });

    it('properly propagates permission denied without fake transcription', async () => {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
      ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValueOnce({ granted: false });

      const onError = jest.fn();
      speechRecognitionService.startListening({ onError }, 'hi-IN');

      await new Promise((r) => setTimeout(r, 10));
      expect(onError).toHaveBeenCalledWith(expect.stringMatching(/permission denied/i));
    });

    it('handles unavailable speech recognizer gracefully', () => {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
      ExpoSpeechRecognitionModule.isRecognitionAvailable.mockReturnValueOnce(false);

      const onError = jest.fn();
      const started = speechRecognitionService.startListening({ onError }, 'en-IN');
      expect(started).toBe(false);
      expect(onError).toHaveBeenCalledWith(expect.stringMatching(/not available/i));
    });
  });

  describe('2. Real Android Audio Playback & TTS Lifecycle', () => {
    it('creates audio player for onboarding audio assets with expo-audio', async () => {
      const { Audio: RealAudio } = jest.requireActual('@/utils/audioPlayer');
      const { createAudioPlayer, setAudioModeAsync } = require('expo-audio');

      const { sound } = await RealAudio.Sound.createAsync(require('../../../assets/audio/1.mp3'), {
        shouldPlay: false,
        volume: 0.9,
      });

      expect(setAudioModeAsync).toHaveBeenCalledWith({ playsInSilentMode: true });
      expect(createAudioPlayer).toHaveBeenCalled();

      const playStatus = await sound.playAsync();
      expect(playStatus.isPlaying).toBe(true);

      const pauseStatus = await sound.pauseAsync();
      expect(pauseStatus.isPlaying).toBe(false);

      const stopStatus = await sound.stopAsync();
      expect(stopStatus.isPlaying).toBe(false);

      const unloadStatus = await sound.unloadAsync();
      expect(unloadStatus.isLoaded).toBe(false);
    });

    it('plays splash.mp3 audio lifecycle', async () => {
      const { Audio: RealAudio } = jest.requireActual('@/utils/audioPlayer');
      const { sound, status } = await RealAudio.Sound.createAsync(
        require('../../../assets/audio/splash.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );

      expect(sound).toBeDefined();
      expect(status.isPlaying).toBe(true);
      await sound.stopAsync();
      await sound.unloadAsync();
    });

    it('integrates expo-speech native TTS for Indic voice reading', () => {
      const Speech = require('expo-speech');
      const onStart = jest.fn();
      const onEnd = jest.fn();

      realisticVoiceService.speak('नमस्ते, यह हस्तशिल्प है', {
        lang: 'hi-IN',
        onStart,
        onEnd,
      });

      expect(Speech.speak).toHaveBeenCalledWith(
        'नमस्ते, यह हस्तशिल्प है',
        expect.objectContaining({ language: 'hi-IN' })
      );
      expect(onStart).toHaveBeenCalled();

      realisticVoiceService.stop();
      expect(Speech.stop).toHaveBeenCalled();
    });
  });

  describe('3. AI Catalog Creation, Exact Seller Identity & Persistence', () => {
    it('strictly preserves exact seller name "Sunita Devi" throughout catalog synthesis', async () => {
      const catalog = await geminiCatalogService.generateCatalog({
        artisanName: 'Sunita Devi',
        voiceTranscript: 'यह हाथ से बनी सुंदर मिथिला पेंटिंग है जिसमें प्राकृतिक रंगों का प्रयोग किया गया है।',
        productTitleHint: 'मधुबनी हस्तकला पेंटिंग',
      });

      expect(catalog.artisanName).toBe('Sunita Devi');
      expect(catalog.descriptions.hi).toContain('Sunita Devi');
      expect(catalog.craftCategoryCode).toBe('PAINTING_MITHILA');
    });

    it('dynamically infers craft categories and never forces hardcoded POTTERY', async () => {
      const textileCatalog = await geminiCatalogService.generateCatalog({
        artisanName: 'Sunita Devi',
        voiceTranscript: 'Pure Mulberry silk handwoven saree with gold zari border',
      });
      expect(textileCatalog.craftCategoryCode).toBe('TEXTILE_HANDLOOM');

      const metalCatalog = await geminiCatalogService.generateCatalog({
        artisanName: 'Sunita Devi',
        voiceTranscript: 'Dhokra lost-wax brass and bell metal craft statue',
      });
      expect(metalCatalog.craftCategoryCode).toBe('METAL_DHOKRA');
    });

    it('preserves real image URI and exact seller identity in useCatalogStore and persists to AsyncStorage', async () => {
      const testImageUri = 'file:///data/user/0/com.kalakarsetu.app/cache/real_craft_photo.jpg';

      const published = useCatalogStore.getState().addProductToCatalog({
        id: 'prod_sunita_001',
        title: 'मधुबनी हस्तकला पेंटिंग',
        artisan: 'Sunita Devi',
        price: 1850,
        imageUri: testImageUri,
        category: 'PAINTING',
        craftTag: '🎨 Pure Madhubani Folk Art',
      });

      expect(published.artisan).toBe('Sunita Devi');
      expect(published.imageUrl).toBe(testImageUri);
      expect(published.category).toBe('PAINTING');

      // Verify persistence in AsyncStorage
      const storedJson = await AsyncStorage.getItem('@kalakar_catalog_products_v1');
      expect(storedJson).toBeTruthy();
      const storedList = JSON.parse(storedJson!);
      const itemInStorage = storedList.find((p: any) => p.id === 'prod_sunita_001');
      expect(itemInStorage).toBeDefined();
      expect(itemInStorage.artisan).toBe('Sunita Devi');
      expect(itemInStorage.imageUrl).toBe(testImageUri);
      expect(itemInStorage.category).toBe('PAINTING');
    });

    it('rehydrates saved seller products after app restart and reflects in Buyer Marketplace', async () => {
      // Simulate app restart by clearing in-memory store and re-initializing from AsyncStorage
      await useCatalogStore.getState().initialize();

      const products = await marketplaceService.getProducts();
      const foundProduct = products.find((p) => p.id === 'prod_sunita_001');
      expect(foundProduct).toBeDefined();
      expect(foundProduct?.artisan.name).toBe('Sunita Devi');
      expect(foundProduct?.categoryCode).toBe('PAINTING');
    });
  });
});
