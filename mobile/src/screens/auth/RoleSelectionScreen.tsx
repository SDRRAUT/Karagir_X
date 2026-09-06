import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { AppHeader } from '@/components/navigation/AppHeader';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@/api/types';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  avatar3D: any;
  badge?: string;
  benefits: string[];
  themeColor: string;
  lightBg: string;
  borderColor: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'ARTISAN',
    title: 'Artisan & Craftsperson',
    subtitle: 'Creator / Weaver / Potter',
    description: 'Create and sell authentic handmade crafts directly to buyers with 0% commission and AI studio tools.',
    avatar3D: require('@/../assets/artisan_3d_avatar.jpg'),
    badge: 'Recommended',
    benefits: ['0% Commission', 'GI Tag Support', 'Direct UPI Payout'],
    themeColor: '#EA580C',
    lightBg: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  {
    role: 'BUYER',
    title: 'Buyer & Collector',
    subtitle: 'Retail Buyer / Bulk Patron',
    description: 'Discover certified GI-tagged heritage handicrafts directly from master artisan workshops.',
    avatar3D: require('@/../assets/buyer_3d_avatar.jpg'),
    benefits: ['Authentic GI Crafts', 'Direct Studio Prices', 'India Post Delivery'],
    themeColor: '#4338CA',
    lightBg: '#EEF2FF',
    borderColor: '#E0E7FF',
  },
  {
    role: 'FACILITATOR',
    title: 'Cluster Sahyogi & SHG',
    subtitle: 'Field Lead / NGO Partner',
    description: 'Assist artisan clusters with bulk orders, packaging, QC audits, and digital onboarding.',
    avatar3D: require('@/../assets/sahyogi_3d_avatar.jpg'),
    benefits: ['Cluster Management', 'Bulk RFQ Orders', 'Digital Enablement'],
    themeColor: '#16A34A',
    lightBg: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
];

export const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ARTISAN');

  const handleContinue = () => {
    navigation.navigate('AuthPhone', { role: selectedRole });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack
        showBrand
        rightAction={
          <View style={styles.helpPill}>
            <Text variant="caption" weight="bold" color="#EA580C">
              Help
            </Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          {/* Progressive Stepper */}
          <View style={styles.stepperRow}>
            <View style={styles.stepperBars}>
              <View style={[styles.stepperBar, { backgroundColor: '#EA580C' }]} />
              <View style={[styles.stepperBar, { backgroundColor: '#E2E8F0' }]} />
              <View style={[styles.stepperBar, { backgroundColor: '#E2E8F0' }]} />
            </View>
            <Text variant="caption" weight="bold" color="#64748B">
              STEP 1 OF 3
            </Text>
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.eyebrowBadge}>
              <Icon name="sparkles" size={13} color="#EA580C" style={{ marginRight: 5 }} />
              <Text variant="caption" weight="bold" color="#EA580C">
                CHOOSE YOUR ROLE
              </Text>
            </View>
            <Text variant="headlineMedium" weight="bold" color="#0F172A" style={styles.title}>
              How would you like to join?
            </Text>
            <Text variant="bodyMedium" color="#64748B" style={styles.subtitle}>
              Select your account type to customize your workspace
            </Text>

            {/* Voice Saathi Audio Guidance Button */}
            <View style={styles.voiceWrapper}>
              <VoiceCueButton
                textHi="अपनी भूमिका चुनें। क्या आप कारीगर हैं, खरीदार हैं, या स्वयं सहायता समूह के सहयोगी हैं?"
                label="Listen in Hindi"
                size="medium"
                testID="voice-cue-role-selection"
              />
            </View>
          </View>

          {/* Roles List */}
          <View style={styles.list}>
            {ROLES.map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <TouchableOpacity
                  key={item.role}
                  activeOpacity={0.85}
                  onPress={() => setSelectedRole(item.role)}
                  testID={`role-card-${item.role}`}
                  accessibilityRole="radio"
                  accessibilityLabel={`${item.title}, ${item.subtitle}`}
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isSelected ? item.lightBg : '#FFFFFF',
                      borderColor: isSelected ? item.themeColor : '#ECE8E1',
                    },
                  ]}
                >
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: isSelected ? '#FFFFFF' : item.lightBg,
                          borderColor: isSelected ? item.themeColor : item.borderColor,
                        },
                      ]}
                    >
                      <Image
                        source={item.avatar3D}
                        style={styles.role3DImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.textCol}>
                      <View style={styles.titleRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text
                            variant="bodyLarge"
                            weight="bold"
                            color={isSelected ? item.themeColor : '#0F172A'}
                          >
                            {item.title}
                          </Text>
                          {item.badge && (
                            <View style={[styles.suggestedBadge, { backgroundColor: item.themeColor }]}>
                              <Text style={styles.suggestedText}>{item.badge}</Text>
                            </View>
                          )}
                        </View>
                        {isSelected && (
                          <View style={[styles.checkPill, { backgroundColor: item.themeColor }]}>
                            <Icon name="check" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text variant="caption" weight="semiBold" color={item.themeColor} style={styles.roleSubtitle}>
                        {item.subtitle}
                      </Text>
                      <Text variant="bodySmall" color="#475569" style={styles.desc}>
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
                                backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                                borderColor: isSelected ? item.borderColor : '#E2E8F0',
                              },
                            ]}
                          >
                            <Text variant="caption" weight="medium" color={isSelected ? item.themeColor : '#475569'}>
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
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInner}>
          <Button
            label="Continue →"
            variant="primary"
            size="decision"
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  helpPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    backgroundColor: '#FFF7ED',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 440,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepperBars: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    marginRight: 16,
  },
  stepperBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginBottom: 20,
  },
  eyebrowBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginBottom: 12,
  },
  voiceWrapper: {
    alignSelf: 'flex-start',
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  role3DImage: {
    width: '100%',
    height: '100%',
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  suggestedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  suggestedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  roleSubtitle: {
    marginBottom: 6,
  },
  desc: {
    lineHeight: 18,
    marginBottom: 10,
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  benefitChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECE8E1',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomInner: {
    width: '100%',
    maxWidth: 440,
  },
});
