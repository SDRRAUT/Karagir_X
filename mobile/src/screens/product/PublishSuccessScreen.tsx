import React from 'react';
import { View, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useProductDraftStore } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PublishSuccess'>;

export const PublishSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { publishedProduct, resetDraft } = useProductDraftStore();

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! I just published my authentic handcrafted creation on Kalakar Setu. Check it out here: https://kalakarsetu.in/p/${publishedProduct?.id || 'demo'}`
    );
    Linking.openURL(`whatsapp://send?text=${text}`).catch(() => {
      // Fallback
    });
  };

  const handleGoHome = () => {
    resetDraft();
    navigation.navigate('MainTabs', { screen: 'HomeTab' });
  };

  const handleListenStory = () => {
    Alert.alert(
      '▶ Craft Story Audio',
      '"Hand-thrown using local natural clay, sun-dried for 3 days and fired with traditional organic wood kiln."'
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFDF7' }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.headerBox}>
          <View style={styles.celebrateCircle}>
            <Text style={{ fontSize: 34 }}>🎉</Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color="#2b2b2b" style={styles.title}>
            Congratulations!
          </Text>
          <Text variant="bodyMedium" color="#e85d2a" style={styles.vernacularTitle}>
            Your Craft Listing is Now Live on Marketplace
          </Text>
        </View>

        {/* Digital Craft Passport Card (Stitch 04_digital_craft_passport.html) */}
        <Card style={styles.passportCard} variant="elevated">
          {/* Header section: Verified and QR */}
          <View style={styles.passportHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.verifiedRow}>
                <Text style={{ fontSize: 16, marginRight: 4 }}>🛡️</Text>
                <Text variant="caption" weight="bold" color="#1b9aaa" style={styles.verifiedText}>
                  KALAKAR SETU VERIFIED
                </Text>
              </View>
              <Text variant="headlineSmall" weight="bold" color="#2b2b2b" style={styles.passportTitle}>
                Digital Craft Passport
              </Text>
              <Text variant="caption" color="#64748B" style={styles.locationText}>
                📍 Kolhapur, Maharashtra • GI #MH-24
              </Text>
            </View>

            {/* QR Box */}
            <View style={styles.qrBox}>
              <Image
                source={{
                  uri:
                    publishedProduct?.passportQrUrl ||
                    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kalakarsetu.in/passport/verified',
                }}
                style={styles.qrImage}
              />
            </View>
          </View>

          {/* Master Artisan Section */}
          <View style={styles.artisanRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.artisanAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="#64748B">
                Master Artisan & Origin
              </Text>
              <Text variant="bodyLarge" weight="bold" color="#2b2b2b">
                Ramesh Kumbhar (Kolhapur Master Potter)
              </Text>
              <Text variant="caption" color="#64748B">
                Panchganga Valley, Kolhapur (GI #MH-24 Region)
              </Text>
            </View>
          </View>

          {/* Making Method & Batch Row */}
          <View style={styles.provenanceGrid}>
            <View style={styles.provenanceItem}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#EA580C' }}>🏺 MAKING METHOD</Text>
              <Text variant="caption" color="#475569" style={{ marginTop: 2 }}>
                Traditional wheel hand-throw • 3-day sun-dried • 850°C wood kiln
              </Text>
            </View>
            <View style={styles.provenanceItem}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#16A34A' }}>📦 BATCH IDENTIFIER</Text>
              <Text variant="caption" color="#475569" style={{ marginTop: 2 }}>
                Batch #KLK-2026-DIWALI-084 • Limited Edition of 100
              </Text>
            </View>
          </View>

          {/* Craft Story Section with Listen Button */}
          <View style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <View style={styles.storyTitleRow}>
                <Text style={{ fontSize: 16, marginRight: 6 }}>📜</Text>
                <Text variant="caption" weight="bold" color="#2b2b2b">
                  Artisan's Voice Story
                </Text>
              </View>
              <TouchableOpacity style={styles.listenBtn} onPress={handleListenStory}>
                <Text style={{ fontSize: 12, marginRight: 4 }}>▶</Text>
                <Text variant="caption" weight="bold" color="#e85d2a">
                  Listen
                </Text>
              </TouchableOpacity>
            </View>
            <Text variant="bodySmall" color="#475569" style={styles.storyQuote}>
              "Hand-thrown using local river clay, sun-dried for 3 days, pure GI heritage."
            </Text>
          </View>

          {/* Heritage Material Tag Pills */}
          <View style={styles.materialsRow}>
            <View style={[styles.materialTag, { backgroundColor: '#E6F6F8' }]}>
              <Text variant="caption" weight="bold" color="#1b9aaa">
                Local River Clay
              </Text>
            </View>
            <View style={[styles.materialTag, { backgroundColor: '#FFF8E7' }]}>
              <Text variant="caption" weight="bold" color="#8F6204">
                Sun-baked
              </Text>
            </View>
            <View style={[styles.materialTag, { backgroundColor: '#FFF0EA' }]}>
              <Text variant="caption" weight="bold" color="#e85d2a">
                Hand-thrown
              </Text>
            </View>
          </View>

          {/* Verification Status Banner */}
          <View style={styles.passportVerificationBanner}>
            <Text style={{ fontSize: 14, marginRight: 6 }}>🔒</Text>
            <Text variant="caption" color="#64748B" style={{ flex: 1, lineHeight: 14 }}>
              Decentralized QR Craft Passport: Verifies authentic artisan pedigree, craft technique, and batch origin without claiming official state GI certification.
            </Text>
          </View>
        </Card>

        {/* Product Price Card */}
        <Card style={styles.summaryCard} variant="elevated">
          <Text variant="bodyMedium" weight="bold" color="#2b2b2b">
            {publishedProduct?.title.en || publishedProduct?.title.hi || 'Handcrafted Terracotta Diya'}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="bodySmall" color="#64748B">
              Live Listing Price:
            </Text>
            <Text variant="headlineMedium" weight="bold" color="#2b2b2b">
              ₹{(publishedProduct?.sellingPrice || 2150).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <Button
            label="Share on WhatsApp"
            variant="outline"
            onPress={handleShareWhatsApp}
          />
          <Button
            label="Go to Home Dashboard"
            variant="primary"
            onPress={handleGoHome}
            style={styles.homeBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  celebrateCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FFD7C7',
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
  },
  vernacularTitle: {
    textAlign: 'center',
    fontSize: 13,
  },
  passportCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8DC',
    paddingBottom: 12,
    marginBottom: 12,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 10,
    letterSpacing: 0.6,
  },
  passportTitle: {
    fontSize: 18,
  },
  locationText: {
    marginTop: 2,
  },
  qrBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECE8DC',
    padding: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 54,
    height: 54,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  artisanAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#e85d2a',
  },
  storyCard: {
    backgroundColor: '#F5F3EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  storyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 93, 42, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  storyQuote: {
    fontStyle: 'italic',
    lineHeight: 18,
  },
  materialsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  materialTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  provenanceGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  provenanceItem: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passportVerificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonStack: {
    gap: 12,
  },
  homeBtn: {
    backgroundColor: '#e85d2a',
  },
});
