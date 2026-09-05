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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.headerBox}>
          <View style={styles.celebrateCircle}>
            <Text style={{ fontSize: 36 }}>🎉</Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            बधाई हो! आपका प्रोडक्ट लाइव है
          </Text>
          <Text variant="bodyMedium" color={theme.colors.terracotta[600]} style={styles.vernacularTitle}>
            Congratulations! Your Craft is Now Live on Marketplace
          </Text>
        </View>

        {/* Digital Craft Passport Card (Stitch Passport style) */}
        <Card style={styles.passportCard} variant="elevated">
          <View style={styles.passportHeader}>
            <View style={styles.shieldBox}>
              <Text style={{ fontSize: 22 }}>🛡️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.passportBadge}>
                <Text style={styles.passportBadgeText}>GI CERTIFIED DIGITAL PASSPORT</Text>
              </View>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                डिजिटल शिल्प पासपोर्ट (Craft Passport)
              </Text>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2 }}>
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
            <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={styles.qrCaption}>
              इस QR कोड को स्कैन करके खरीदार आपकी कहानी, प्रामाणिकता और हस्तनिर्मित वीडियो देख सकते हैं।
            </Text>
          </View>
        </Card>

        {/* Product Summary Pill Card */}
        <Card style={styles.summaryCard} variant="elevated">
          <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
            {publishedProduct?.title.hi || 'पारंपरिक हस्तकला पेंटिंग'}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              लिस्टिंग विक्रय मूल्य (Live Price):
            </Text>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{(publishedProduct?.sellingPrice || 2150).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <Button
            label="व्हाट्सएप पर शेयर करें (WhatsApp) 📲"
            variant="secondary"
            size="default"
            onPress={handleShareWhatsApp}
            style={styles.shareBtn}
          />

          <Button
            label="होम डैशबोर्ड पर जाएं (Go to Home Dashboard) 🏠"
            variant="primary"
            size="default"
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
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginVertical: 18,
  },
  celebrateCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0EEFF',
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  vernacularTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  passportCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 16,
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shieldBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passportBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  passportBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6C63FF',
    letterSpacing: 0.5,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  qrCaption: {
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
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
