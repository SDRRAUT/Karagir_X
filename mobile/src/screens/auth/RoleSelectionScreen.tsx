import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { UserRole } from '@/api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'ARTISAN',
    title: 'कारीगर / बुनकर',
    subtitle: 'Artisan & Craftsperson',
    description: 'मैं हस्तशिल्प बनाता हूँ और ऑनलाइन सीधे ग्राहकों को बेचना चाहता हूँ।',
    icon: '🎨',
  },
  {
    role: 'BUYER',
    title: 'खरीदार / संग्रहकर्ता',
    subtitle: 'Buyer & Collector',
    description: 'मैं सीधे कारीगरों से प्रामाणिक और जीआई-टैग हस्तशिल्प खरीदना चाहता हूँ।',
    icon: '🛍️',
  },
  {
    role: 'FACILITATOR',
    title: 'सहयोगी / एनजीओ / SHG',
    subtitle: 'Facilitator & NGO Lead',
    description: 'मैं कारीगरों को लिस्टिंग, पैकेजिंग और डिजिटल ट्रेनिंग में मदद करता हूँ।',
    icon: '🤝',
  },
];

export const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ARTISAN');

  const handleContinue = () => {
    navigation.navigate('AuthPhone', { role: selectedRole });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
            आप किस रूप में जुड़ना चाहते हैं?
          </Text>
          <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
            Select your account type to proceed
          </Text>
        </View>

        {/* Roles List */}
        <View style={styles.list}>
          {ROLES.map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <TouchableOpacity
                key={item.role}
                activeOpacity={0.7}
                onPress={() => setSelectedRole(item.role)}
                testID={`role-card-${item.role}`}
                accessibilityRole="radio"
                accessibilityLabel={`${item.title}, ${item.subtitle}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary.emerald100
                      : theme.colors.surface.card,
                    borderColor: isSelected
                      ? theme.colors.primary.emerald700
                      : theme.colors.surface.border,
                    borderRadius: theme.touch.radii.card,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <View style={styles.row}>
                  <Text style={styles.icon}>{item.icon}</Text>
                  <View style={styles.textCol}>
                    <View style={styles.titleRow}>
                      <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
                        {item.title}
                      </Text>
                      {isSelected && (
                        <Text variant="headlineMedium" color={theme.colors.primary.emerald700}>
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                      {item.subtitle}
                    </Text>
                    <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.desc}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
  },
  list: {
    marginTop: 12,
  },
  card: {
    padding: 18,
    borderWidth: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 40,
    marginRight: 16,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desc: {
    marginTop: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});

