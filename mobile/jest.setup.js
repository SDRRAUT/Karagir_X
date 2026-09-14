/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// audioPlayer & expo-av mock: Sound immediately finishes synchronously to avoid blocking tests
const createAudioMock = () => {
  class Sound {
    constructor() {
      this._onStatus = null;
    }
    async loadAsync() { return { isLoaded: true }; }
    async playAsync() {
      if (this._onStatus) {
        this._onStatus({ isLoaded: true, isPlaying: false, didJustFinish: true });
      }
      return { isLoaded: true, isPlaying: false, didJustFinish: true };
    }
    async pauseAsync() { return { isLoaded: true, isPlaying: false, didJustFinish: false }; }
    async stopAsync() { return { isLoaded: true }; }
    async unloadAsync() { return { isLoaded: false }; }
    async getStatusAsync() { return { isLoaded: true, isPlaying: false, didJustFinish: true }; }
    setOnPlaybackStatusUpdate(fn) {
      this._onStatus = fn;
      // Immediately signal audio finished so isAudioPlaying becomes false synchronously in tests
      fn({ isLoaded: true, isPlaying: false, didJustFinish: true });
    }
    static async createAsync(_source, _status) {
      const sound = new Sound();
      return { sound, status: { isLoaded: true } };
    }
  }
  return {
    Sound,
    Audio: {
      Sound,
      setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    },
  };
};

jest.mock('@/utils/audioPlayer', () => createAudioMock());
jest.mock('expo-av', () => createAudioMock(), { virtual: true });

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style, ...rest }) =>
      React.createElement(View, { style, ...rest }, children),
  };
});


jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    CameraView: (props) => React.createElement(View, { testID: 'mock-camera-view', ...props }),
    useCameraPermissions: () => [
      { granted: true, canAskAgain: true },
      jest.fn().mockResolvedValue({ granted: true }),
    ],
  };
});

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file:///mock/imported_image.jpg', width: 1200, height: 1600 }],
  }),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn().mockResolvedValue(true),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true, null],
  Inter_400Regular: 'Inter_400Regular',
  Inter_500Medium: 'Inter_500Medium',
  Inter_600SemiBold: 'Inter_600SemiBold',
  Inter_700Bold: 'Inter_700Bold',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Supabase Test Mock for headless Jest execution
jest.mock('@/api/supabaseClient', () => {
  const mockUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'artisan@kalakarsetu.in',
    phone: '+919876543210',
  };

  const mockSession = {
    access_token: 'mock_sb_jwt_token',
    refresh_token: 'mock_sb_refresh_token',
    expires_in: 3600,
    user: mockUser,
  };

  const mockProducts = [
    {
      id: 'prod_mhb_01',
      title: { hi: 'हाथ से बनी मधुबनी मत्स्य पेंटिंग', en: 'Handcrafted Madhubani Fish Painting' },
      description: { hi: 'प्राकृतिक रंगों से बनी पवित्र लोक कला', en: 'Authentic Madhubani art' },
      selling_price: 2150,
      craft_category_code: 'PAINTING_FOLK',
      stock_type: 'READY_STOCK',
      materials: ['शुद्ध कॉटन पेपर', 'प्राकृतिक वनस्पति रंग'],
      technique: 'बांस की निब द्वारा हस्तचित्रण',
      labor_hours: 28,
      categories: [{ name_hi: 'मधुबनी व लोक चित्रकला', name_en: 'Folk Art' }],
      product_images: [{ raw_image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119', is_primary: true }],
      craft_passports: [{ passport_code: 'PASS-MTH-9021', carbon_score_grams: 120, qr_code_svg_url: 'https://example.com/qr', public_verification_url: 'https://kalakarsetu.in/passport/PASS-MTH-9021' }],
      profiles: {
        id: '00000000-0000-0000-0000-000000000001',
        full_name: 'सुनीता देवी (Sunita Devi)',
        avatar_url: null,
        artisan_profiles: [{ workshop_name: 'सुनीता मधुबनी आर्ट्स', district: 'Madhubani', state: 'Bihar', years_of_experience: 22 }],
      },
    },
  ];

  const mockCategories = [
    { code: 'TEXTILE_HANDLOOM', name_hi: 'हथकरघा व बुनाई', name_en: 'Handloom & Weaving', icon: '🧵', cluster_count: 420, popular_regions: [] },
    { code: 'POTTERY_CLAY', name_hi: 'टेराकोटा व मिट्टी शिल्प', name_en: 'Clay & Terracotta', icon: '🏺', cluster_count: 310, popular_regions: [] },
    { code: 'PAINTING_FOLK', name_hi: 'मधुबनी व लोक चित्रकला', name_en: 'Folk & Tribal Painting', icon: '🎨', cluster_count: 195, popular_regions: [] },
    { code: 'WOOD_CRAFT', name_hi: 'काष्ठकला व खिलौने', name_en: 'Woodcraft & Toys', icon: '🪵', cluster_count: 180, popular_regions: [] },
    { code: 'METAL_DHOKRA', name_hi: 'ढोकरा व कांस्य शिल्प', name_en: 'Dhokra & Bell Metal', icon: '🪙', cluster_count: 140, popular_regions: [] },
    { code: 'BAMBOO_JUTE', name_hi: 'बांस, बेत व जूट शिल्प', name_en: 'Bamboo & Jute', icon: '🎋', cluster_count: 220, popular_regions: [] },
  ];

  const createQueryBuilder = (table) => {
    let result = { data: null, error: null };
    if (table === 'products') {
      result = { data: mockProducts, error: null };
    } else if (table === 'categories') {
      result = { data: mockCategories, error: null };
    } else if (table === 'profiles') {
      result = {
        data: {
          id: '00000000-0000-0000-0000-000000000001',
          phone_number: '+919876543210',
          full_name: 'Sunita Devi',
          role: 'ARTISAN',
          preferred_language: 'hi_IN',
          is_profile_complete: true,
          artisan_profiles: [{ craft_category_code: 'PAINTING_FOLK', district: 'Madhubani', state: 'Bihar' }],
        },
        error: null,
      };
    } else if (table === 'orders') {
      result = {
        data: {
          id: 'ord_123',
          order_number: 'KS-OD-123456',
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    } else if (table === 'sub_orders') {
      result = {
        data: {
          id: 'sub_123',
          sub_order_number: 'KS-OD-123456-A1',
        },
        error: null,
      };
    }

    let currentData = null;
    const builder = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockImplementation((payload) => {
        if (table === 'products') {
          const inserted = Array.isArray(payload) ? payload[0] : payload;
          const insertedProduct = {
            id: inserted.id || 'prod_123',
            ...inserted,
            created_at: new Date().toISOString(),
          };
          result = { data: insertedProduct, error: null };
          currentData = insertedProduct;
        }
        return builder;
      }),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation((col, val) => {
        if (col === 'id' && Array.isArray(result.data)) {
          const found = result.data.find((item) => item.id === val);
          if (found) {
            currentData = found;
          }
        }
        return builder;
      }),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => {
        const d = currentData || (Array.isArray(result.data) ? result.data[0] : result.data);
        return Promise.resolve({ data: d, error: result.error });
      }),
      maybeSingle: jest.fn().mockImplementation(() => {
        const d = currentData || (Array.isArray(result.data) ? result.data[0] : result.data);
        return Promise.resolve({ data: d, error: result.error });
      }),
      then: (resolve) => resolve(result),
    };
    return builder;
  };

  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
        signInWithOtp: jest.fn().mockResolvedValue({ data: {}, error: null }),
        verifyOtp: jest.fn().mockResolvedValue({ data: { session: mockSession, user: mockUser }, error: null }),
        signInWithPassword: jest.fn().mockResolvedValue({ data: { session: mockSession, user: mockUser }, error: null }),
        signUp: jest.fn().mockResolvedValue({ data: { session: mockSession, user: mockUser }, error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      },
      from: jest.fn().mockImplementation(createQueryBuilder),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({ data: { path: 'mock_path.jpg' }, error: null }),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/mock.jpg' } }),
        }),
      },
    },
  };
});

// expo-audio Mock
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    seekTo: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    playing: false,
    duration: 5,
    currentTime: 0,
  })),
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  setIsAudioActiveAsync: jest.fn().mockResolvedValue(undefined),
  requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
  getRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
}));

// expo-speech Mock
jest.mock('expo-speech', () => ({
  speak: jest.fn().mockImplementation((text, options) => {
    options?.onStart?.();
    options?.onDone?.();
  }),
  stop: jest.fn().mockResolvedValue(undefined),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  getAvailableVoicesAsync: jest.fn().mockResolvedValue([]),
}));

// expo-speech-recognition Mock
const speechListeners = {};
jest.mock('expo-speech-recognition', () => ({
  ExpoSpeechRecognitionModule: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
    getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
    isRecognitionAvailable: jest.fn().mockReturnValue(true),
    getSpeechRecognitionServices: jest.fn().mockReturnValue([
      'com.google.android.googlequicksearchbox',
      'com.google.android.tts',
    ]),
    getDefaultRecognitionService: jest.fn().mockReturnValue({
      packageName: 'com.google.android.googlequicksearchbox',
    }),
    getAssistantService: jest.fn().mockReturnValue({
      packageName: 'com.google.android.googlequicksearchbox',
    }),
    start: jest.fn().mockImplementation(() => {
      if (speechListeners['result']) {
        speechListeners['result']({
          results: [{ transcript: 'यह हाथ से बना पारंपरिक टेराकोटा फूलदान है, प्राकृतिक मिट्टी से तैयार किया गया।' }],
          isFinal: true,
        });
      }
      // Native start() is synchronous and returns void (undefined)
      return undefined;
    }),
    stop: jest.fn().mockImplementation(() => {
      if (speechListeners['end']) {
        speechListeners['end']();
      }
      return undefined;
    }),
    abort: jest.fn().mockImplementation(() => undefined),
    addListener: jest.fn().mockImplementation((event, cb) => {
      speechListeners[event] = cb;
      return {
        remove: jest.fn(() => {
          delete speechListeners[event];
        }),
      };
    }),
  },
}));

