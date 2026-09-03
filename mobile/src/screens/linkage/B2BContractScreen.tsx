import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useMarketLinkageStore } from '@/store/useMarketLinkageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'B2BContract'>;

export const B2BContractScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { contractId } = route.params;
  const activeContract = useMarketLinkageStore((s) => s.activeContract);

  const contractNumber = activeContract?.contractId || contractId || 'CLUST-2026-4921';
  const buyerName = activeContract?.buyerName || 'टाटा कंसल्टेंसी सर्विसेज (TCS)';
  const totalValue = activeContract?.totalContractValue || 25000;
  const advanceAmount = activeContract?.advancePaidAmount || 7500;
  const quota = activeContract?.agreedQuota || 50;
  const leadName = activeContract?.clusterLeadName || 'राजेंद्र पासवान (Master Lead)';
  const leadPhone = activeContract?.clusterLeadPhone || '+91 94310 88219';

  const handleSosAssistance = () => {
    Alert.alert(
      'क्लस्टर सहायता (Cluster Support)',
      'यदि किसी कारणवश (बीमारी आदि) आप पूरा कोटा नहीं बना सकतीं, तो चिंता न करें। बचा हुआ कोटा क्लस्टर के अन्य सदस्यों को सुरक्षित रूप से सौंपा जाएगा।',
      [{ text: 'ठीक है', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
          B2B क्लस्टर अनुबंध (Active Contract)
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Card */}
        <View style={styles.celebrationBox}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary.emerald100, borderColor: theme.colors.primary.emerald700 }]}>
            <Text style={{ fontSize: 40 }}>📜</Text>
          </View>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700} style={styles.title}>
            अनुबंध सफलतापूर्वक सक्रिय हुआ!
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.subtitle}>
            क्लस्टर अनुबंध संख्या: #{contractNumber}
          </Text>
        </View>

        {/* Contract Overview Card */}
        <Card style={styles.overviewCard}>
          <View style={styles.contractRow}>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                संस्थागत खरीदार:
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                {buyerName}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary.emerald100 }]}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                सक्रिय (ACTIVE)
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <View style={styles.metricCol}>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                स्वीकृत कोटा:
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                {quota} पीस
              </Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                कुल अनुबंध मूल्य:
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                ₹{totalValue.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                एडवांस भुगतान:
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                ₹{advanceAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </Card>

        {/* 3-Stage Milestone Escrow Tracker */}
        <Card style={styles.milestoneCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 14 }}>
            मील के पत्थर व भुगतान चरण (Milestones):
          </Text>

          {/* Milestone 1 */}
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, { backgroundColor: theme.colors.primary.emerald700 }]}>
              <Text style={styles.stepCheck}>✓</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                  चरण 1: 30% अग्रिम सामग्री भुगतान
                </Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                  ₹{advanceAmount} (जारी हुआ)
                </Text>
              </View>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                कच्चा माल खरीदने के लिए राशि आपके बैंक खाते में जमा हो चुकी है।
              </Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          {/* Milestone 2 */}
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, { backgroundColor: theme.colors.terracotta.primary }]}>
              <Text style={styles.stepCheck}>2</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                  चरण 2: 50% निर्माण व फोटो सत्यापन
                </Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary}>
                  ₹{Math.round(totalValue * 0.4)}
                </Text>
              </View>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                आधा कोटा बनने पर ऐप में फोटो लें। सत्यापन पर राशि बैंक में आएगी।
              </Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          {/* Milestone 3 */}
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, { backgroundColor: '#BDBDBD' }]}>
              <Text style={styles.stepCheck}>3</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.text.secondary}>
                  चरण 3: क्लस्टर डिस्पैच व शेष भुगतान
                </Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary}>
                  ₹{totalValue - advanceAmount - Math.round(totalValue * 0.4)}
                </Text>
              </View>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                क्लस्टर डिब्बे में एकत्रित होने और स्पीड पोस्ट रवाना होने पर।
              </Text>
            </View>
          </View>
        </Card>

        {/* Cluster Coordinator Support Card */}
        <Card style={styles.coordinatorCard}>
          <View style={styles.coordinatorRow}>
            <Text style={{ fontSize: 28, marginRight: 10 }}>🧑‍🏫</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                आपके स्थानीय क्लस्टर समन्वयक (Lead):
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                {leadName}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                फोन: {leadPhone}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSosAssistance} style={styles.sosBtn}>
              <Text variant="bodySmall" weight="bold" color="#D32F2F">
                🆘 सहायता
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Action Button */}
        <Button
          label="होम डैशबोर्ड पर जाएं (Back to Dashboard) 🏠"
          variant="primary"
          size="default"
          onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  celebrationBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  overviewCard: {
    padding: 16,
    marginBottom: 14,
  },
  contractRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D7C9',
    marginVertical: 10,
  },
  metricRow: {
    flexDirection: 'row',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  milestoneCard: {
    padding: 16,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCheck: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 13,
    marginVertical: 2,
  },
  coordinatorCard: {
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E5631',
  },
  coordinatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
});
