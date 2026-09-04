import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  variant?: 'pill' | 'underlined';
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'pill',
  scrollable = false,
  style,
}) => {
  const theme = useTheme();

  const handleSelect = (id: string) => {
    if (id !== activeTabId) {
      try {
        Haptics.selectionAsync();
      } catch {}
      onTabChange(id);
    }
  };

  const renderContent = () => (
    <View style={[styles.tabList, variant === 'underlined' && styles.underlinedRow]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        if (variant === 'underlined') {
          return (
            <Pressable
              key={tab.id}
              onPress={() => handleSelect(tab.id)}
              style={[
                styles.underlinedTab,
                isActive && {
                  borderBottomColor: theme.colors.brand.primary,
                  borderBottomWidth: 2,
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                variant="labelLarge"
                weight={isActive ? 'semiBold' : 'regular'}
                color={isActive ? theme.colors.brand.primary : theme.colors.text.secondary}
              >
                {tab.label}
              </Text>
              {tab.count !== undefined && (
                <View
                  style={[
                    styles.countPill,
                    {
                      backgroundColor: isActive
                        ? theme.colors.brand.primaryLight
                        : theme.colors.surface.subtle,
                    },
                  ]}
                >
                  <Text
                    variant="labelMedium"
                    color={isActive ? theme.colors.brand.primary : theme.colors.text.secondary}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        }

        // Pill variant
        return (
          <Pressable
            key={tab.id}
            onPress={() => handleSelect(tab.id)}
            style={[
              styles.pillTab,
              {
                backgroundColor: isActive
                  ? theme.colors.brand.primary
                  : theme.colors.surface.subtle,
                borderRadius: theme.touch.radii.full,
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              variant="labelLarge"
              weight={isActive ? 'semiBold' : 'regular'}
              color={isActive ? theme.colors.text.inverse : theme.colors.text.secondary}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View
                style={[
                  styles.countPill,
                  {
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.25)'
                      : theme.colors.surface.card,
                  },
                ]}
              >
                <Text
                  variant="labelMedium"
                  weight="medium"
                  color={isActive ? theme.colors.text.inverse : theme.colors.text.primary}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, style]}
      >
        {renderContent()}
      </ScrollView>
    );
  }

  return <View style={[styles.container, style]}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tabList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  underlinedRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5DF',
    gap: 16,
  },
  pillTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  underlinedTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  countPill: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
});
