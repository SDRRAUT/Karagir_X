import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="B2B क्लस्टर अनुबंध"
        subtitle="Active Digital Contract"
        showBack={true}
        onBackPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Box */}
        <View style={styles.celebrationBox}>
          <View style={[styles.checkCircle, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
            <Text style={{ fontSize: 36 }}>📜</Text>
          </View>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.title}>
            अनुबंध सफलतापूर्वक सक्रिय हुआ!
          </Text>
          <Text variant="labelSmall" color={theme.colors.text.secondary} style={styles.subtitle}>
            क्लस्टर अनुबंध संख्या: #{contractNumber}
          </Text>
        </View>

        {/* Contract Overview Card */}
        <Card style={styles.overviewCard}>
          <View style={styles.contractRow}>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                संस्थागत खरीदार:
              </Text>
              <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
                {buyerName}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
              <Text variant="labelSmall" weight="bold" color="#6C63FF">
                सक्रिय (ACTIVE) ✓
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

          <View style={styles.metricRow}>
            <View style={styles.metricCol}>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                स्वीकृत कोटा:
              </Text>
              <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
                {quota} पीस
              </Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                कुल अनुबंध मूल्य:
              </Text>
              <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
                ₹{totalValue.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                एडवांस भुगतान:
              </Text>
              <Text variant="labelLarge" weight="bold" color="#6C63FF">
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
            <View style={[styles.stepCircle, { backgroundColor: '#6C63FF' }]}>
              <Text style={styles.stepCheck}>✓</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="labelMedium" weight="bold" color="#6C63FF">
                  चरण 1: 30% अग्रिम सामग्री भुगतान
                </Text>
                <Text variant="labelSmall" weight="bold" color="#6C63FF">
                  ₹{advanceAmount} जारी हुआ
                </Text>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                कच्चा माल खरीदने के लिए राशि आपके बैंक खाते में जमा हो चुकी है।
              </Text>
            </View>
          </View>

          <View style={[styles.stepLine, { backgroundColor: '#6C63FF' }]} />

          {/* Milestone 2 */}
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, { backgroundColor: theme.colors.terracotta.primary }]}>
              <Text style={styles.stepCheck}>2</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                  चरण 2: 50% निर्माण व फोटो सत्यापन
                </Text>
                <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary}>
                  ₹{Math.round(totalValue * 0.4)}
                </Text>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                आधा कोटा बनने पर ऐप में फोटो लें। सत्यापन पर राशि बैंक में आएगी।
              </Text>
            </View>
          </View>

          <View style={[styles.stepLine, { backgroundColor: theme.colors.border.subtle }]} />

          {/* Milestone 3 */}
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, { backgroundColor: theme.colors.border.subtle }]}>
              <Text style={[styles.stepCheck, { color: theme.colors.text.secondary }]}>3</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.stepHeader}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.text.secondary}>
                  चरण 3: क्लस्टर डिस्पैच व शेष भुगतान
                </Text>
                <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary}>
                  ₹{totalValue - advanceAmount - Math.round(totalValue * 0.4)}
                </Text>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                क्लस्टर डिब्बे में एकत्रित होने और स्पीड पोस्ट रवाना होने पर।
              </Text>
            </View>
          </View>
        </Card>

        {/* Cluster Coordinator Support Card */}
        <Card style={styles.coordinatorCard}>
          <View style={styles.coordinatorRow}>
            <View style={[styles.leadIconCircle, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
              <Text style={{ fontSize: 22 }}>🧑‍🏫</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                स्थानीय क्लस्टर समन्वयक (Lead):
              </Text>
              <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
                {leadName}
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                फोन: {leadPhone}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSosAssistance} style={styles.sosBtn} activeOpacity={0.8}>
              <Text variant="labelSmall" weight="bold" color="#BA1A1A">
                🆘 सहायता
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Return to Dashboard */}
        <Button
          label="होम डैशबोर्ड पर जाएं (Back to Home)"
          variant="primary"
          onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          style={{ marginTop: 8, marginBottom: 20 }}
        />
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
  celebrationBox: {
    alignItems: 'center',
    marginVertical: 14,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  contractRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCol: {
    alignItems: 'center',
  },
  milestoneCard: {
    borderRadius: 16,
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
    marginTop: 2,
  },
  stepCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLine: {
    width: 2,
    height: 24,
    marginLeft: 13,
    marginVertical: 4,
  },
  coordinatorCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  coordinatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
  },
});
