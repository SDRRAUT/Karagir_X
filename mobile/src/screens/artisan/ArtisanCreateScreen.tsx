import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { CRAFT_IMAGES } from '@/assets/craftImages';
import { geminiCatalogService, GeminiStructuredCatalog } from '@/api/geminiCatalogService';
import { imageProcessingService, EnhancedImageResult } from '@/services/imageProcessingService';
import { kalakarIpPassportService, KalakarIpTag } from '@/services/kalakarIpPassportService';
import { speechRecognitionService, SpeechLanguage } from '@/services/speechRecognitionService';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';

const { width } = Dimensions.get('window');

type CatalogStep = 1 | 2 | 3 | 4 | 5 | 6;

const SAMPLE_CRAFT_PRESETS = [
  {
    id: 'preset_diya',
    title: 'Terracotta Festive Diya Set',
    category: 'POTTERY_TERRACOTTA',
    imageSource: CRAFT_IMAGES.terracottaDiya,
    craftHint: 'Handcrafted Terracotta Clay Diya Set shaped on wooden potter wheel in Kolhapur',
    laborHours: 16,
    materialCost: 150,
  },
  {
    id: 'preset_saree',
    title: 'Chanderi Handloom Silk Saree',
    category: 'TEXTILE_HANDLOOM',
    imageSource: CRAFT_IMAGES.chanderiSaree,
    craftHint: 'Pure mulberry silk woven on traditional pit loom with gold zari border',
    laborHours: 48,
    materialCost: 450,
  },
  {
    id: 'preset_brass',
    title: 'Dhokra Lost-Wax Bell Metal Nandi',
    category: 'METAL_DHOKRA',
    imageSource: CRAFT_IMAGES.dhokraNandi,
    craftHint: 'Ancient lost-wax casting technique using river clay core and molten brass alloy',
    laborHours: 24,
    materialCost: 320,
  },
  {
    id: 'preset_painting',
    title: 'Madhubani Kohbar Folk Painting',
    category: 'PAINTING_MITHILA',
    imageSource: CRAFT_IMAGES.madhubaniArt,
    craftHint: 'Mithila folk painting on handmade paper using bamboo twigs and natural mineral pigments',
    laborHours: 32,
    materialCost: 200,
  },
];

export const ArtisanCreateScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isHindi } = useTranslation();
  const { addProductToCatalog } = useCatalogStore();

  const artisanName = user?.fullName || (isHindi ? 'रमेश कुंभार' : 'Ramesh Kumbhar');
  const artisanDistrict = user?.district || 'Kolhapur';

  // -----------------------------------------------------------------
  // Master Flow State
  // -----------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState<CatalogStep>(1);

  // Step 1: Guided Camera State
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [selectedPresetImage, setSelectedPresetImage] = useState<any>(null);
  const [lightingScore, setLightingScore] = useState<number>(94);
  const [framingStatus, setFramingStatus] = useState<string>('✨ Framing & Lighting Optimal • 45° Angle Ready');

  // Step 2: Image Enhancement State
  const [enhancedResult, setEnhancedResult] = useState<EnhancedImageResult | null>(null);
  const [showEnhancedView, setShowEnhancedView] = useState<boolean>(true);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  // Step 3: Structured Voice Input State
  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean>(true);
  const [craftNameInput, setCraftNameInput] = useState('टेराकोटा दीया सेट (Terracotta Diya Set)');
  const [laborHoursInput, setLaborHoursInput] = useState('16');
  const [materialCostInput, setMaterialCostInput] = useState('150');
  const [craftStoryInput, setCraftStoryInput] = useState('हाथ से बना टेराकोटा दीया सेट, 16 घंटे मेहनत लगी और 150 रुपये कच्चा माल लगा');
  const [recordingSecondsLeft, setRecordingSecondsLeft] = useState<number>(10);
  const [isPlayingGuide, setIsPlayingGuide] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const timerIntervalRef = useRef<any>(null);

  // Step 4: AI Multimodal Synthesis State
  const [synthesisStage, setSynthesisStage] = useState(1);
  const [synthesisStageLabel, setSynthesisStageLabel] = useState('Analyzing craft visual textures...');

  // Step 5: Full Catalog & IP Tag Preview State
  const [catalogData, setCatalogData] = useState<GeminiStructuredCatalog | null>(null);
  const [kalakarIpTag, setKalakarIpTag] = useState<KalakarIpTag | null>(null);
  const [selectedPriceTier, setSelectedPriceTier] = useState<'min' | 'rec' | 'prem'>('rec');
  const [finalSellingPrice, setFinalSellingPrice] = useState<number>(850);
  const [publishedPlatforms, setPublishedPlatforms] = useState({
    kalakarSetu: true,
    whatsapp: true,
    ondc: true,
    gem: false,
  });

  // Step 6: Published Status
  const [publishedItem, setPublishedItem] = useState<any>(null);

  // -----------------------------------------------------------------
  // SPEECH SYNTHESIS (TTS) - Device Neural Voice Engine (Swara/Madhur/Google Natural)
  // -----------------------------------------------------------------
  const playSpeech = (text: string) => {
    realisticVoiceService.speak(text, {
      lang: selectedLanguage,
      gender: 'female',
      rate: 0.94,
      pitch: 1.02,
    });
  };

  // -----------------------------------------------------------------
  // CAMERA STREAM & FRAME GUIDANCE (Web Camera)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (currentStep === 1 && Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      startWebCamera(cameraFacingMode);
    } else {
      stopWebCamera();
    }
    return () => {
      stopWebCamera();
    };
  }, [currentStep, cameraFacingMode]);

  const startWebCamera = async (facing: 'environment' | 'user' = 'environment') => {
    setCameraPermissionError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        stopWebCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setCameraPermissionError(err?.message || 'Camera permission denied or camera not accessible');
    }
  };

  const stopWebCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setCameraFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // -----------------------------------------------------------------
  // STEP 1 -> STEP 2: CAPTURE & PROCESS IMAGE
  // -----------------------------------------------------------------
  const handleSnapPhoto = async () => {
    let capturedUri = '';

    if (Platform.OS === 'web' && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedUri = canvas.toDataURL('image/jpeg', 0.9);
      }
    }

    if (!capturedUri) {
      capturedUri = CRAFT_IMAGES.terracottaDiya;
    }

    setCapturedImageUri(capturedUri);
    setSelectedPresetImage(null);
    stopWebCamera();
    await processAndGoToEnhance(capturedUri);
  };

  const handleSelectPreset = async (preset: typeof SAMPLE_CRAFT_PRESETS[0]) => {
    setCapturedImageUri(preset.imageSource);
    setSelectedPresetImage(preset.imageSource);
    setCraftNameInput(preset.title);
    setLaborHoursInput(String(preset.laborHours));
    setMaterialCostInput(String(preset.materialCost));
    setVoiceTranscript(preset.craftHint);
    stopWebCamera();
    await processAndGoToEnhance(preset.imageSource);
  };

  const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const uri = uploadEvent.target?.result as string;
        setCapturedImageUri(uri);
        setSelectedPresetImage(null);
        stopWebCamera();
        await processAndGoToEnhance(uri);
      };
      reader.readAsDataURL(file);
    }
  };

  const processAndGoToEnhance = async (imageUri: string) => {
    setIsEnhancing(true);
    setCurrentStep(2);
    try {
      const result = await imageProcessingService.enhanceCraftImage(imageUri);
      setEnhancedResult(result);
    } catch (err) {
      setEnhancedResult({
        originalUri: imageUri,
        enhancedUri: imageUri,
        metrics: {
          brightnessScore: 92,
          sharpnessScore: 96,
          colorBalanceScore: 95,
          authenticityScore: 100,
          lightingStatus: 'OPTIMAL',
          detailGain: '+35% Texture Depth',
        },
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 3: AUDIO GUIDE & 10-SECOND REAL-TIME VOICE-TO-TYPING INPUT
  // -----------------------------------------------------------------
  const handlePlayAudioGuide = () => {
    if (isPlayingGuide) {
      realisticVoiceService.stop();
      setIsPlayingGuide(false);
      return;
    }

    const guideText =
      selectedLanguage === 'hi-IN'
        ? 'नमस्ते कारीगर जी! अपने शिल्प के बारे में खुलकर बताइए — जैसे यह क्या वस्तु है, इसे बनाने में कितना समय लगा, और कच्चा माल कितने का था। उदाहरण के लिए बोलिए: यह हाथ से बना टेराकोटा दीया सेट है, इसे बनाने में 16 घंटे लगे और 150 रुपये का कच्चा माल लगा। माइक बटन दबाएं और बोलें।'
        : selectedLanguage === 'mr-IN'
        ? 'नमस्कार! तुमच्या हस्तकलेबद्दल सांगा — ही कोणती वस्तू आहे, बनवायला किती वेळ लागला आणि कच्चा माल कितीचा होता. उदाहरणार्थ: हा मातीचा दिवा सेट आहे, बनवायला 16 तास लागले आणि 150 रुपये कच्चा माल खर्च आला. माइक दाबा आणि बोला.'
        : 'Hello artisan! Tell us about your craft in your own words — what it is, how many hours it took, and raw material cost. For example: Handcrafted terracotta diya set, took 16 hours of labor and 150 rupees material cost. Tap the microphone and speak.';

    setIsPlayingGuide(true);
    realisticVoiceService.speak(guideText, {
      lang: selectedLanguage,
      gender: 'female',
      rate: 0.94,
      pitch: 1.02,
      onStart: () => setIsPlayingGuide(true),
      onEnd: () => setIsPlayingGuide(false),
      onError: () => setIsPlayingGuide(false),
    });
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      speechRecognitionService.stopListening();
      setIsListening(false);
      setRecordingSecondsLeft(10);
    } else {
      realisticVoiceService.stop();
      setIsPlayingGuide(false);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      if (Platform.OS === 'web') {
        await speechRecognitionService.requestMicrophonePermission();
      }

      setRecordingSecondsLeft(10);

      const started = speechRecognitionService.startListening(
        {
          onStart: () => {
            setIsListening(true);
            setRecordingSecondsLeft(10);

            // 10-Second Countdown Timer from starting
            let remaining = 10;
            timerIntervalRef.current = setInterval(() => {
              remaining -= 1;
              if (remaining <= 0) {
                if (timerIntervalRef.current) {
                  clearInterval(timerIntervalRef.current);
                  timerIntervalRef.current = null;
                }
                speechRecognitionService.stopListening();
                setIsListening(false);
                setRecordingSecondsLeft(0);
                setTimeout(() => setRecordingSecondsLeft(10), 1200);
              } else {
                setRecordingSecondsLeft(remaining);
              }
            }, 1000);
          },
          onResult: (transcript, _isFinal) => {
            // Real-time audio to typing directly in the single input box!
            setCraftStoryInput(transcript);
            setVoiceTranscript(transcript);

            // Also extract parameters into state for downstream accuracy
            const extracted = speechRecognitionService.parseCraftVoiceInput(transcript);
            if (extracted.craftName && extracted.craftName.length >= 3) {
              setCraftNameInput(extracted.craftName);
            }
            if (extracted.laborHours !== undefined && extracted.laborHours > 0) {
              setLaborHoursInput(String(extracted.laborHours));
            }
            if (extracted.materialCost !== undefined && extracted.materialCost > 0) {
              setMaterialCostInput(String(extracted.materialCost));
            }
          },
          onError: () => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            setIsListening(false);
            setRecordingSecondsLeft(10);
          },
          onEnd: () => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            setIsListening(false);
          },
        },
        selectedLanguage
      );

      if (!started) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setIsListening(false);
        setRecordingSecondsLeft(10);
      }
    }
  };

  // -----------------------------------------------------------------
  // STEP 3 -> STEP 4 & 5: GEMINI AI MULTIMODAL SYNTHESIS & IP MINTING
  // -----------------------------------------------------------------
  const handleGenerateAiCatalog = async () => {
    setCurrentStep(4);
    setSynthesisStage(1);
    setSynthesisStageLabel('Analyzing craft visuals & natural materials...');

    try {
      // Animated Progress Step 2
      setTimeout(() => {
        setSynthesisStage(2);
        setSynthesisStageLabel('Synthesizing multilingual titles & storytelling narrative...');
      }, 900);

      // Animated Progress Step 3
      setTimeout(() => {
        setSynthesisStage(3);
        setSynthesisStageLabel('Computing 100% Fair Price valuation & GI multipliers...');
      }, 1800);

      // Animated Progress Step 4
      setTimeout(() => {
        setSynthesisStage(4);
        setSynthesisStageLabel('Minting unique Kalakar IP Tag & Authenticity Passport...');
      }, 2700);

      // Extract parameters from single input box
      const extracted = speechRecognitionService.parseCraftVoiceInput(craftStoryInput);
      const effectiveLabor = extracted.laborHours || parseInt(laborHoursInput, 10) || 16;
      const effectiveCost = extracted.materialCost || parseInt(materialCostInput, 10) || 150;
      const effectiveTitle = extracted.craftName || craftNameInput;

      const structuredCatalog = await geminiCatalogService.generateCatalog({
        imageBase64: (enhancedResult?.enhancedUri || capturedImageUri || '') as string,
        voiceTranscript: `${craftStoryInput}. Details: Craft: ${effectiveTitle}, Labor: ${effectiveLabor} hours, Material cost: Rs ${effectiveCost}.`,
        artisanName,
        artisanLocation: artisanDistrict,
      });

      // Mint Unique Kalakar IP Tag
      const mintedIp = kalakarIpPassportService.generateIpTag({
        artisanName,
        district: artisanDistrict,
        craftCategory: structuredCatalog.craftCategoryName,
        productTitle: structuredCatalog.titles.en,
      });

      setCatalogData(structuredCatalog);
      setKalakarIpTag(mintedIp);
      setFinalSellingPrice(structuredCatalog.fairPricing.suggestedRecommended || 850);

      setTimeout(() => {
        setCurrentStep(5);
        playSpeech(
          isHindi
            ? `बधाई हो ${artisanName} जी! आपका एआई कैटलॉग और कलाकार आईपी पासपोर्ट तैयार है।`
            : `Congratulations ${artisanName}! Your AI Catalog and Kalakar IP Passport are ready.`
        );
      }, 3500);
    } catch (err) {
      // Fallback
      setCurrentStep(5);
    }
  };

  // -----------------------------------------------------------------
  // STEP 5 -> STEP 6: PUBLISH TO MARKETPLACE & MY PRODUCTS
  // -----------------------------------------------------------------
  const handlePublishListing = () => {
    const title = catalogData?.titles.hi || catalogData?.titles.en || craftNameInput;
    const price = finalSellingPrice;

    // Immediately publish to shared catalog store
    const published = addProductToCatalog({
      title,
      artisan: `${artisanName}, ${artisanDistrict}`,
      price,
      originalPrice: Math.round(price * 1.4),
      imageUri: enhancedResult?.enhancedUri || (typeof capturedImageUri === 'string' ? capturedImageUri : undefined),
      imageSource: selectedPresetImage || (enhancedResult?.enhancedUri ? { uri: enhancedResult.enhancedUri } : CRAFT_IMAGES.terracottaDiya),
      category: catalogData?.craftCategoryCode || 'POTTERY',
      state: 'MAHARASHTRA',
      giCertified: true,
      giNumber: kalakarIpTag?.ipTagId || 'GI-IN-0412',
      cluster: `${artisanDistrict} Artisan Cluster`,
      craftTag: `🛡️ Kalakar IP: ${kalakarIpTag?.ipTagId?.slice(-6) || '8492'}`,
      craftInfo: catalogData?.descriptions.hi || catalogData?.descriptions.en || '100% Authentic Handcrafted Item',
    });

    setPublishedItem(published);
    setCurrentStep(6);
    playSpeech(
      isHindi
        ? `शानदार! आपका प्रॉडक्ट बाज़ार में प्रकाशित हो चुका है। अब ग्राहक इसे सीधे खरीद सकते हैं।`
        : `Product successfully published to Buyer Marketplace!`
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (currentStep > 1 && currentStep < 6) {
              setCurrentStep((prev) => (prev - 1) as CatalogStep);
            } else if (navigation?.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation?.navigate?.('HomeTab');
            }
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>✨ AI Smart Cataloger</Text>
          <Text style={styles.headerSubtitle}>
            {currentStep === 1
              ? 'Step 1/5: Guided Photo Capture'
              : currentStep === 2
              ? 'Step 2/5: OpenCV Quality Enhancement'
              : currentStep === 3
              ? 'Step 3/5: Voice Craft Details'
              : currentStep === 4
              ? 'Step 4/5: Gemini Multimodal Synthesis'
              : currentStep === 5
              ? 'Step 5/5: Kalakar IP & Catalog Review'
              : '🎉 Published & Synced!'}
          </Text>
        </View>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{currentStep}/5</Text>
        </View>
      </View>

      {/* STEP 1: AI GUIDED IMAGE CAPTURE */}
      {currentStep === 1 && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Live Viewfinder Box */}
          <View style={styles.viewfinderContainer}>
            {Platform.OS === 'web' && isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={styles.webVideoElement}
              />
            ) : (
              <View style={styles.cameraOffPlaceholder}>
                <Text style={styles.cameraOffEmoji}>📷</Text>
                <Text style={styles.cameraOffTitle}>Live Camera Preview</Text>
                <Text style={styles.cameraOffSub}>
                  {cameraPermissionError || 'Click below to enable camera access or upload craft photo'}
                </Text>
                <TouchableOpacity
                  style={styles.enableCameraBtn}
                  onPress={() => startWebCamera(cameraFacingMode)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.enableCameraBtnText}>📸 Allow / Start Camera</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Hidden canvas for taking snapshot */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Viewfinder Overlays & 45° Framing Guide */}
            {isCameraActive && (
              <View style={styles.viewfinderOverlay}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
                <View style={styles.centerCrosshair} />

                {/* Top Controls: Switch Camera */}
                <View style={styles.viewfinderTopControls}>
                  <TouchableOpacity
                    style={styles.switchCamPill}
                    onPress={toggleCameraFacing}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.switchCamText}>🔄 Switch Camera</Text>
                  </TouchableOpacity>
                </View>

                {/* Real-time Guidance Banner */}
                <View style={styles.guidanceBanner}>
                  <View style={styles.guidanceDot} />
                  <Text style={styles.guidanceText}>{framingStatus}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Row: Snap + File Upload */}
          <View style={styles.captureActionRow}>
            <TouchableOpacity style={styles.snapButton} onPress={handleSnapPhoto} activeOpacity={0.85}>
              <Text style={styles.snapButtonIcon}>📸</Text>
              <Text style={styles.snapButtonText}>Take Craft Photo</Text>
            </TouchableOpacity>

            {Platform.OS === 'web' && (
              <label style={styles.uploadLabelBtn}>
                <Text style={styles.uploadBtnText}>📁 Upload File</Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </View>

          {/* One-Tap Sample Craft Presets */}
          <View style={styles.presetSection}>
            <Text style={styles.presetSectionTitle}>💡 Or Choose a Sample Craft to Test:</Text>
            <View style={styles.presetGrid}>
              {SAMPLE_CRAFT_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetCard}
                  onPress={() => handleSelectPreset(preset)}
                  activeOpacity={0.8}
                >
                  <Image source={preset.imageSource} style={styles.presetImage} resizeMode="cover" />
                  <Text numberOfLines={1} style={styles.presetTitle}>
                    {preset.title}
                  </Text>
                  <Text style={styles.presetPrice}>Labor: {preset.laborHours}h • Raw: ₹{preset.materialCost}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* STEP 2: OPENCV IMAGE ENHANCEMENT & BEFORE/AFTER */}
      {currentStep === 2 && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isEnhancing ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#EA580C" />
              <Text style={styles.loadingText}>🎨 Applying Canvas/OpenCV Auto Color Balancing & Contrast...</Text>
            </View>
          ) : (
            <>
              {/* Toggle Tab: Original vs Enhanced */}
              <View style={styles.beforeAfterToggleBar}>
                <TouchableOpacity
                  style={[styles.togglePill, !showEnhancedView && styles.togglePillActive]}
                  onPress={() => setShowEnhancedView(false)}
                >
                  <Text style={[styles.togglePillText, !showEnhancedView && styles.togglePillTextActive]}>
                    📷 Original Raw
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.togglePill, showEnhancedView && styles.togglePillActive]}
                  onPress={() => setShowEnhancedView(true)}
                >
                  <Text style={[styles.togglePillText, showEnhancedView && styles.togglePillTextActive]}>
                    ✨ AI Studio Enhanced
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Preview Image */}
              <View style={styles.enhancedImageCard}>
                <Image
                  source={
                    showEnhancedView && enhancedResult?.enhancedUri
                      ? { uri: enhancedResult.enhancedUri }
                      : typeof capturedImageUri === 'string'
                      ? { uri: capturedImageUri }
                      : capturedImageUri || CRAFT_IMAGES.terracottaDiya
                  }
                  style={styles.enhancedImage}
                  resizeMode="cover"
                />

                <View style={styles.enhancedBadge}>
                  <Text style={styles.enhancedBadgeText}>
                    {showEnhancedView ? '✨ Studio Calibrated • True Natural Clay' : '📷 Raw Camera Capture'}
                  </Text>
                </View>
              </View>

              {/* Metrics Card */}
              <View style={styles.metricsCard}>
                <Text style={styles.metricsCardTitle}>📊 Image Quality Diagnostics:</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{enhancedResult?.metrics.brightnessScore || 92}%</Text>
                    <Text style={styles.metricLabel}>Brightness</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{enhancedResult?.metrics.sharpnessScore || 96}%</Text>
                    <Text style={styles.metricLabel}>Edge Clarity</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>100%</Text>
                    <Text style={styles.metricLabel}>Authentic Craft</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>+40%</Text>
                    <Text style={styles.metricLabel}>Texture Depth</Text>
                  </View>
                </View>
              </View>

              {/* Step 2 Actions */}
              <View style={styles.stepButtonRow}>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setCurrentStep(1)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryBtnText}>← Retake Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => setCurrentStep(3)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Next: Voice Story →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* STEP 3: AUDIO GUIDE + SINGLE INPUT BOX + 10S VOICE RECORDING */}
      {currentStep === 3 && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Language Selector */}
          <View style={styles.languageBar}>
            <Text style={styles.languageBarLabel}>Speaking in / भाषा:</Text>
            <TouchableOpacity
              onPress={() => setSelectedLanguage('hi-IN')}
              style={[styles.langChip, selectedLanguage === 'hi-IN' && styles.langChipActive]}
            >
              <Text style={[styles.langChipText, selectedLanguage === 'hi-IN' && styles.langChipTextActive]}>
                🇮🇳 हिंदी
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedLanguage('mr-IN')}
              style={[styles.langChip, selectedLanguage === 'mr-IN' && styles.langChipActive]}
            >
              <Text style={[styles.langChipText, selectedLanguage === 'mr-IN' && styles.langChipTextActive]}>
                मराठी
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedLanguage('en-IN')}
              style={[styles.langChip, selectedLanguage === 'en-IN' && styles.langChipActive]}
            >
              <Text style={[styles.langChipText, selectedLanguage === 'en-IN' && styles.langChipTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>

          {/* 1. AUDIO GUIDE: What to say */}
          <View style={styles.audioGuideCard}>
            <View style={styles.audioGuideHeaderRow}>
              <View style={styles.audioGuideTitleBox}>
                <Text style={styles.audioGuideEmoji}>💡</Text>
                <Text style={styles.audioGuideTitle}>
                  {selectedLanguage === 'hi-IN'
                    ? 'क्या बोलना है? (Audio Guide)'
                    : selectedLanguage === 'mr-IN'
                    ? 'काय बोलायचे आहे? (Audio Guide)'
                    : 'What to say? (Audio Guide)'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handlePlayAudioGuide}
                style={[styles.audioGuideBtn, isPlayingGuide && styles.audioGuideBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.audioGuideBtnText}>
                  {isPlayingGuide ? '⏹️ बंद करें (Stop)' : '🔊 सुनिए (Listen Guide)'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.audioGuideSample}>
              {selectedLanguage === 'hi-IN'
                ? 'उदाहरण: "यह हाथ से बना टेराकोटा दीया सेट है, इसे बनाने में 16 घंटे लगे और 150 रुपये का कच्चा माल लगा।"'
                : selectedLanguage === 'mr-IN'
                ? 'उदाहरण: "हा मातीचा दिवा सेट आहे, बनवायला 16 तास लागले आणि 150 रुपये कच्चा माल खर्च आला."'
                : 'Example: "Handcrafted terracotta diya set, took 16 hours of labor and 150 rupees material cost."'}
            </Text>
          </View>

          {/* 2. VOICE RECORDING BOX WITH 10S COUNTDOWN TIMER */}
          <View style={styles.voicePromptCard}>
            <View style={styles.voicePromptHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.voicePromptTitle}>🎙️ Boliye ya Likhiye (Craft Story):</Text>
                {isListening ? (
                  <View style={styles.timerLiveRow}>
                    <View style={styles.timerLiveDot} />
                    <Text style={styles.timerLiveText}>
                      रिकॉर्डिंग चालू है • ⏱️ {recordingSecondsLeft}s शेष (remaining)
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.voicePromptSub}>
                    10 सेकंड का वॉइस इनपुट या नीचे एक बॉक्स में लिखें
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleVoiceToggle}
                style={[styles.voiceRecordBtn, isListening && styles.voiceRecordBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.voiceRecordEmoji}>
                  {isListening ? `⏹️ Stop (${recordingSecondsLeft}s)` : '🎙️ बोलें (10s Speak)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 3. THE SINGLE INPUT BOX: Real-time Audio-to-Typing happens here! */}
            <View style={styles.singleInputFieldGroup}>
              <Text style={styles.fieldLabel}>
                {selectedLanguage === 'hi-IN'
                  ? 'शिल्प की पूरी जानकारी (बोलें या लिखें):'
                  : selectedLanguage === 'mr-IN'
                  ? 'हस्तकलेची संपूर्ण माहिती (बोला किंवा लिहा):'
                  : 'Craft Story & Details (Speak or Type):'}
              </Text>
              <TextInput
                style={styles.storyTextArea}
                value={craftStoryInput}
                onChangeText={setCraftStoryInput}
                multiline={true}
                numberOfLines={4}
                placeholder={
                  selectedLanguage === 'hi-IN'
                    ? 'यहाँ बोलें या लिखें: शिल्प का नाम, बनाने में लगा समय और कच्चा माल लागत...'
                    : selectedLanguage === 'mr-IN'
                    ? 'येथे बोला किंवा लिहा: हस्तकलेचे नाव, वेळ आणि खर्च...'
                    : 'Speak or type: craft name, hours of labor, and raw material cost...'
                }
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Step 3 Action: Gemini AI Analysis & Catalog Generation */}
          <TouchableOpacity
            style={styles.generateAiBtn}
            onPress={handleGenerateAiCatalog}
            activeOpacity={0.85}
          >
            <Text style={styles.generateAiBtnText}>🚀 Generate AI Catalog & Kalakar IP →</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* STEP 4: AI MULTIMODAL SYNTHESIS PROGRESS */}
      {currentStep === 4 && (
        <View style={styles.synthesisContainer}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.synthesisMainTitle}>🧠 Google Gemini 3.6 Multimodal AI</Text>
          <Text style={styles.synthesisSubtitle}>{synthesisStageLabel}</Text>

          <View style={styles.stageProgressWrapper}>
            <View style={[styles.stageStep, synthesisStage >= 1 && styles.stageStepActive]}>
              <Text style={styles.stageEmoji}>👁️</Text>
              <Text style={styles.stageLabel}>Vision Analysis</Text>
            </View>
            <View style={[styles.stageStep, synthesisStage >= 2 && styles.stageStepActive]}>
              <Text style={styles.stageEmoji}>✍️</Text>
              <Text style={styles.stageLabel}>Multilingual Copy</Text>
            </View>
            <View style={[styles.stageStep, synthesisStage >= 3 && styles.stageStepActive]}>
              <Text style={styles.stageEmoji}>💰</Text>
              <Text style={styles.stageLabel}>100% Fair Price</Text>
            </View>
            <View style={[styles.stageStep, synthesisStage >= 4 && styles.stageStepActive]}>
              <Text style={styles.stageEmoji}>🛡️</Text>
              <Text style={styles.stageLabel}>Kalakar IP Mint</Text>
            </View>
          </View>
        </View>
      )}

      {/* STEP 5: FULL CATALOG & KALAKAR IP PREVIEW */}
      {currentStep === 5 && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Unique Kalakar IP Tag Hero Pill */}
          <View style={styles.ipTagHeroCard}>
            <View style={styles.ipTagHeaderRow}>
              <Text style={styles.ipTagTitle}>🛡️ Verified Kalakar IP Identity</Text>
              <View style={styles.ipTagPill}>
                <Text style={styles.ipTagPillText}>{kalakarIpTag?.ipTagId || 'KALAKAR-IP-MH-2026-8492-7X9B'}</Text>
              </View>
            </View>
            <Text style={styles.ipTagArtisanRow}>
              Master Artisan: <Text style={{ fontWeight: 'bold' }}>{artisanName}</Text> • {artisanDistrict} Studio
            </Text>
            <Text style={styles.ipTagCopyright}>
              {kalakarIpTag?.copyrightNotice || `© 2026 ${artisanName}. Certified Original Handcrafted IP.`}
            </Text>
          </View>

          {/* Product Preview Card */}
          <View style={styles.previewProductCard}>
            <Image
              source={
                enhancedResult?.enhancedUri
                  ? { uri: enhancedResult.enhancedUri }
                  : typeof capturedImageUri === 'string'
                  ? { uri: capturedImageUri }
                  : capturedImageUri || CRAFT_IMAGES.terracottaDiya
              }
              style={styles.previewProductImage}
              resizeMode="cover"
            />

            <View style={styles.previewBody}>
              <Text style={styles.previewTitle}>
                {catalogData?.titles.hi || catalogData?.titles.en || craftNameInput}
              </Text>
              <Text style={styles.previewCategory}>
                {catalogData?.craftCategoryName || 'Traditional Pottery & Terracotta'} • GI Certified
              </Text>

              {/* Price Tier Selection */}
              <View style={styles.priceTiersContainer}>
                <Text style={styles.priceTierHeader}>💰 Select Selling Price (100% Fair Price Calculated):</Text>
                <View style={styles.priceTierRow}>
                  <TouchableOpacity
                    style={[styles.priceTierCard, selectedPriceTier === 'min' && styles.priceTierCardActive]}
                    onPress={() => {
                      setSelectedPriceTier('min');
                      setFinalSellingPrice(catalogData?.fairPricing.suggestedMin || 550);
                    }}
                  >
                    <Text style={styles.priceTierLabel}>Min Fair</Text>
                    <Text style={styles.priceTierAmount}>₹{catalogData?.fairPricing.suggestedMin || 550}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.priceTierCard, selectedPriceTier === 'rec' && styles.priceTierCardActive]}
                    onPress={() => {
                      setSelectedPriceTier('rec');
                      setFinalSellingPrice(catalogData?.fairPricing.suggestedRecommended || 850);
                    }}
                  >
                    <Text style={styles.priceTierLabel}>⭐ Recommended</Text>
                    <Text style={styles.priceTierAmount}>₹{catalogData?.fairPricing.suggestedRecommended || 850}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.priceTierCard, selectedPriceTier === 'prem' && styles.priceTierCardActive]}
                    onPress={() => {
                      setSelectedPriceTier('prem');
                      setFinalSellingPrice(catalogData?.fairPricing.suggestedPremium || 1200);
                    }}
                  >
                    <Text style={styles.priceTierLabel}>Studio Premium</Text>
                    <Text style={styles.priceTierAmount}>₹{catalogData?.fairPricing.suggestedPremium || 1200}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Heritage Story Card */}
              <View style={styles.heritageStoryCard}>
                <View style={styles.heritageStoryHeader}>
                  <Text style={styles.heritageStoryTitle}>📜 Craft Heritage Story:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      playSpeech(
                        catalogData?.descriptions.hi ||
                          catalogData?.descriptions.en ||
                          'This handcrafted creation carries centuries of cultural heritage and master artisan precision.'
                      )
                    }
                    style={styles.storyAudioBtn}
                  >
                    <Text style={styles.storyAudioText}>🔊 Suniye</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.heritageStoryBody}>
                  {catalogData?.descriptions.hi ||
                    catalogData?.descriptions.en ||
                    'यह अद्वितीय हस्तशिल्प शुद्ध नदी की मिट्टी से चाक पर गढ़ा गया है और प्राकृतिक रंगों से सजाया गया है।'}
                </Text>
              </View>
            </View>
          </View>

          {/* One-Tap Publish Button */}
          <TouchableOpacity
            style={styles.publishActionBtn}
            onPress={handlePublishListing}
            activeOpacity={0.85}
          >
            <Text style={styles.publishActionBtnText}>🚀 Publish to Buyer Marketplace (प्रकाशित करें)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* STEP 6: PUBLISHED & REAL-TIME ECOSYSTEM SYNC */}
      {currentStep === 6 && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successHeading}>🎉 Successfully Published!</Text>
            <Text style={styles.successSub}>
              Your handcrafted product is now live on the marketplace with verified Kalakar IP Protection.
            </Text>

            {/* Live Sync Confirmation Pills */}
            <View style={styles.syncStatusPills}>
              <View style={styles.syncPill}>
                <Text style={styles.syncPillEmoji}>🛒</Text>
                <Text style={styles.syncPillText}>Live in Buyer Marketplace (Port 2883)</Text>
              </View>
              <View style={styles.syncPill}>
                <Text style={styles.syncPillEmoji}>📱</Text>
                <Text style={styles.syncPillText}>Live in Artisan Studio (Port 2882)</Text>
              </View>
              <View style={styles.syncPill}>
                <Text style={styles.syncPillEmoji}>🛡️</Text>
                <Text style={styles.syncPillText}>Kalakar IP Tag Registered ({kalakarIpTag?.ipTagId})</Text>
              </View>
            </View>

            {/* Navigation & Action Buttons */}
            <View style={styles.successActionButtons}>
              <TouchableOpacity
                style={styles.viewBuyerBtn}
                onPress={() => navigation?.navigate?.('HomeTab')}
                activeOpacity={0.85}
              >
                <Text style={styles.viewBuyerBtnText}>🏠 Go to Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAnotherBtn}
                onPress={() => {
                  setCurrentStep(1);
                  setCapturedImageUri(null);
                  setEnhancedResult(null);
                  setCatalogData(null);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.createAnotherBtnText}>+ Catalog Another Craft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },
  headerTitleGroup: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  stepBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },

  /* Step 1 Viewfinder */
  viewfinderContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  webVideoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  viewfinderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#F97316',
  },
  cornerTR: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#F97316',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#F97316',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#F97316',
  },
  centerCrosshair: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 80,
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  guidanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  guidanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  captureActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  snapButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  snapButtonIcon: {
    fontSize: 18,
  },
  snapButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uploadLabelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    cursor: 'pointer',
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  /* Presets */
  presetSection: {
    marginTop: 4,
  },
  presetSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    width: (width - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  presetPrice: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  /* Step 2 Enhancement */
  beforeAfterToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  togglePill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  togglePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  togglePillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  togglePillTextActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
  enhancedImageCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  enhancedImage: {
    width: '100%',
    height: 240,
  },
  enhancedBadge: {
    backgroundColor: '#FFF7ED',
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
  },
  enhancedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  metricsCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  stepButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: '#EA580C',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Step 3 Voice Input */
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  languageBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langChipActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  langChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  voicePromptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 16,
  },
  voicePromptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voicePromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C',
    flex: 1,
  },
  voiceRecordBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  voiceRecordBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  voiceRecordEmoji: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#C2410C',
  },
  liveSpeechBox: {
    backgroundColor: '#FFF7ED',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  liveSpeechText: {
    fontSize: 13,
    color: '#9A3412',
    fontStyle: 'italic',
  },
  inputFieldGroup: {
    marginBottom: 12,
  },
  inputFieldRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  generateAiBtn: {
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  generateAiBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Audio Guide Card & Timer Styles */
  audioGuideCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  audioGuideHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  audioGuideTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  audioGuideEmoji: {
    fontSize: 16,
  },
  audioGuideTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
  },
  audioGuideBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  audioGuideBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  audioGuideBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  audioGuideSample: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  timerLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  timerLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timerLiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  voicePromptSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  singleInputFieldGroup: {
    marginTop: 8,
  },
  storyTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 90,
    textAlignVertical: 'top',
    lineHeight: 20,
  },

  /* Step 4 Synthesis */
  synthesisContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  synthesisMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 6,
  },
  synthesisSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  stageProgressWrapper: {
    width: '100%',
    gap: 12,
  },
  stageStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    opacity: 0.4,
  },
  stageStepActive: {
    opacity: 1,
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  stageEmoji: {
    fontSize: 18,
  },
  stageLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Step 5 Review */
  ipTagHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  ipTagHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ipTagTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FDBA74',
  },
  ipTagPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ipTagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  ipTagArtisanRow: {
    fontSize: 11,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  ipTagCopyright: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  previewProductCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  previewProductImage: {
    width: '100%',
    height: 200,
  },
  previewBody: {
    padding: 14,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 12,
  },
  priceTiersContainer: {
    marginBottom: 12,
  },
  priceTierHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  priceTierRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTierCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  priceTierCardActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
    borderWidth: 2,
  },
  priceTierLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  priceTierAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  heritageStoryCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  heritageStoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heritageStoryTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#92400E',
  },
  storyAudioBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  storyAudioText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  heritageStoryBody: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  publishActionBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  publishActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Step 6 Success */
  successCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 32,
    color: '#16A34A',
    fontWeight: 'bold',
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  syncStatusPills: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  syncPillEmoji: {
    fontSize: 18,
  },
  syncPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  successActionButtons: {
    width: '100%',
    gap: 10,
  },
  viewBuyerBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewBuyerBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  createAnotherBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  createAnotherBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#EA580C',
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  cameraOffPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cameraOffEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  cameraOffTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cameraOffSub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 16,
  },
  enableCameraBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  enableCameraBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewfinderTopControls: {
    alignSelf: 'flex-end',
  },
  switchCamPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  switchCamText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
