import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useOrderStore, TrackingMilestone } from '@/store/useOrderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { orderId } = route.params;
  const order = useOrderStore((s) => s.getOrderById(orderId)) || useOrderStore((s) => s.currentOrder);

  const orderNumber = order?.orderNumber || 'KS-OD-849201';
  const barcode = order?.consignmentBarcode || 'SP48920194IN';
  const milestones: TrackingMilestone[] = order?.trackingMilestones || [
    {
      step: 1,
      status: 'ORDER_CONFIRMED',
      titleHi: 'ऑर्डर कन्फर्म हुआ ✓',
      titleEn: 'Order Confirmed & Escrow Locked',
      descriptionHi: 'भुगतान नोडल एस्क्रो में सुरक्षित जमा है।',
      descriptionEn: 'Funds secured in nodal vault.',
      timestamp: 'आज, 10:30 AM',
      isCompleted: true,
    },
    {
      step: 2,
      status: 'ARTISAN_ACCEPTED',
      titleHi: 'कारीगर ने ऑर्डर स्वीकार किया 👨‍🎨',
      titleEn: 'Artisan Preparing Craft',
      descriptionHi: 'कारीगर द्वारा शिल्प का अंतिम निरीक्षण किया जा रहा है।',
      descriptionEn: 'Final quality inspection underway.',
      timestamp: 'आज, 12:15 PM',
      isCompleted: true,
    },
    {
      step: 3,
      status: 'IN_CRAFTING',
      titleHi: 'पैकिंग व पासपोर्ट सत्यापन 📦',
      titleEn: 'Eco-friendly Packing & Craft Passport Attached',
      descriptionHi: 'सुरक्षित डिब्बे में पैक करके शिल्प पासपोर्ट सील लगाई जा रही है।',
      descriptionEn: 'Craft passport seal attached.',
      timestamp: 'प्रगति पर (In Progress)',
      isCompleted: false,
    },
    {
      step: 4,
      status: 'DISPATCHED_POSTAL',
      titleHi: 'इंडिया पोस्ट स्पीड पोस्ट 📮',
      titleEn: 'India Post Speed Post Transit',
      descriptionHi: `कंसाइनमेंट: ${barcode}। शाखा डाकघर से रवाना होगा।`,
      descriptionEn: 'Handed to postal branch.',
      timestamp: 'कल सुबह',
      isCompleted: false,
    },
    {
      step: 5,
      status: 'DELIVERED',
      titleHi: 'डिलीवरी व कारीगर को भुगतान 🏡',
      titleEn: 'Delivered & Escrow Payout',
      descriptionHi: 'डिलीवरी के बाद कारीगर को बैंक खाते में पूरा भुगतान जारी होगा।',
      descriptionEn: 'Full payout credited to artisan.',
      timestamp: '3-4 कार्य दिवस',
      isCompleted: false,
    },
  ];

  const handleCopyBarcode = () => {
    Alert.alert('कंसाइनमेंट नंबर कॉपी हुआ', `${barcode} इंडिया पोस्ट ट्रैकिंग पोर्टल पर भी ट्रैक किया जा सकता है।`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          लाइव ऑर्डर ट्रैकिंग (Tracking)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Postal Consignment Card */}
        <Card style={styles.consignmentCard}>
          <View style={styles.consignmentHeader}>
            <Text style={{ fontSize: 26, marginRight: 8 }}>📮</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                इंडिया पोस्ट स्पीड पोस्ट कंसाइनमेंट:
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700}>
                {barcode}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCopyBarcode} style={styles.copyBtn}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                कॉपी 📋
              </Text>
            </TouchableOpacity>
          </View>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 6 }}>
            ऑर्डर सं.: {orderNumber} • 100% ग्रामीण डाकघर कनेक्टिविटी
          </Text>
        </Card>

        {/* Milestone Tracker Timeline */}
        <Card style={styles.timelineCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.timelineTitle}>
            यात्रा के चरण (Delivery Milestones):
          </Text>

          {milestones.map((milestone, idx) => {
            const isLast = idx === milestones.length - 1;
            return (
              <View key={milestone.step} style={styles.timelineRow}>
                {/* Step Indicator & Line */}
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.dotCircle,
                      {
                        backgroundColor: milestone.isCompleted
                          ? theme.colors.primary.emerald700
                          : '#E0E0E0',
                        borderColor: milestone.isCompleted
                          ? theme.colors.primary.emerald700
                          : '#BDBDBD',
                      },
                    ]}
                  >
                    <Text style={styles.dotText}>{milestone.isCompleted ? '✓' : milestone.step}</Text>
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.verticalLine,
                        {
                          backgroundColor: milestone.isCompleted
                            ? theme.colors.primary.emerald700
                            : '#E0E0E0',
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Step Details */}
                <View style={styles.detailsCol}>
                  <View style={styles.milestoneHeader}>
                    <Text
                      variant="bodyLarge"
                      weight="bold"
                      color={milestone.isCompleted ? theme.colors.primary.emerald700 : theme.colors.text.primary}
                    >
                      {milestone.titleHi}
                    </Text>
                    <Text variant="bodySmall" color={theme.colors.text.secondary}>
                      {milestone.timestamp}
                    </Text>
                  </View>
                  <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.milestoneDesc}>
                    {milestone.descriptionHi}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Nodal Escrow Protection Status */}
        <View style={[styles.escrowCard, { backgroundColor: theme.colors.primary.emerald100 }]}>
          <Text style={{ fontSize: 26, marginRight: 10 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald900}>
              एस्क्रो सुरक्षा सक्रिय (Escrow Active)
            </Text>
            <Text variant="bodySmall" color={theme.colors.primary.emerald900} style={{ marginTop: 2 }}>
              डिलीवरी पूरी होने के 48 घंटे बाद ही कारीगर को जन-धन/बैंक खाते में भुगतान जारी होगा।
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  consignmentCard: {
    padding: 16,
    marginBottom: 16,
  },
  consignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C85A32',
  },
  timelineCard: {
    padding: 16,
    marginBottom: 16,
  },
  timelineTitle: {
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 70,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  dotCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verticalLine: {
    width: 2.5,
    flex: 1,
    marginVertical: 4,
  },
  detailsCol: {
    flex: 1,
    paddingBottom: 16,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  milestoneDesc: {
    marginTop: 4,
    lineHeight: 18,
  },
  escrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
});
