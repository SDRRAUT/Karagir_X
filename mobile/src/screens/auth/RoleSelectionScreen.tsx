import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { AppHeader } from '@/components/navigation/AppHeader';
import { UserRole } from '@/api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge?: string;
  benefits: string[];
}

const ROLES: RoleOption[] = [
  {
    role: 'ARTISAN',
    title: 'कारीगर / बुनकर',
    subtitle: 'Artisan & Craftsperson',
    description: 'मैं हस्तशिल्प बनाता हूँ और ऑनलाइन सीधे ग्राहकों को बेचना चाहता हूँ।',
    icon: '🎨',
    badge: 'सुझावित',
    benefits: ['✓ 0% Commission', '🏷️ GI Tag Support', '⚡ Direct UPI Payout'],
  },
  {
    role: 'BUYER',
    title: 'खरीदार / संग्रहकर्ता',
    subtitle: 'Buyer & Collector',
    description: 'मैं सीधे कारीगरों से प्रामाणिक और जीआई-टैग हस्तशिल्प खरीदना चाहता हूँ।',
    icon: '🛍️',
    benefits: ['Authentic GI Crafts', 'Direct Studio Prices', 'Fast Delivery'],
  },
  {
    role: 'FACILITATOR',
    title: 'सहयोगी / एनजीओ / SHG',
    subtitle: 'Facilitator & NGO Lead',
    description: 'मैं कारीगरों को लिस्टिंग, पैकेजिंग और डिजिटल ट्रेनिंग में मदद करता हूँ।',
    icon: '🤝',
    benefits: ['Cluster Management', 'Bulk Orders', 'Digital Enablement'],
  },
];

export const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ARTISAN');

  const handleContinue = () => {
    navigation.navigate('AuthPhone', { role: selectedRole });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Stitch Top Header */}
      <AppHeader
        showBack
        showBrand
        rightAction={
          <View style={[styles.helpPill, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[300] }]}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              मदद (Help)
            </Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progressive Onboarding Stepper */}
        <View style={styles.stepperRow}>
          <View style={styles.stepperBars}>
            <View style={[styles.stepperBar, { backgroundColor: theme.colors.brand.primary }]} />
            <View style={[styles.stepperBar, { backgroundColor: theme.colors.brand.container }]} />
            <View style={[styles.stepperBar, { backgroundColor: theme.colors.sand[200] }]} />
          </View>
          <Text variant="caption" weight="bold" color={theme.colors.text.secondary}>
            चरण 1/3
          </Text>
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.eyebrowBadge}>
            <Text variant="caption" weight="bold" color="#4B44CC">
              ✨ कारीगर, खरीदार और स्वयं सहायता समूह के लिए
            </Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            आप किस रूप में जुड़ना चाहते हैं?
          </Text>
          <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
            Select your account type to proceed
          </Text>

          {/* Bolie Saathi Voice Guide Banner */}
          <View style={[styles.voiceGuideBanner, { backgroundColor: '#F0EEFF', borderColor: '#D6D3FF' }]}>
            <View style={styles.voiceGuideLeft}>
              <View style={[styles.voiceGuideDot, { backgroundColor: theme.colors.brand.primary }]}>
                <Text style={{ fontSize: 11, color: '#FFFFFF' }}>🔊</Text>
              </View>
              <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                बोलिए साथी: <Text variant="caption" color={theme.colors.charcoal[800]}>भूमिका का विवरण सुनें</Text>
              </Text>
            </View>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary} style={{ textDecorationLine: 'underline' }}>
              Play
            </Text>
          </View>
        </View>

        {/* Roles List */}
        <View style={styles.list}>
          {ROLES.map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <TouchableOpacity
                key={item.role}
                activeOpacity={0.8}
                onPress={() => setSelectedRole(item.role)}
                testID={`role-card-${item.role}`}
                accessibilityRole="radio"
                accessibilityLabel={`${item.title}, ${item.subtitle}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected ? theme.colors.brand.light : theme.colors.surface.card,
                    borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                    borderRadius: theme.borderRadius.xl,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <View style={styles.row}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected ? '#FFFFFF' : theme.colors.sand[100],
                        borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                      },
                    ]}
                  >
                    <Text style={styles.icon}>{item.icon}</Text>
                  </View>
                  <View style={styles.textCol}>
                    <View style={styles.titleRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text
                          variant="headlineMedium"
                          weight="bold"
                          color={isSelected ? theme.colors.brand.primary : theme.colors.charcoal[900]}
                        >
                          {item.title}
                        </Text>
                        {item.badge && (
                          <View style={[styles.suggestedBadge, { backgroundColor: theme.colors.brand.primary }]}>
                            <Text style={styles.suggestedText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      {isSelected && (
                        <View style={[styles.checkPill, { backgroundColor: theme.colors.brand.primary }]}>
                          <Text style={styles.checkIcon}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text variant="bodySmall" weight="bold" color={theme.colors.brand.primary}>
                      {item.subtitle}
                    </Text>
                    <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.desc}>
                      {item.description}
                    </Text>

                    {/* Benefit Tags */}
                    <View style={styles.benefitsRow}>
                      {item.benefits.map((b, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.benefitChip,
                            {
                              backgroundColor: isSelected ? '#FFFFFF' : theme.colors.sand[100],
                              borderColor: isSelected ? theme.colors.brand.container : theme.colors.sand[200],
                            },
                          ]}
                        >
                          <Text variant="caption" weight="bold" color={isSelected ? theme.colors.brand.dark : theme.colors.text.secondary}>
                            {b}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface.card,
            borderTopColor: theme.colors.sand[200],
            ...theme.shadows.level4,
          },
        ]}
      >
        <Button
          label="आगे बढ़ें (Continue) →"
          variant="primary"
          size="decision"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  helpPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  stepperBars: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    maxWidth: 160,
  },
  stepperBar: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 14,
    alignItems: 'center',
  },
  eyebrowBadge: {
    backgroundColor: '#F0EEFF',
    borderColor: '#D6D3FF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  voiceGuideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  voiceGuideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceGuideDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  card: {
    padding: 16,
    borderWidth: 2,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 26,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  desc: {
    marginTop: 6,
  },
  suggestedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  suggestedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  benefitChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 22,
    borderTopWidth: 1,
  },
});
