import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import {
  speechRecognitionService,
  SpeechLanguage,
} from '@/services/speechRecognitionService';
import {
  aiVoiceModifierService,
} from '@/services/aiVoiceModifierService';

const { width } = Dimensions.get('window');

interface ConversationEntry {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  audioText?: string;
  time: string;
  actionType?: 'orders' | 'earnings' | 'price' | 'delivery' | 'schemes' | 'create' | 'general';
  data?: any;
}

const COMMAND_SUGGESTIONS = [
  { id: '1', title: '🎯 "Naya order dikhao"', query: 'Naye orders dikhao', type: 'orders' },
  { id: '2', title: '🎯 "Aaj kitna kamaya?"', query: 'Aaj kitna kamaya?', type: 'earnings' },
  { id: '3', title: '🎯 "Diya ka price kya hai?"', query: 'Diya ka price kya hai?', type: 'price' },
  { id: '4', title: '🎯 "Delivery kab hogi?"', query: 'Delivery kab hogi?', type: 'delivery' },
  { id: '5', title: '🎯 "Sarkari yojana batao"', query: 'Sarkari yojana batao', type: 'schemes' },
];

export const VoiceSaathiScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [isTypingQuery, setIsTypingQuery] = useState(false);
  const [customQueryText, setCustomQueryText] = useState('');

  const [conversations, setConversations] = useState<ConversationEntry[]>([
    {
      id: '1',
      sender: 'saathi',
      text: 'Namaste Ramesh Ji! Main aapka Voice Saathi hoon. Boliye, main aapki kya madad kar sakta hoon?',
      audioText: 'Namaste Ramesh Ji! Main aapka Voice Saathi hoon. Boliye, main aapki kya madad kar sakta hoon?',
      time: 'Just now',
    },
  ]);

  const playVoice = (text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuerySubmit = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    // 1. Add User's Actual Spoken Query to Conversation
    const userMsg: ConversationEntry = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      time: 'Now',
    };

    // 2. Process intelligently using AI Voice Modifier & Intent Service
    const aiResponse = aiVoiceModifierService.processSaathiQuery(trimmed);

    const saathiMsg: ConversationEntry = {
      id: (Date.now() + 1).toString(),
      sender: 'saathi',
      text: aiResponse.replyText,
      audioText: aiResponse.audioText,
      time: 'Now',
      actionType: aiResponse.actionType,
      data: aiResponse.data,
    };

    setConversations((prev) => [saathiMsg, userMsg, ...prev]);
    playVoice(aiResponse.audioText);
    setLastSpokenText('');
    setCustomQueryText('');
  };

  const handleMicToggle = () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      if (activeSpeech.trim()) {
        const spoken = activeSpeech.trim();
        setLastSpokenText(spoken);
        setActiveSpeech('');
        handleQuerySubmit(spoken);
      }
    } else {
      setActiveSpeech('');
      setLastSpokenText('');
      const started = speechRecognitionService.startListening(
        {
          onStart: () => {
            setIsListening(true);
            setActiveSpeech('Sun rahe hain... बोलिए...');
          },
          onResult: (transcript, isFinal) => {
            setActiveSpeech(transcript);
            setLastSpokenText(transcript);
            if (isFinal && transcript.trim().length > 3) {
              speechRecognitionService.stopListening();
              setIsListening(false);
              handleQuerySubmit(transcript.trim());
            }
          },
          onError: (err) => {
            setIsListening(false);
            setActiveSpeech(`Mic notice: ${err}`);
          },
          onEnd: () => {
            setIsListening(false);
          },
        },
        selectedLanguage
      );

      if (!started) {
        setIsListening(false);
        setIsTypingQuery(true);
        setActiveSpeech('Speech recognition not available. Please type your query below.');
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.saathiBranding}>
          <View style={styles.saathiIconBox}>
            <Text style={styles.saathiIcon}>🎙️</Text>
          </View>
          <View>
            <Text style={styles.saathiHeaderTitle}>Voice Saathi (साथी)</Text>
            <Text style={styles.saathiHeaderSub}>Aapka AI Craft Assistant</Text>
          </View>
        </View>

        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activePillText}>Active 24×7</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Language Selector Bar */}
        <View style={styles.languageBar}>
          <Text style={styles.languageBarLabel}>Language / भाषा:</Text>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('hi-IN')}
            style={[styles.langChip, selectedLanguage === 'hi-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'hi-IN' && styles.langChipTextActive,
              ]}
            >
              🇮🇳 हिंदी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('mr-IN')}
            style={[styles.langChip, selectedLanguage === 'mr-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'mr-IN' && styles.langChipTextActive,
              ]}
            >
              मराठी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('en-IN')}
            style={[styles.langChip, selectedLanguage === 'en-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'en-IN' && styles.langChipTextActive,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* BIG HERO GLOWING SAFFRON MICROPHONE */}
        <View style={styles.heroMicSection}>
          <View style={styles.micGlowWrapper}>
            {isListening && <View style={styles.pulsingRingOuter} />}
            {isListening && <View style={styles.pulsingRingInner} />}
            <TouchableOpacity
              onPress={handleMicToggle}
              style={[styles.glowingMicButton, isListening && styles.glowingMicButtonActive]}
              activeOpacity={0.85}
              accessibilityLabel={isListening ? 'Stop Listening' : 'Start Speaking to Saathi'}
            >
              <Text style={styles.glowingMicEmoji}>{isListening ? '⏹️' : '🎙️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.greetingTitle}>"Namaste Ramesh Ji,</Text>
          <Text style={styles.greetingSubTitle}>
            {isListening
              ? activeSpeech || 'Sun rahe hain... बोलीए...'
              : 'kya kaam karna hai? Mic dabakar bolein'}
          </Text>
        </View>

        {/* RECOGNIZED SPOKEN WORDS DISPLAY CARD */}
        {(isListening || lastSpokenText.length > 0 || isTypingQuery) && (
          <View style={styles.spokenReviewCard}>
            <View style={styles.spokenCardHeader}>
              <Text style={styles.spokenCardTitle}>🎙️ Aapki Aawaz (Recognized Query):</Text>
              {isListening && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>

            <TextInput
              style={styles.spokenTextInput}
              multiline
              value={isTypingQuery ? customQueryText : activeSpeech || lastSpokenText}
              onChangeText={(txt) => {
                setIsTypingQuery(true);
                setCustomQueryText(txt);
              }}
              placeholder="Aapki boli hui baat yahan dikhegi..."
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.spokenCardActions}>
              <TouchableOpacity
                style={styles.submitSpokenBtn}
                onPress={() => handleQuerySubmit(customQueryText || lastSpokenText || activeSpeech)}
              >
                <Text style={styles.submitSpokenText}>✓ Saathi se Poochhein (Ask Saathi)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* VOICE COMMAND SUGGESTIONS */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsHeader}>💡 Aap ye bol sakte hain (Tap to ask):</Text>

          <View style={styles.suggestionsList}>
            {COMMAND_SUGGESTIONS.map((cmd) => (
              <TouchableOpacity
                key={cmd.id}
                onPress={() => handleQuerySubmit(cmd.query)}
                style={styles.suggestionChip}
                activeOpacity={0.75}
              >
                <Text style={styles.suggestionText}>{cmd.title}</Text>
                <Text style={styles.suggestionArrow}>🔊</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CONVERSATION HISTORY FEED */}
        <View style={styles.historySection}>
          <Text style={styles.historyHeader}>💬 Baatcheet (Conversation):</Text>

          {conversations.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.saathiBubble,
              ]}
            >
              <View style={styles.messageHeaderRow}>
                <Text style={styles.messageSender}>
                  {msg.sender === 'user' ? '👤 Ramesh Ji' : '🤖 Voice Saathi'}
                </Text>
                {msg.sender === 'saathi' && msg.audioText && (
                  <TouchableOpacity
                    onPress={() => playVoice(msg.audioText || msg.text)}
                    style={styles.bubbleSpeakButton}
                  >
                    <Text style={styles.bubbleSpeakIcon}>🔊 Suno</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text
                style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userMessageText : styles.saathiMessageText,
                ]}
              >
                {msg.text}
              </Text>

              {/* Contextual Action Cards in Bubble */}
              {msg.actionType === 'orders' && (
                <View style={styles.bubbleActionCard}>
                  <Text style={styles.bubbleActionTitle}>📦 Pending Orders: 2</Text>
                  <TouchableOpacity
                    onPress={() => navigation?.navigate?.('OrdersTab')}
                    style={styles.bubbleJumpButton}
                  >
                    <Text style={styles.bubbleJumpText}>Orders Kholein →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {msg.actionType === 'earnings' && (
                <View style={styles.bubbleActionCard}>
                  <Text style={styles.bubbleActionTitle}>💰 Aaj Ki Kamai: ₹2,400 (+30%)</Text>
                  <TouchableOpacity
                    onPress={() => navigation?.navigate?.('KhataTab')}
                    style={styles.bubbleJumpButton}
                  >
                    <Text style={styles.bubbleJumpText}>Khata Kholein →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {msg.actionType === 'create' && (
                <View style={styles.bubbleActionCard}>
                  <Text style={styles.bubbleActionTitle}>🎨 AI Product Studio & Catalog</Text>
                  <TouchableOpacity
                    onPress={() => navigation?.navigate?.('CreateTab')}
                    style={styles.bubbleJumpButton}
                  >
                    <Text style={styles.bubbleJumpText}>Studio Kholein →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  saathiBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saathiIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    borderWidth: 1,
    borderColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saathiIcon: {
    fontSize: 22,
  },
  saathiHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saathiHeaderSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  activePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  scrollBody: {
    paddingBottom: 40,
  },
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#1E293B',
  },
  languageBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#334155',
  },
  langChipActive: {
    backgroundColor: '#EA580C',
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  langChipTextActive: {
    color: '#FFFFFF',
  },
  heroMicSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  micGlowWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulsingRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(234, 88, 12, 0.35)',
  },
  pulsingRingInner: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(234, 88, 12, 0.6)',
  },
  glowingMicButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  glowingMicButtonActive: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.05 }],
  },
  glowingMicEmoji: {
    fontSize: 38,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  greetingSubTitle: {
    fontSize: 14,
    color: '#CBD5E1',
    marginTop: 4,
    textAlign: 'center',
  },
  spokenReviewCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
  },
  spokenCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  spokenCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F97316',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  spokenTextInput: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
  },
  spokenCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  submitSpokenBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitSpokenText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  suggestionsHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 10,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  suggestionArrow: {
    fontSize: 14,
  },
  historySection: {
    paddingHorizontal: 16,
  },
  historyHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 12,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: width * 0.88,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#EA580C',
    borderBottomRightRadius: 4,
  },
  saathiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderBottomLeftRadius: 4,
  },
  messageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bubbleSpeakButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bubbleSpeakIcon: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  saathiMessageText: {
    color: '#E2E8F0',
  },
  bubbleActionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bubbleActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FDBA74',
    marginBottom: 6,
  },
  bubbleJumpButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bubbleJumpText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
