import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useAppStore } from '@/store/useAppStore';
import {
  speechRecognitionService,
  SpeechLanguage,
} from '@/services/speechRecognitionService';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import {
  geminiSaathiService,
  ChatMessage,
} from '@/services/geminiSaathiService';

const { width } = Dimensions.get('window');

interface ConversationEntry {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  audioText?: string;
  time: string;
  actionType?: 'orders' | 'earnings' | 'price' | 'delivery' | 'schemes' | 'create' | 'mela' | 'general';
  actionTitle?: string;
  data?: any;
}

interface CommandPrompt {
  id: string;
  title: string;
  query: string;
}

const COMMAND_SUGGESTIONS: Record<string, CommandPrompt[]> = {
  'hi-IN': [
    { id: '1', title: '📦 नया ऑर्डर दिखाओ', query: 'Naye orders dikhao aur unhe kab dispatch karna hai?' },
    { id: '2', title: '💰 आज कितनी कमाई हुई?', query: 'Aaj kitna kamaya aur escrow mein kitna jama hai?' },
    { id: '3', title: '💡 दीया का सही भाव क्या है?', query: 'Terracotta diya set ka recommended fair price kya hai?' },
    { id: '4', title: '🏛️ पीएम विश्वकर्मा योजना', query: 'PM Vishwakarma tool kit grant aur Mudra loan yojana ke baare me batao.' },
  ],
  'mr-IN': [
    { id: '1', title: '📦 नवीन ऑर्डर्स दाखवा', query: 'नवीन ऑर्डर्स काय आहेत आणि कधी पाठवायचे आहेत?' },
    { id: '2', title: '💰 आज किती कमाई झाली?', query: 'आजची एकूण कमाई आणि एस्क्रो खात्यातील रक्कम सांगा.' },
    { id: '3', title: '💡 मातीच्या दिव्याचा योग्य भाव', query: 'मातीच्या दिव्याचा शिफारस केलेला योग्य भाव काय असावा?' },
    { id: '4', title: '🏛️ पीएम विश्वकर्मा योजना', query: 'पीएम विश्वकर्मा योजना आणि टूलकिट अनुदान माहिती द्या.' },
  ],
  'en-IN': [
    { id: '1', title: '📦 Check pending orders', query: 'Show all my pending orders and delivery deadlines.' },
    { id: '2', title: '💰 Today\'s earnings & escrow', query: 'What are my total earnings today and escrow vault balance?' },
    { id: '3', title: '💡 Fair price for terracotta diya', query: 'What is the recommended fair price and profit margin for terracotta diya set?' },
    { id: '4', title: '🏛️ PM Vishwakarma toolkit scheme', query: 'Explain PM Vishwakarma Yojana toolkit incentive and Mudra loan benefits.' },
  ],
};

export const VoiceSaathiScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const { locale } = useAppStore();

  // Automatically take the language selected in Profile
  const selectedLanguage: SpeechLanguage = (
    locale === 'hi_IN' ? 'hi-IN' :
    locale === 'mr_IN' ? 'mr-IN' :
    'en-IN'
  ) as SpeechLanguage;

  const isHindi = selectedLanguage === 'hi-IN';
  const isMarathi = selectedLanguage === 'mr-IN';

  const [isListening, setIsListening] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [inputQueryText, setInputQueryText] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Animation pulse for mic & timers
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const silenceTimerRef = useRef<any>(null);

  const artisanName = user?.fullName || (isHindi ? 'रमेश कुंभार' : 'Ramesh Kumbhar');
  const artisanFirstName = artisanName.split(' ')[0] || (isHindi ? 'कारीगर' : 'Artisan');
  const artisanLocation = user?.district ? `${user.district} Studio` : 'Kolhapur Studio, Maharashtra';

  // Conversations feed (chronological: oldest at top, newest at bottom, scrolls up like ChatGPT)
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);

  // Time-of-day greeting (matching "Good Morning, Mithila" from design)
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (isHindi) {
      if (hour < 12) return `सुप्रभात, ${artisanFirstName}`;
      if (hour < 17) return `शुभ दोपहर, ${artisanFirstName}`;
      return `शुभ संध्या, ${artisanFirstName}`;
    }
    if (isMarathi) {
      if (hour < 12) return `शुभ सकाळ, ${artisanFirstName}`;
      if (hour < 17) return `शुभ दुपार, ${artisanFirstName}`;
      return `शुभ संध्याकाळ, ${artisanFirstName}`;
    }
    if (hour < 12) return `Good Morning, ${artisanFirstName}`;
    if (hour < 17) return `Good Afternoon, ${artisanFirstName}`;
    return `Good Evening, ${artisanFirstName}`;
  };

  // Auto-scroll helper to keep chat scrolled to the latest message like ChatGPT
  const scrollToBottom = (delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, delay);
  };

  // Handle pulse animation while listening
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isListening) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      animation?.stop();
    };
  }, [isListening]);

  // Clean stop TTS and Speech Recognition on unmount
  useEffect(() => {
    return () => {
      stopVoice();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      speechRecognitionService.abortListening();
    };
  }, []);

  // Text-To-Speech Playback with Device Neural Voice Engine (Swara/Madhur/Google Natural)
  const playVoice = (text: string, entryId?: string) => {
    if (currentlySpeakingId && currentlySpeakingId === entryId) {
      stopVoice();
      return;
    }

    if (entryId) {
      setCurrentlySpeakingId(entryId);
    }

    realisticVoiceService.speak(text, {
      lang: selectedLanguage,
      gender: 'female',
      rate: 0.94,
      pitch: 1.02,
      preferOnlineStream: false,
      onStart: () => {
        if (entryId) setCurrentlySpeakingId(entryId);
      },
      onEnd: () => {
        setCurrentlySpeakingId(null);
      },
      onError: () => {
        setCurrentlySpeakingId(null);
      },
    });
  };

  const stopVoice = () => {
    realisticVoiceService.stop();
    setCurrentlySpeakingId(null);
  };

  // Main submission handler to Gemini AI
  const handleQuerySubmit = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isAiLoading) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setShowAttachMenu(false);

    // 1. Add User Message (Appended to the end so chat flows upwards like ChatGPT)
    const userMsgId = Date.now().toString();
    const userMsg: ConversationEntry = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) => [...prev, userMsg]);
    setInputQueryText('');
    setActiveSpeech('');
    setLastSpokenText('');
    setIsAiLoading(true);

    scrollToBottom(50);

    try {
      const pendingCount = orders?.filter((o) => o.status === 'ORDER_CONFIRMED').length || 2;
      const chatHistory: ChatMessage[] = [...conversations, userMsg]
        .slice(-6)
        .map((c) => ({
          role: c.sender === 'user' ? 'user' : 'model',
          text: c.text,
        }));

      const aiResponse = await geminiSaathiService.askSaathi(
        trimmed,
        {
          artisanName,
          artisanLocation,
          craftSpecialty: 'Terracotta Pottery & Traditional Clay Crafting',
          todayEarnings: 2400,
          escrowBalance: 2892,
          pendingOrdersCount: pendingCount,
          activeLanguage: selectedLanguage,
        },
        chatHistory
      );

      const saathiMsgId = (Date.now() + 1).toString();
      const saathiMsg: ConversationEntry = {
        id: saathiMsgId,
        sender: 'saathi',
        text: aiResponse.replyText,
        audioText: aiResponse.audioText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: aiResponse.actionType,
        actionTitle: aiResponse.actionTitle,
        data: aiResponse.data,
      };

      setConversations((prev) => [...prev, saathiMsg]);
      setIsAiLoading(false);

      scrollToBottom(50);

      // Play audio response automatically
      playVoice(aiResponse.audioText || aiResponse.replyText, saathiMsgId);
    } catch (err: any) {
      setIsAiLoading(false);
      const fallbackMsg: ConversationEntry = {
        id: (Date.now() + 1).toString(),
        sender: 'saathi',
        text: isHindi
          ? 'माफ़ कीजिए, अभी नेटवर्क में थोड़ी समस्या आई। आप दोबारा बोलें या पूछें।'
          : isMarathi
          ? 'माफ करा, नेटवर्क अडचण आली आहे. कृपया पुन्हा विचारा.'
          : 'Sorry, there was a temporary network issue. Please try again or ask below.',
        audioText: isHindi ? 'माफ़ कीजिए, समस्या आई। कृपया दोबारा पूछें।' : 'Sorry, please try again.',
        time: 'Now',
        actionType: 'general',
      };
      setConversations((prev) => [...prev, fallbackMsg]);
      scrollToBottom(50);
    }
  };

  // Toggle Microphone with REAL-TIME streaming speech recognition into input box
  const handleMicToggle = async () => {
    if (isListening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      speechRecognitionService.stopListening();
      setIsListening(false);
      setVolumeLevel(0);

      const candidate = inputQueryText.trim() || activeSpeech.trim();
      const isPlaceholder =
        candidate === 'सुन रहे हैं... बोलिए...' ||
        candidate === 'Listening... speak now...';
      if (candidate && !isPlaceholder) {
        setActiveSpeech('');
        setLastSpokenText(candidate);
        handleQuerySubmit(candidate);
      } else {
        setActiveSpeech('');
      }
    } else {
      stopVoice();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setActiveSpeech('');
      setLastSpokenText('');

      const started = speechRecognitionService.startListening(
        {
          onStart: () => {
            setIsListening(true);
            setActiveSpeech(isHindi ? 'सुन रहे हैं... बोलिए...' : 'Listening... speak now...');
          },
          onResult: (transcript, isFinal) => {
            // REAL-TIME TYPING DIRECTLY INTO THE INPUT BOX:
            setInputQueryText(transcript);
            setActiveSpeech(transcript);
            setLastSpokenText(transcript);

            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }

            // Auto-submit after 2.4s of silence once words have been spoken
            silenceTimerRef.current = setTimeout(() => {
              const isPlaceholder =
                transcript === 'सुन रहे हैं... बोलिए...' ||
                transcript === 'Listening... speak now...';
              if (transcript.trim().length >= 3 && !isPlaceholder) {
                speechRecognitionService.stopListening();
                setIsListening(false);
                setVolumeLevel(0);
                handleQuerySubmit(transcript.trim());
              }
            }, isFinal ? 1400 : 2400);
          },
          onVolumeChange: (vol) => {
            setVolumeLevel(vol);
          },
          onError: (err) => {
            setIsListening(false);
            setVolumeLevel(0);
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
            setActiveSpeech(err ? `Mic: ${err}` : 'Microphone unavailable');
          },
          onEnd: () => {
            setIsListening(false);
            setVolumeLevel(0);
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
          },
        },
        selectedLanguage
      );

      if (!started) {
        setIsListening(false);
        setVolumeLevel(0);
        setActiveSpeech(
          isHindi
            ? 'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया अनुमतियाँ जांचें।'
            : 'Microphone could not start. Please check microphone permission.'
        );
      }
    }
  };

  // Clear conversation / Start new chat
  const handleNewChat = () => {
    stopVoice();
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    speechRecognitionService.abortListening();
    setIsListening(false);
    setActiveSpeech('');
    setConversations([]);
  };

  const currentPrompts = COMMAND_SUGGESTIONS[selectedLanguage] || COMMAND_SUGGESTIONS['hi-IN'];
  const hasTextToSubmit = Boolean(inputQueryText.trim());

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Sleek Minimalist Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            stopVoice();
            if (navigation?.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation?.navigate?.('HomeTab');
            }
          }}
          style={styles.headerIconBtn}
          activeOpacity={0.7}
          accessibilityLabel="Back or Menu"
        >
          <Text style={styles.headerIconText}>‹</Text>
        </TouchableOpacity>

        {/* Center Minimalist Pill (Reference: "Free plan • Upgrade") */}
        <View style={styles.headerPill}>
          <View style={styles.headerPillDot} />
          <Text style={styles.headerPillText}>Kalakar Saathi · AI</Text>
        </View>

        {/* Right Icon: New Chat / Reset */}
        <TouchableOpacity
          onPress={handleNewChat}
          style={styles.headerIconBtn}
          activeOpacity={0.7}
          accessibilityLabel="New Chat"
        >
          <Text style={{ fontSize: 16 }}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Main Scrollable Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          conversations.length === 0 && styles.scrollBodyEmpty,
        ]}
        onContentSizeChange={() => {
          if (conversations.length > 0) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        {/* EMPTY STATE (Screen 1 in reference image: Minimalist Monogram + Greeting + Prompt Chips) */}
        {conversations.length === 0 && (
          <View style={styles.emptyHeroContainer}>
            {/* Minimalist Geometric Craft Monogram */}
            <View style={styles.monogramBox}>
              <View style={styles.monogramDiamond}>
                <Text style={styles.monogramChar}>✦</Text>
              </View>
            </View>

            {/* Elegant Typographic Greeting */}
            <Text style={styles.heroGreetingTitle}>{getTimeGreeting()}</Text>
            <Text style={styles.heroGreetingSub}>
              {isHindi
                ? 'आपका बुद्धिमान साथी। नीचे दिए सुझाव चुनें या बोलें।'
                : isMarathi
                ? 'तुमचा विश्वासू साथी. खालील पर्याय निवडा किंवा बोला.'
                : 'Your dedicated artisan AI assistant. Choose a prompt or ask below.'}
            </Text>

            {/* Quick Prompt Suggestion Pills */}
            <View style={styles.promptsGrid}>
              {currentPrompts.map((cmd) => (
                <TouchableOpacity
                  key={cmd.id}
                  onPress={() => handleQuerySubmit(cmd.query)}
                  style={styles.promptMinimalCard}
                  activeOpacity={0.75}
                >
                  <Text style={styles.promptMinimalText}>{cmd.title}</Text>
                  <Text style={styles.promptMinimalArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ACTIVE CONVERSATION STATE (Screen 2 in reference image - Oldest at top, newest at bottom) */}
        {conversations.length > 0 && (
          <View style={styles.conversationFeed}>
            {conversations.map((msg) => {
              const isSpeakingThis = currentlySpeakingId === msg.id;

              if (msg.sender === 'user') {
                return (
                  <View key={msg.id} style={styles.userBubbleContainer}>
                    <View style={styles.userBubble}>
                      <Text style={styles.userBubbleText}>{msg.text}</Text>
                    </View>
                    <Text style={styles.userBubbleTime}>{msg.time}</Text>
                  </View>
                );
              }

              return (
                <View key={msg.id} style={styles.saathiBubbleContainer}>
                  <View style={styles.saathiBubble}>
                    {/* Clean formatted text */}
                    <Text style={styles.saathiBubbleText}>{msg.text}</Text>

                    {/* Action Deep Link Buttons */}
                    {msg.actionType === 'orders' && (
                      <TouchableOpacity
                        onPress={() => navigation?.navigate?.('OrdersTab', { section: 'orders' })}
                        style={styles.bubbleActionBtn}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.bubbleActionBtnText}>
                          {msg.actionTitle || (isHindi ? '📦 ऑर्डर्स देखें →' : '📦 View Orders →')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {msg.actionType === 'earnings' && (
                      <TouchableOpacity
                        onPress={() => navigation?.navigate?.('OrdersTab', { section: 'khata' })}
                        style={styles.bubbleActionBtn}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.bubbleActionBtnText}>
                          {msg.actionTitle || (isHindi ? '💰 खाता बही खोलें →' : '💰 Open Khata Ledger →')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {msg.actionType === 'create' && (
                      <TouchableOpacity
                        onPress={() => navigation?.navigate?.('CreateTab')}
                        style={styles.bubbleActionBtn}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.bubbleActionBtnText}>
                          {msg.actionTitle || (isHindi ? '🎨 AI स्टूडियो खोलें →' : '🎨 Open AI Studio →')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {msg.actionType === 'schemes' && (
                      <TouchableOpacity
                        onPress={() => navigation?.navigate?.('ProfileTab')}
                        style={styles.bubbleActionBtn}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.bubbleActionBtnText}>
                          {msg.actionTitle || (isHindi ? '🏛️ योजना विवरण देखें →' : '🏛️ View Scheme Details →')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Bottom Audio Speaker Pill */}
                    {Boolean(msg.audioText) && (
                      <View style={styles.bubbleAudioRow}>
                        <TouchableOpacity
                          onPress={() => playVoice(msg.audioText || msg.text, msg.id)}
                          style={[styles.audioListenPill, isSpeakingThis && styles.audioListenPillActive]}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.audioListenPillText, isSpeakingThis && styles.audioListenPillTextActive]}>
                            {isSpeakingThis ? '⏹️ Stop' : '🔊 Listen'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Text style={styles.saathiBubbleTime}>{msg.time}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Live Recognized Speech Floating Preview */}
        {Boolean(isListening || (activeSpeech && activeSpeech.length > 0)) && (
          <View style={styles.liveSpeechCard}>
            <View style={styles.liveHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LISTENING</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                  }
                  speechRecognitionService.stopListening();
                  setIsListening(false);
                  const isPlaceholder =
                    activeSpeech === 'सुन रहे हैं... बोलिए...' ||
                    activeSpeech === 'Listening... speak now...';
                  if (activeSpeech.trim() && !isPlaceholder) {
                    const text = activeSpeech.trim();
                    setActiveSpeech('');
                    handleQuerySubmit(text);
                  }
                }}
                style={styles.liveSendBtn}
              >
                <Text style={styles.liveSendText}>Send ↑</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.liveSpeechText}>{activeSpeech}</Text>
          </View>
        )}

        {/* AI Thinking Indicator */}
        {isAiLoading && (
          <View style={styles.thinkingContainer}>
            <ActivityIndicator size="small" color="#EA580C" />
            <Text style={styles.thinkingText}>
              {isHindi ? 'साथी सोच रहे हैं...' : 'Saathi is thinking...'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 3. Floating Bottom Input Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.floatingInputWrapper}
      >
        {/* Quick Tools Drawer (toggled with + button) */}
        {showAttachMenu && (
          <View style={styles.toolsDrawer}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setShowAttachMenu(false);
                navigation?.navigate?.('CreateTab');
              }}
            >
              <Text style={styles.drawerEmoji}>📸</Text>
              <Text style={styles.drawerText}>AI Studio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setShowAttachMenu(false);
                navigation?.navigate?.('OrdersTab', { section: 'orders' });
              }}
            >
              <Text style={styles.drawerEmoji}>📦</Text>
              <Text style={styles.drawerText}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setShowAttachMenu(false);
                navigation?.navigate?.('OrdersTab', { section: 'khata' });
              }}
            >
              <Text style={styles.drawerEmoji}>💰</Text>
              <Text style={styles.drawerText}>Khata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setShowAttachMenu(false);
                handleQuerySubmit('PM Vishwakarma yojana ki details aur tool grant batao');
              }}
            >
              <Text style={styles.drawerEmoji}>🏛️</Text>
              <Text style={styles.drawerText}>Schemes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating Card Container with Real-Time Typing feedback */}
        <View style={[styles.floatingCard, isListening && styles.floatingCardListening]}>
          {/* Top: Text Input Field (How can I help you today?) */}
          <TextInput
            style={styles.cardTextInput}
            placeholder={
              isListening
                ? (isHindi ? 'बोल रहे हैं... टाइप हो रहा है...' : 'Listening & typing in real time...')
                : isHindi
                ? 'साथी से कुछ भी पूछें...'
                : isMarathi
                ? 'साथीला काहीही विचारा...'
                : 'How can I help you today?'
            }
            placeholderTextColor={isListening ? '#EA580C' : '#94A3B8'}
            value={inputQueryText}
            onChangeText={setInputQueryText}
            onSubmitEditing={() => handleQuerySubmit(inputQueryText)}
            returnKeyType="send"
            multiline={false}
          />

          {/* Real-time Streaming Voice Equalizer Strip */}
          {isListening && (
            <View style={styles.liveVoiceEqualizerRow}>
              <View style={styles.liveVoicePill}>
                <View style={styles.liveRecordingRedDot} />
                <Text style={styles.liveVoicePillText}>
                  {isHindi ? 'लाइव वॉइस टाइपिंग...' : 'Live Voice Typing...'}
                </Text>
              </View>
              <View style={styles.audioWaveformGroup}>
                <View style={[styles.waveBar, { height: 6 + (volumeLevel > 0.05 ? volumeLevel * 20 : 4) }]} />
                <View style={[styles.waveBar, { height: 6 + (volumeLevel > 0.1 ? volumeLevel * 28 : 8) }]} />
                <View style={[styles.waveBar, { height: 6 + (volumeLevel > 0.02 ? volumeLevel * 32 : 12) }]} />
                <View style={[styles.waveBar, { height: 6 + (volumeLevel > 0.15 ? volumeLevel * 24 : 7) }]} />
                <View style={[styles.waveBar, { height: 6 + (volumeLevel > 0.2 ? volumeLevel * 18 : 5) }]} />
              </View>
            </View>
          )}

          {/* Bottom: Action Controls Row */}
          <View style={styles.cardControlsRow}>
            {/* Left (+) Add / Tools button */}
            <TouchableOpacity
              onPress={() => setShowAttachMenu((prev) => !prev)}
              style={[styles.plusCircleBtn, showAttachMenu && styles.plusCircleBtnActive]}
              activeOpacity={0.7}
              accessibilityLabel="Add tools"
            >
              <Text style={[styles.plusIconText, showAttachMenu && styles.plusIconTextActive]}>
                {showAttachMenu ? '×' : '+'}
              </Text>
            </TouchableOpacity>

            {/* Center: Assistant Selector Pill */}
            <View style={styles.modelBadgePill}>
              <Text style={styles.modelBadgeText}>🇮🇳 Indic Saathi AI</Text>
            </View>

            {/* Right Cluster: Mic + Send/Audio Circle */}
            <View style={styles.rightCluster}>
              {/* Mic Button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  onPress={handleMicToggle}
                  style={[
                    styles.micCircleBtn,
                    isListening && styles.micCircleBtnListening,
                  ]}
                  activeOpacity={0.75}
                  accessibilityLabel="Voice search"
                >
                  <Text style={styles.micCircleEmoji}>{isListening ? '⏹️' : '🎙️'}</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Dark Circular Action Button (Send Arrow when text ready, or audio wave) */}
              <TouchableOpacity
                onPress={() => {
                  if (hasTextToSubmit) {
                    handleQuerySubmit(inputQueryText);
                  } else if (conversations.length > 0) {
                    const lastMsg = conversations[conversations.length - 1];
                    if (lastMsg.audioText) {
                      playVoice(lastMsg.audioText, lastMsg.id);
                    } else {
                      handleMicToggle();
                    }
                  } else {
                    handleMicToggle();
                  }
                }}
                disabled={isAiLoading}
                style={[
                  styles.darkActionCircle,
                  hasTextToSubmit ? styles.darkActionCircleActive : styles.darkActionCircleIdle,
                ]}
                activeOpacity={0.8}
                accessibilityLabel="Send message"
              >
                {isAiLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : hasTextToSubmit ? (
                  <Text style={styles.darkActionCircleArrow}>↑</Text>
                ) : (
                  <Text style={styles.darkActionCircleIcon}>🎛️</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  /* 1. Header (Minimalist) */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F5',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerIconText: {
    fontSize: 22,
    color: '#0F172A',
    fontWeight: '300',
    marginTop: -2,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },

  /* 2. Scrollable Body */
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 200, // Ample bottom clearance above floating input card
  },
  scrollBodyEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 170,
  },

  /* EMPTY HERO STATE (Screen 1 in reference UI) */
  emptyHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  monogramBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  monogramDiamond: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramChar: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  heroGreetingTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -0.3,
  },
  heroGreetingSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  promptsGrid: {
    width: '100%',
    marginTop: 28,
    gap: 8,
  },
  promptMinimalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  promptMinimalText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  promptMinimalArrow: {
    fontSize: 18,
    color: '#94A3B8',
    marginLeft: 8,
  },

  /* ACTIVE CONVERSATION STATE (Screen 2 in reference UI) */
  conversationFeed: {
    gap: 16,
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  userBubble: {
    maxWidth: width * 0.82,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubbleText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
    fontWeight: '500',
  },
  userBubbleTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginRight: 4,
  },

  saathiBubbleContainer: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  saathiBubble: {
    maxWidth: width * 0.88,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  saathiBubbleText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
  },
  saathiBubbleTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 4,
  },
  bubbleActionBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  bubbleActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  bubbleAudioRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  audioListenPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audioListenPillActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  audioListenPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  audioListenPillTextActive: {
    color: '#DC2626',
  },

  /* Live Speech Transcription Card */
  liveSpeechCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    marginTop: 10,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  liveSendBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveSendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liveSpeechText: {
    fontSize: 13.5,
    color: '#0F172A',
    lineHeight: 19,
  },

  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  thinkingText: {
    fontSize: 12.5,
    color: '#C2410C',
    fontWeight: '500',
  },

  /* 3. Floating Bottom Input Card */
  floatingInputWrapper: {
    position: 'absolute',
    bottom: 84, // Clean floating clearance above the bottom navigation bar
    left: 14,
    right: 14,
    alignItems: 'center',
  },
  toolsDrawer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  drawerItem: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  drawerEmoji: {
    fontSize: 18,
  },
  drawerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },

  floatingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  floatingCardListening: {
    borderColor: '#EA580C',
    backgroundColor: '#FFFBF7',
    shadowColor: '#EA580C',
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  liveVoiceEqualizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  liveVoicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  liveRecordingRedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  liveVoicePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C',
    letterSpacing: 0.2,
  },
  audioWaveformGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 20,
  },
  waveBar: {
    width: 3.5,
    backgroundColor: '#EA580C',
    borderRadius: 2,
  },
  cardTextInput: {
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 4,
    minHeight: 34,
  },
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
  plusCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircleBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  plusIconText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#475569',
    marginTop: -2,
  },
  plusIconTextActive: {
    color: '#FFFFFF',
  },
  modelBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modelBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micCircleBtnListening: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  micCircleEmoji: {
    fontSize: 16,
  },
  darkActionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkActionCircleActive: {
    backgroundColor: '#0F172A',
  },
  darkActionCircleIdle: {
    backgroundColor: '#0F172A',
  },
  darkActionCircleArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: -2,
  },
  darkActionCircleIcon: {
    fontSize: 14,
  },
});
