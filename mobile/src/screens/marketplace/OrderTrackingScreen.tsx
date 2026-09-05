import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useOrderStore, TrackingMilestone } from '@/store/useOrderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { orderId } = route.params;
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const order = getOrderById(orderId) || currentOrder;

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="लाइव ऑर्डर ट्रैकिंग"
        subtitle="Speed Post Live Journey"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Postal Consignment Card */}
        <Card style={styles.consignmentCard} variant="elevated">
          <View style={styles.consignmentHeader}>
            <View style={styles.postalIconBox}>
              <Text style={{ fontSize: 22 }}>📮</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]} weight="medium">
                इंडिया पोस्ट स्पीड पोस्ट कंसाइनमेंट
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={{ marginTop: 2 }}>
                {barcode}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCopyBarcode} activeOpacity={0.7} style={styles.copyBtn}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta[600]}>
                कॉपी 📋
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.consignmentFooter}>
            <Text variant="bodySmall" color={theme.colors.charcoal[600]}>
              ऑर्डर सं.: <Text weight="bold" color={theme.colors.charcoal[800]}>{orderNumber}</Text> • 100% ग्रामीण डाकघर नेटवर्क
            </Text>
          </View>
        </Card>

        {/* Milestone Tracker Timeline */}
        <Card style={styles.timelineCard} variant="elevated">
          <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={styles.timelineTitle}>
            यात्रा के चरण (Delivery Milestones)
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
                      milestone.isCompleted
                        ? styles.dotCircleCompleted
                        : styles.dotCirclePending,
                    ]}
                  >
                    <Text style={[styles.dotText, milestone.isCompleted ? styles.dotTextCompleted : styles.dotTextPending]}>
                      {milestone.isCompleted ? '✓' : milestone.step}
                    </Text>
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.verticalLine,
                        {
                          backgroundColor: milestone.isCompleted
                            ? '#6C63FF'
                            : '#E0DCFF',
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
                      color={milestone.isCompleted ? theme.colors.forest[700] : theme.colors.charcoal[900]}
                    >
                      {milestone.titleHi}
                    </Text>
                    <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
                      {milestone.timestamp}
                    </Text>
                  </View>
                  <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={styles.milestoneDesc}>
                    {milestone.descriptionHi}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Nodal Escrow Protection Status */}
        <View style={styles.escrowCard}>
          <View style={styles.escrowIconBox}>
            <Text style={{ fontSize: 22 }}>🛡️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.forest[800]}>
              एस्क्रो सुरक्षा सक्रिय (Escrow Active)
            </Text>
            <Text variant="bodySmall" color={theme.colors.forest[700]} style={{ marginTop: 2, lineHeight: 18 }}>
              डिलीवरी पूरी होने के 48 घंटे बाद ही कारीगर को जन-धन/बैंक खाते में पूरा भुगतान जारी होगा।
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  consignmentCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 16,
  },
  consignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postalIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
    borderWidth: 1,
    borderColor: '#FFE9DE',
  },
  consignmentFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  timelineCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 16,
  },
  timelineTitle: {
    marginBottom: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  dotCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCircleCompleted: {
    backgroundColor: '#6C63FF',
  },
  dotCirclePending: {
    backgroundColor: '#F7F4F0',
    borderWidth: 1.5,
    borderColor: '#D8D1C7',
  },
  dotText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dotTextCompleted: {
    color: '#FFFFFF',
  },
  dotTextPending: {
    color: '#8A827B',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  detailsCol: {
    flex: 1,
    paddingBottom: 18,
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
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#E8F5EE',
    borderWidth: 1,
    borderColor: '#C3E6D0',
  },
  escrowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

