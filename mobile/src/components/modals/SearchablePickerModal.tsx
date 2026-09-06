import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { useAppStore } from '@/store/useAppStore';

export interface PickerItem {
  id: number | string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  lgdCode?: number;
  subtitle?: string;
  badge?: string;
  isCraftCluster?: boolean;
}

interface Props {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selectedId?: number | string;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  allowCustomInput?: boolean;
  onCustomSubmit?: (text: string) => void;
  customButtonLabel?: string;
}

export const SearchablePickerModal: React.FC<Props> = ({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
  isLoading = false,
  searchPlaceholder = 'Search name or LGD code...',
  emptyText = 'No matching locations found',
  allowCustomInput = false,
  onCustomSubmit,
  customButtonLabel = 'Add as custom name',
}) => {
  const { locale } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchEn = item.name?.toLowerCase().includes(q);
      const matchHi = item.nameHi?.toLowerCase().includes(q);
      const matchMr = item.nameMr?.toLowerCase().includes(q);
      const matchLgd = item.lgdCode ? String(item.lgdCode).includes(q) : false;
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
      return matchEn || matchHi || matchMr || matchLgd || matchSubtitle;
    });
  }, [items, searchQuery]);

  const handleSelect = (item: PickerItem) => {
    setSearchQuery('');
    onSelect(item);
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const getItemDisplayName = (item: PickerItem) => {
    if (locale === 'mr_IN' && item.nameMr) return item.nameMr;
    if (locale === 'hi_IN' && item.nameHi) return item.nameHi;
    return item.name;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetContainer}>
          {/* Top Bar Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color="#0F172A">
                {title}
              </Text>
              <Text variant="caption" color="#64748B" style={{ marginTop: 2 }}>
                {filteredItems.length} locations available
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityLabel="Close"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor="#94A3B8"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Body Content / List */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#EA580C" />
              <Text variant="caption" color="#64748B" style={{ marginTop: 10 }}>
                Loading locations...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = selectedId === item.id;
                const displayName = getItemDisplayName(item);
                const hasSecondary = item.nameHi && item.nameHi !== item.name;

                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.itemRow,
                      isSelected && styles.itemRowSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.itemNameRow}>
                        <Text
                          variant="bodyMedium"
                          weight={isSelected ? 'bold' : 'semiBold'}
                          color={isSelected ? '#EA580C' : '#0F172A'}
                        >
                          {displayName}
                        </Text>
                        {hasSecondary && displayName !== item.name && (
                          <Text variant="caption" color="#64748B" style={{ marginLeft: 6 }}>
                            ({item.name})
                          </Text>
                        )}
                        {item.isCraftCluster && (
                          <View style={styles.clusterTag}>
                            <Text variant="caption" weight="bold" color="#047857" style={{ fontSize: 10 }}>
                              Craft Hub
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.itemMetaRow}>
                        {item.lgdCode ? (
                          <Text variant="caption" color="#94A3B8" style={styles.lgdBadge}>
                            LGD: {item.lgdCode}
                          </Text>
                        ) : null}
                        {item.subtitle ? (
                          <Text variant="caption" color="#64748B" style={{ marginLeft: 6 }}>
                            • {item.subtitle}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Icon name="check" size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Icon name="search" size={32} color="#CBD5E1" />
                  <Text variant="bodyMedium" color="#64748B" style={{ marginTop: 8, textAlign: 'center' }}>
                    {emptyText}
                  </Text>
                  {allowCustomInput && searchQuery.trim().length > 0 && onCustomSubmit && (
                    <TouchableOpacity
                      onPress={() => {
                        onCustomSubmit(searchQuery.trim());
                        handleClose();
                      }}
                      style={styles.customAddBtn}
                    >
                      <Text variant="caption" weight="bold" color="#EA580C">
                        {customButtonLabel}: "{searchQuery.trim()}"
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '50%',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    marginLeft: 8,
    outlineStyle: 'none' as any,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    borderRadius: 10,
  },
  itemRowSelected: {
    backgroundColor: '#FFF7ED',
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  lgdBadge: {
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  clusterTag: {
    marginLeft: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  customAddBtn: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
  },
});
