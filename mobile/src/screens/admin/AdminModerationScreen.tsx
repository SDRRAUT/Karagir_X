import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Icon } from '@/components/icons/Icon';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminFlaggedListing } from '@/api/types';

export const AdminModerationScreen: React.FC = () => {
  const { moderationQueue, approveListing, rejectListing } = useAdminStore();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const filteredList = moderationQueue.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const handleApprove = (listing: AdminFlaggedListing) => {
    Alert.alert(
      'Publish to Marketplace',
      `Clear AI flags and publish "${listing.title}" to the national marketplace?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Publish',
          style: 'default',
          onPress: () => approveListing(listing.id),
        },
      ]
    );
  };

  const handleReject = (listing: AdminFlaggedListing) => {
    Alert.alert(
      'Reject Listing',
      `Reject "${listing.title}" and notify artisan with AI feedback?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject Listing',
          style: 'destructive',
          onPress: () => rejectListing(listing.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B0F19' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          AI Catalog Moderation
        </Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          Audit AI-flagged listings for copyright, machine imitation & pricing anomalies
        </Text>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => {
            const count =
              tab === 'ALL'
                ? moderationQueue.length
                : moderationQueue.filter((l) => l.status === tab).length;
            const isSelected = filter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setFilter(tab)}
                accessibilityRole="button"
              >
                <Text
                  variant="caption"
                  style={[styles.filterText, isSelected && styles.filterTextActive]}
                >
                  {tab} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Icon name="checkCircle" size={40} color="#10B981" />
            <Text variant="labelLarge" style={styles.emptyTitle}>
              Queue Clear!
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              No flagged listings under the {filter.toLowerCase()} category.
            </Text>
          </View>
        ) : (
          filteredList.map((listing) => {
            const isPending = listing.status === 'PENDING';
            const isApproved = listing.status === 'APPROVED';

            return (
              <Card key={listing.id} style={styles.listingCard}>
                <View style={styles.cardHeaderRow}>
                  <Image source={{ uri: listing.imageUrl }} style={styles.productThumb} />
                  <View style={styles.headerInfo}>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.riskBadge,
                          listing.aiRiskScore > 70
                            ? styles.riskHigh
                            : listing.aiRiskScore > 50
                            ? styles.riskMed
                            : styles.riskLow,
                        ]}
                      >
                        <Text variant="caption" style={styles.riskText}>
                          AI Risk: {listing.aiRiskScore}%
                        </Text>
                      </View>
                      <Text variant="caption" style={styles.createdText}>
                        {listing.createdAt}
                      </Text>
                    </View>

                    <Text variant="labelLarge" style={styles.listingTitle} numberOfLines={2}>
                      {listing.title}
                    </Text>
                    <Text variant="caption" style={styles.artisanName}>
                      By {listing.artisanName} • {listing.craftCategory}
                    </Text>
                  </View>
                </View>

                {/* Price comparison */}
                <View style={styles.priceRow}>
                  <View style={styles.priceBox}>
                    <Text variant="caption" style={styles.priceLabel}>
                      Listed Price
                    </Text>
                    <Text variant="labelLarge" style={styles.priceValue}>
                      ₹{listing.price}
                    </Text>
                  </View>
                  <View style={styles.priceBox}>
                    <Text variant="caption" style={styles.priceLabel}>
                      AI Living-Wage Suggestion
                    </Text>
                    <Text variant="labelLarge" style={[styles.priceValue, { color: '#10B981' }]}>
                      ₹{listing.fairPriceSuggested}
                    </Text>
                  </View>
                </View>

                {/* Flag Reason */}
                <View style={styles.flagReasonBox}>
                  <Icon name="alertCircle" size={16} color="#F87171" />
                  <Text variant="bodySmall" style={styles.flagReasonText}>
                    {listing.flagReason}
                  </Text>
                </View>

                {/* Actions */}
                {isPending && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(listing)}
                      accessibilityRole="button"
                    >
                      <Icon name="close" size={16} color="#EF4444" />
                      <Text variant="bodySmall" style={{ color: '#EF4444', fontWeight: '700' }}>
                        Reject / Delist
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(listing)}
                      accessibilityRole="button"
                    >
                      <Icon name="check" size={16} color="#FFFFFF" />
                      <Text variant="bodySmall" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                        Approve & Publish
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!isPending && (
                  <View style={styles.resolutionRow}>
                    <Icon
                      name={isApproved ? 'checkCircle' : 'close'}
                      size={16}
                      color={isApproved ? '#10B981' : '#EF4444'}
                    />
                    <Text
                      variant="caption"
                      style={{ color: isApproved ? '#10B981' : '#EF4444', fontWeight: '700' }}
                    >
                      {isApproved ? 'Approved for Marketplace' : 'Rejected & Delisted'}
                    </Text>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterPillActive: {
    backgroundColor: '#4338CA',
    borderColor: '#6366F1',
  },
  filterText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  listingCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  headerInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  riskMed: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  riskLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  riskText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 10,
  },
  createdText: {
    color: '#64748B',
  },
  listingTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  artisanName: {
    color: '#94A3B8',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  priceBox: {
    flex: 1,
  },
  priceLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
  priceValue: {
    color: '#F8FAFC',
    fontWeight: '700',
    marginTop: 2,
  },
  flagReasonBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  flagReasonText: {
    color: '#FCA5A5',
    flex: 1,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  resolutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 6,
  },
});
