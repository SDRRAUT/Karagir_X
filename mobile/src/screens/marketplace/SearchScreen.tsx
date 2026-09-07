import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { marketplaceService, MarketplaceProduct } from '@/api/marketplaceService';
import { VoiceInputModal } from '@/components/modals/VoiceInputModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { searchQuery, setSearchQuery, recentSearches, addRecentSearch } = useMarketplaceStore();
  const [results, setResults] = useState<MarketplaceProduct[]>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    marketplaceService.getProducts({ searchQuery }).then(setResults);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    addRecentSearch(searchQuery);
  };

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
  };

  const handleVoiceSearch = () => {
    setShowVoiceModal(true);
  };

  const handleVoiceApply = (spokenText: string) => {
    if (spokenText.trim()) {
      setSearchQuery(spokenText.trim());
      addRecentSearch(spokenText.trim());
    }
  };

  const renderProductItem = ({ item }: { item: MarketplaceProduct }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      style={styles.resultItemTouch}
      accessibilityRole="button"
      accessibilityLabel={item.title.en || item.title.hi}
    >
      <Card style={styles.resultCard}>
        <Image source={{ uri: item.images[0] }} style={styles.resultImage} />
        <View style={styles.resultDetails}>
          <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
            {item.categoryName} • {item.artisan.state}
          </Text>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} numberOfLines={2}>
            {item.title.en || item.title.hi}
          </Text>
          <Text variant="caption" color={theme.colors.text.secondary}>
            Artisan: {item.artisan.name}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.brand.primary}>
              ₹{item.price.toLocaleString('en-IN')}
            </Text>
            <View style={[styles.ratingPill, { backgroundColor: theme.colors.sand[100] }]}>
              <Text variant="caption" weight="bold" color={theme.colors.charcoal[900]}>
                ⭐ {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Search Header Bar */}
      <View style={[styles.searchHeader, { backgroundColor: theme.colors.sand[50], borderBottomColor: theme.colors.sand[200] }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200] }]}
          accessibilityLabel="Back"
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={[styles.inputBox, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200], ...theme.shadows.level1 }]}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            placeholder="Search crafts, sarees, or authentic art..."
            placeholderTextColor={theme.colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            style={[styles.input, { color: theme.colors.charcoal[900] }]}
            autoFocus
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 16, color: '#888' }}>✕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVoiceSearch}>
              <Text style={{ fontSize: 18 }}>🎙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Recent Searches Pills */}
      {recentSearches.length > 0 && searchQuery.length === 0 && (
        <View style={styles.recentContainer}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]} style={styles.recentHeading}>
            Recent Searches
          </Text>
          <View style={styles.recentPillsRow}>
            {recentSearches.map((term, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectRecent(term)}
                style={[styles.recentPill, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200] }]}
              >
                <Text variant="caption" color={theme.colors.charcoal[900]}>
                  🕒 {term}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Search Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>🔍</Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
                No results found
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                Try searching for another craft, saree, or artisan state
              </Text>
            </View>
          ) : null
        }
      />

      {/* Real-time Voice Search Modal with AI Modification */}
      <VoiceInputModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onApplyText={handleVoiceApply}
        title="Voice Craft Search (बोलकर खोजें)"
        context="search"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  voiceActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  recentContainer: {
    padding: 16,
  },
  recentHeading: {
    marginBottom: 10,
  },
  recentPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultItemTouch: {
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    padding: 10,
  },
  resultImage: {
    width: 86,
    height: 86,
    borderRadius: 10,
    marginRight: 12,
  },
  resultDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
});
