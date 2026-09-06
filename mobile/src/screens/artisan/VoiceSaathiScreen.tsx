import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';

const { width } = Dimensions.get('window');

interface ConversationEntry {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  audioText?: string;
  time: string;
  actionType?: 'orders' | 'earnings' | 'price' | 'delivery' | 'schemes' | 'create';
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
  const [isListening, setIsListening] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [conversations, setConversations] = useState<ConversationEntry[]>([
    {
      id: '1',
      sender: 'saathi',
      text: 'Namaste Ramesh Ji! Main aapka Voice Saathi hoon. Aap mujhse bolkar app ka koi bhi kaam karwa sakte hain.',
      audioText: 'Namaste Ramesh Ji! Main aapka Voice Saathi hoon. Boliye, main aapki kya madad kar sakta hoon?',
      time: 'Just now',
    },
  ]);

  const playVoice = (text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommandPress = (query: string, type: string) => {
    // Add User Query
    const userMsg: ConversationEntry = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: 'Now',
    };

    let replyText = '';
    let speechAudio = '';
    let actionData: any = null;

    if (type === 'earnings') {
      replyText = '💰 Ramesh Ji, aaj aapne kul ₹2,400 kamaye hain, jo ki kal se 30% zyada hai! Nodal Escrow mein ₹2,892 safe hain.';
      speechAudio = 'Ramesh Ji, aaj aapne kul do hazaar char sau rupaye kamaye hain, jo kal se tees pratishat zyada hai.';
      actionData = { earnings: '₹2,400', escrow: '₹2,892', change: '+30%' };
    } else if (type === 'orders') {
      replyText = '📦 Aapke pass 2 naye orders pending hain. Pune se Priya Sharma Ji ne Terracotta Diya Set ka order diya hai (₹1,250).';
      speechAudio = 'Aapke pass do naye orders pending hain. Pune se Priya Sharma Ji ka diya set ka order accept karna hai.';
      actionData = { count: 2, buyer: 'Priya Sharma', item: 'Terracotta Diya Set' };
    } else if (type === 'price') {
      replyText = '💡 Terracotta Diya Set ka recommended price ₹850 hai. Diwali festival demand ki wajah se ye ₹1,500 tak ja sakta hai.';
      speechAudio = 'Terracotta Diya Set ka sahi daam aath sau pachaas rupaye hai. Diwali par demand teen guna badh gayi hai.';
      actionData = { recommended: '₹850', festival: '₹1,500' };
    } else if (type === 'delivery') {
      replyText = '🚚 Anita Desai Ji ka clay pot order 12 September tak deliver karna hai. India Post pickup ready hai.';
      speechAudio = 'Anita Desai Ji ka order barah september tak deliver karna hai. Packing hone par pickup bula lein.';
      actionData = { customer: 'Anita Desai', deadline: '12 Sept' };
    } else if (type === 'schemes') {
      replyText = '🏛️ PM Vishwakarma yojana mein ₹15,000 tool grant link ho chuka hai. Mudra loan mein ₹50,000 pre-approved hain.';
      speechAudio = 'PM Vishwakarma yojana se tool grant mil gaya hai, aur Mudra loan mein pachaas hazaar rupaye pre-approved hain.';
      actionData = { vishwakarma: '₹15,000 Linked', mudra: '₹50,000 Pre-approved' };
    } else {
      replyText = `Maine aapka sandesh samajh liya hai: "${query}".`;
      speechAudio = replyText;
    }

    const saathiMsg: ConversationEntry = {
      id: (Date.now() + 1).toString(),
      sender: 'saathi',
      text: replyText,
      audioText: speechAudio,
      time: 'Now',
      actionType: type as any,
      data: actionData,
    };

    setConversations((prev) => [saathiMsg, userMsg, ...prev]);
    playVoice(speechAudio);
  };

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setActiveSpeech('Sun rahe hain... बोलीए...');
      setTimeout(() => {
        setIsListening(false);
        setActiveSpeech('');
        handleCommandPress('Aaj kitna kamaya?', 'earnings');
      }, 2500);
    } else {
      setIsListening(false);
      setActiveSpeech('');
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
            <Text style={styles.saathiHeaderSub}>Aapka Voice AI Assistant</Text>
          </View>
        </View>

        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activePillText}>Active 24×7</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* BIG HERO GLOWING SAFFRON MICROPHONE */}
        <View style={styles.heroMicSection}>
          <View style={styles.micGlowWrapper}>
            {isListening && <View style={styles.pulsingRingOuter} />}
            {isListening && <View style={styles.pulsingRingInner} />}
            <TouchableOpacity
              onPress={handleMicToggle}
              style={[styles.glowingMicButton, isListening && styles.glowingMicButtonActive]}
              activeOpacity={0.85}
            >
              <Text style={styles.glowingMicEmoji}>🎙️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.greetingTitle}>"Namaste Ramesh Ji,</Text>
          <Text style={styles.greetingSubTitle}>
            {isListening ? activeSpeech : 'kya kaam karna hai? Mic dabakar bolein'}
          </Text>
        </View>

        {/* VOICE COMMAND SUGGESTIONS */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsHeader}>💡 Aap ye bol sakte hain (Tap to ask):</Text>

          <View style={styles.suggestionsList}>
            {COMMAND_SUGGESTIONS.map((cmd) => (
              <TouchableOpacity
                key={cmd.id}
                onPress={() => handleCommandPress(cmd.query, cmd.type)}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  saathiBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saathiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  saathiIcon: {
    fontSize: 18,
  },
  saathiHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  saathiHeaderSub: {
    fontSize: 11,
    color: '#64748B',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 90,
  },
  heroMicSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  micGlowWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 130,
    marginBottom: 14,
  },
  pulsingRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
  },
  pulsingRingInner: {
    position: 'absolute',
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
  },
  glowingMicButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FED7AA',
    ...Platform.select({
      ios: {
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(234, 88, 12, 0.45)',
      },
    }),
  },
  glowingMicButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#FECACA',
  },
  glowingMicEmoji: {
    fontSize: 38,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  greetingSubTitle: {
    fontSize: 13,
    color: '#EA580C',
    fontWeight: '700',
    marginTop: 4,
  },
  suggestionsContainer: {
    marginBottom: 18,
  },
  suggestionsHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  suggestionArrow: {
    fontSize: 14,
  },
  historySection: {
    gap: 12,
  },
  historyHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  saathiBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  messageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  bubbleSpeakButton: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bubbleSpeakIcon: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMessageText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  saathiMessageText: {
    color: '#0F172A',
  },
  bubbleActionCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bubbleActionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  bubbleJumpButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bubbleJumpText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
