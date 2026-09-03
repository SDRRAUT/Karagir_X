import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { CRAFT_CATEGORIES } from '@/api/marketplaceService';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

export const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const setCategoryFilter = useMarketplaceStore((s) => s.setCategoryFilter);

  const handleSelectCategory = (code: string) => {
    setCategoryFilter(code);
    navigation.navigate('MarketplaceHome');
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
          शिल्प श्रेणियां (Craft Categories)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subHeading}>
          भारत की 6 मुख्य पारंपरिक हस्तकलाएं, सीधे ऐतिहासिक शिल्पी समूहों से
        </Text>

        {CRAFT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.code}
            onPress={() => handleSelectCategory(cat.code)}
            accessibilityRole="button"
            accessibilityLabel={cat.nameHi}
          >
            <Card style={styles.categoryCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.catInfo}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                    {cat.nameHi}
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.text.secondary}>
                    {cat.nameEn} • {cat.clusterCount}+ क्लस्टर
                  </Text>
                </View>
                <Text style={styles.chevron}>→</Text>
              </View>

              <View style={styles.regionsRow}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                  प्रमुख क्षेत्र:{' '}
                </Text>
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  {cat.popularRegions.join(', ')}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  subHeading: {
    marginBottom: 16,
    lineHeight: 22,
  },
  categoryCard: {
    marginBottom: 14,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 28,
  },
  catInfo: {
    flex: 1,
  },
  chevron: {
    fontSize: 22,
    color: '#1E5631',
  },
  regionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0D7C9',
  },
});
