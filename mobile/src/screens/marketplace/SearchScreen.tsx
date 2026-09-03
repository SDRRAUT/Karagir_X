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

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { searchQuery, setSearchQuery, recentSearches, addRecentSearch } = useMarketplaceStore();
  const [results, setResults] = useState<MarketplaceProduct[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

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
    setIsVoiceActive(true);
    // Simulating instant vernacular speech recognition
    setTimeout(() => {
      setIsVoiceActive(false);
      setSearchQuery('मधुबनी पेंटिंग');
      addRecentSearch('मधुबनी पेंटिंग');
    }, 1200);
  };

  const renderProductItem = ({ item }: { item: MarketplaceProduct }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      style={styles.resultItemTouch}
      accessibilityRole="button"
      accessibilityLabel={item.title.hi}
    >
      <Card style={styles.resultCard}>
        <Image source={{ uri: item.images[0] }} style={styles.resultImage} />
        <View style={styles.resultDetails}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
            {item.categoryName} • {item.artisan.state}
          </Text>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary} numberOfLines={2}>
            {item.title.hi}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            कारीगर: {item.artisan.name}
          </Text>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700} style={{ marginTop: 4 }}>
            ₹{item.price.toLocaleString('en-IN')}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={[styles.inputBox, { borderColor: theme.colors.surface.border }]}>
          <Text style={{ fontSize: 18, marginRight: 6 }}>🔍</Text>
          <TextInput
            placeholder="शिल्प, साड़ी या कला खोजें..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            style={[styles.input, { color: theme.colors.text.primary }]}
            autoFocus
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 16, color: '#888' }}>✕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVoiceSearch}>
              <Text style={{ fontSize: 20 }}>🎙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Voice Listening Banner */}
      {isVoiceActive && (
        <View style={[styles.voiceActiveCard, { backgroundColor: theme.colors.primary.emerald100 }]}>
          <Text style={{ fontSize: 24, marginRight: 8 }}>🔴</Text>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.primary.emerald900}>
            सुन रहे हैं... अपनी भाषा में बोलें (Listening)
          </Text>
        </View>
      )}

      {/* Recent Searches (Shown if query is empty) */}
      {searchQuery.length === 0 ? (
        <View style={styles.recentSection}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.recentLabel}>
            हाल की खोज (Recent Searches):
          </Text>
          <View style={styles.chipsRow}>
            {recentSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectRecent(term)}
                style={[styles.chip, { backgroundColor: theme.colors.surface.card }]}
              >
                <Text variant="bodySmall" color={theme.colors.text.primary}>
                  {term}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        /* Results List */
        <FlatList
          data={results}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 44, marginBottom: 8 }}>🔍</Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                कोई परिणाम नहीं मिला
              </Text>
              <Text variant="bodyMedium" color={theme.colors.text.secondary} style={{ textAlign: 'center', marginTop: 4 }}>
                कृपया कोई अन्य शब्द खोजें जैसे 'साड़ी', 'पेंटिंग' या 'लकड़ी'।
              </Text>
            </View>
          }
        />
      )}
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
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  voiceActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentSection: {
    padding: 16,
  },
  recentLabel: {
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  resultItemTouch: {
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  resultImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  resultDetails: {
    flex: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
