import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Icon } from '@/components/icons/Icon';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminEscrowTransaction } from '@/api/types';

export const AdminEscrowScreen: React.FC = () => {
  const { escrowQueue, forceReleaseEscrow, resolveDispute } = useAdminStore();
  const [filter, setFilter] = useState<'ALL' | 'DISPUTED' | 'NODAL_VAULT' | 'RELEASE_PENDING'>('ALL');

  const filteredList = escrowQueue.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'DISPUTED') return item.hasDispute;
    if (filter === 'NODAL_VAULT') return item.escrowStatus === 'HELD_IN_NODAL_VAULT';
    if (filter === 'RELEASE_PENDING') return item.escrowStatus === 'RELEASE_PENDING';
    return true;
  });

  const handleForceRelease = (txn: AdminEscrowTransaction) => {
    Alert.alert(
      'Release Escrow to Artisan',
      `Directly disburse ₹${txn.amount.toLocaleString('en-IN')} via IMPS to ${txn.artisanName}'s verified bank account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disburse Funds',
          style: 'default',
          onPress: () => forceReleaseEscrow(txn.id),
        },
      ]
    );
  };

  const handleResolveDispute = (txn: AdminEscrowTransaction, resolution: 'REFUND_BUYER' | 'RELEASE_TO_ARTISAN') => {
    const isRefund = resolution === 'REFUND_BUYER';
    Alert.alert(
      isRefund ? 'Issue Buyer Refund' : 'Release to Artisan',
      isRefund
        ? `Refund ₹${txn.amount.toLocaleString('en-IN')} to buyer ${txn.buyerName}?`
        : `Release ₹${txn.amount.toLocaleString('en-IN')} to ${txn.artisanName} and initiate India Post postal insurance claim?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Resolution',
          style: isRefund ? 'destructive' : 'default',
          onPress: () => resolveDispute(txn.id, resolution),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B0F19' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Escrow & Dispute Reconciliation
        </Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          RBI nodal escrow vault balancing, Speed Post delivery timers & claims
        </Text>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { key: 'ALL', label: 'All Transactions' },
            { key: 'DISPUTED', label: 'Disputes' },
            { key: 'NODAL_VAULT', label: 'Locked in Vault' },
            { key: 'RELEASE_PENDING', label: 'Release Pending' },
          ].map((tab) => {
            const isSelected = filter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setFilter(tab.key as any)}
                accessibilityRole="button"
              >
                <Text
                  variant="caption"
                  style={[styles.filterText, isSelected && styles.filterTextActive]}
                >
                  {tab.label}
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
              No Records
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              No escrow records found for the selected view.
            </Text>
          </View>
        ) : (
          filteredList.map((txn) => {
            const isDisputed = txn.hasDispute;
            const isReleased = txn.escrowStatus === 'RELEASED_TO_ARTISAN';
            const isRefunded = txn.escrowStatus === 'REFUNDED_TO_BUYER';

            return (
              <Card key={txn.id} style={styles.escrowCard}>
                <View style={styles.topRow}>
                  <View>
                    <Text variant="caption" style={styles.orderNumber}>
                      {txn.orderNumber}
                    </Text>
                    <Text variant="labelLarge" style={styles.craftTitle}>
                      {txn.craftTitle}
                    </Text>
                  </View>
                  <View style={styles.amountBox}>
                    <Text variant="headlineSmall" style={styles.amountText}>
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text variant="caption" style={styles.escrowTag}>
                      NODAL ESCROW
                    </Text>
                  </View>
                </View>

                {/* Parties info */}
                <View style={styles.partiesRow}>
                  <Text variant="caption" style={styles.partyText}>
                    👤 Buyer: <Text style={{ color: '#F8FAFC', fontWeight: '600' }}>{txn.buyerName}</Text>
                  </Text>
                  <Text variant="caption" style={styles.partyText}>
                    🌾 Artisan: <Text style={{ color: '#F8FAFC', fontWeight: '600' }}>{txn.artisanName}</Text>
                  </Text>
                </View>

                {/* Tracking status */}
                <View style={styles.trackingBox}>
                  <View style={styles.trackingHeader}>
                    <Icon name="truck" size={14} color="#38BDF8" />
                    <Text variant="caption" style={styles.trackingBarcode}>
                      Speed Post: {txn.trackingNumber}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.milestoneText}>
                    {txn.deliveryMilestone}
                  </Text>
                  {txn.hoursRemaining > 0 && (
                    <Text variant="caption" style={styles.timerText}>
                      ⏱️ 48h Inspection Window: {txn.hoursRemaining} hours remaining
                    </Text>
                  )}
                </View>

                {/* Dispute Section */}
                {isDisputed && (
                  <View style={styles.disputeBox}>
                    <View style={styles.disputeHeader}>
                      <Icon name="alertCircle" size={16} color="#F59E0B" />
                      <Text variant="labelLarge" style={styles.disputeTitle}>
                        Buyer Dispute / Claim Active
                      </Text>
                    </View>
                    <Text variant="bodySmall" style={styles.disputeDesc}>
                      {txn.disputeReason}
                    </Text>

                    <View style={styles.disputeActionsRow}>
                      <TouchableOpacity
                        style={[styles.disputeBtn, { backgroundColor: '#EF4444' }]}
                        onPress={() => handleResolveDispute(txn, 'REFUND_BUYER')}
                        accessibilityRole="button"
                      >
                        <Text variant="caption" style={styles.btnText}>
                          Refund Buyer (₹{txn.amount})
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.disputeBtn, { backgroundColor: '#10B981' }]}
                        onPress={() => handleResolveDispute(txn, 'RELEASE_TO_ARTISAN')}
                        accessibilityRole="button"
                      >
                        <Text variant="caption" style={styles.btnText}>
                          Release to Artisan (Insured)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Normal Release Action */}
                {!isDisputed && !isReleased && !isRefunded && (
                  <TouchableOpacity
                    style={styles.releaseBtn}
                    onPress={() => handleForceRelease(txn)}
                    accessibilityRole="button"
                  >
                    <Icon name="lock" size={14} color="#FFFFFF" />
                    <Text variant="bodySmall" style={styles.releaseBtnText}>
                      Force Release Escrow to Artisan Bank
                    </Text>
                  </TouchableOpacity>
                )}

                {(isReleased || isRefunded) && (
                  <View style={styles.completedBadge}>
                    <Icon name="checkCircle" size={14} color={isReleased ? '#10B981' : '#F59E0B'} />
                    <Text
                      variant="caption"
                      style={{ color: isReleased ? '#10B981' : '#F59E0B', fontWeight: '700' }}
                    >
                      {isReleased ? 'Funds Disbursed to Artisan via IMPS' : 'Refunded to Buyer Account'}
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
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 10,
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
  escrowCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  craftTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: '#10B981',
    fontWeight: '800',
  },
  escrowTag: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  partiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  partyText: {
    color: '#94A3B8',
  },
  trackingBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trackingBarcode: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  milestoneText: {
    color: '#F1F5F9',
  },
  timerText: {
    color: '#F59E0B',
    marginTop: 4,
    fontWeight: '600',
  },
  disputeBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  disputeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  disputeTitle: {
    color: '#FCD34D',
    fontWeight: '700',
  },
  disputeDesc: {
    color: '#FEF3C7',
    marginBottom: 10,
  },
  disputeActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  disputeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  releaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    borderRadius: 8,
  },
  releaseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 6,
  },
});
