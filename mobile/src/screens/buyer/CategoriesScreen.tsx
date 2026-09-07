import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { CRAFT_CATEGORIES } from '@/api/marketplaceService';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { useTranslation } from '@/hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

export const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isHindi } = useTranslation();
  const setCategoryFilter = useMarketplaceStore((s) => s.setCategoryFilter);

  const handleSelectCategory = (code: string) => {
    setCategoryFilter(code);
    navigation.navigate('MarketplaceHome');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        showBack
        showBrand
        title={isHindi ? 'शिल्प श्रेणियां' : 'Craft Categories'}
        subtitle={isHindi ? 'विरासत हस्तकलाएं' : 'Explore Heritage Crafts'}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.subHeading}>
          {isHindi
            ? 'भारत की 6 मुख्य पारंपरिक हस्तकलाएं, सीधे ऐतिहासिक शिल्पी समूहों से'
            : "India's 6 premier heritage crafts, directly from historical artisan clusters"}
        </Text>

        {CRAFT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.code}
            onPress={() => handleSelectCategory(cat.code)}
            accessibilityRole="button"
            accessibilityLabel={isHindi ? cat.nameHi : cat.nameEn}
          >
            <Card style={styles.categoryCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.brand.light, borderColor: theme.colors.brand.primary }]}>
                  <Text style={styles.iconEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.catInfo}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
                    {isHindi ? cat.nameHi : cat.nameEn}
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.text.secondary}>
                    {isHindi ? `${cat.nameEn} • ${cat.clusterCount}+ क्लस्टर` : `${cat.nameHi} • ${cat.clusterCount}+ Clusters`}
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: theme.colors.brand.primary }]}>→</Text>
              </View>

              <View style={[styles.regionsRow, { borderTopColor: theme.colors.sand[200] }]}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.brand.primary}>
                  {isHindi ? 'प्रमुख क्षेत्र: ' : 'Key Hubs: '}
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  subHeading: {
    marginBottom: 16,
    lineHeight: 22,
  },
  categoryCard: {
    marginBottom: 12,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 24,
  },
  catInfo: {
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  regionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
});
