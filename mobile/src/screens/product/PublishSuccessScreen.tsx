import React from 'react';
import { View, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useProductDraftStore } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PublishSuccess'>;

export const PublishSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { publishedProduct, resetDraft } = useProductDraftStore();

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `नमस्ते! मैंने कलाकार सेतु पर अपना नया हस्तशिल्प लाइव किया है। देखें: https://kalakarsetu.in/p/${publishedProduct?.id || 'demo'}`
    );
    Linking.openURL(`whatsapp://send?text=${text}`).catch(() => {
      // Fallback
    });
  };

  const handleGoHome = () => {
    resetDraft();
    navigation.navigate('MainTabs', { screen: 'HomeTab' });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.headerBox}>
          <Text style={styles.confettiIcon}>🎉</Text>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700} style={styles.title}>
            बधाई हो! आपका प्रोडक्ट लाइव है
          </Text>
          <Text variant="headlineSmall" color={theme.colors.terracotta.primary} style={styles.vernacularTitle}>
            Congratulations! Your Craft is Now Live
          </Text>
        </View>

        {/* Digital Craft Passport Card */}
        <Card style={styles.passportCard}>
          <View style={styles.passportHeader}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <View>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                डिजिटल शिल्प पासपोर्ट (Craft Passport)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                100% प्रामाणिक हस्तनिर्मित सत्यापन
              </Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <Image
              source={{
                uri:
                  publishedProduct?.passportQrUrl ||
                  'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kalakarsetu.in/passport/verified',
              }}
              style={styles.qrImage}
            />
            <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 8 }}>
              इस QR कोड को स्कैन करके खरीदार आपकी कहानी और शिल्पकारी देख सकते हैं।
            </Text>
          </View>
        </Card>

        {/* Product Summary Pill Card */}
        <Card style={styles.summaryCard}>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
            {publishedProduct?.title.hi || 'पारंपरिक हस्तकला पेंटिंग'}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              विक्रय मूल्य (Listing Price):
            </Text>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{(publishedProduct?.sellingPrice || 2150).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <Button
            label="व्हाट्सएप पर शेयर करें (Share on WhatsApp) 📲"
            variant="secondary"
            size="decision"
            onPress={handleShareWhatsApp}
            style={styles.shareBtn}
          />

          <Button
            label="होम डैशबोर्ड पर जाएं (Go to Dashboard) 🏠"
            variant="primary"
            size="decision"
            onPress={handleGoHome}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  confettiIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  vernacularTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  passportCard: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shieldIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  summaryCard: {
    width: '100%',
    padding: 14,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonStack: {
    width: '100%',
  },
  shareBtn: {
    marginBottom: 12,
  },
});
