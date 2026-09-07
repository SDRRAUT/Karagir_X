import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Icon } from '@/components/icons/Icon';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminKycApplication } from '@/api/types';

export const AdminKycScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { kycQueue, approveKyc, rejectKyc } = useAdminStore();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTab');
    }
  };

  const filteredList = kycQueue.filter((item) => {
    if (filter === 'ALL') return true;
    return item.verificationStatus === filter;
  });

  const handleApprove = (app: AdminKycApplication) => {
    Alert.alert(
      'Approve Artisan KYC',
      `Grant official "Verified GI Master Artisan" accreditation to ${app.artisanName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Badge',
          style: 'default',
          onPress: () => approveKyc(app.id),
        },
      ]
    );
  };

  const handleReject = (app: AdminKycApplication) => {
    Alert.alert(
      'Reject / Request Resubmission',
      `Flag ${app.artisanName}'s application for clearer document upload?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => rejectKyc(app.id, 'Document scan blurry. Please re-upload with clear sunlight.'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B0F19' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrowLeft" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Artisan Accreditation & KYC
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Verify DC Handicrafts Pehchan IDs, Aadhaar tokens & GI authenticity
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => {
            const count =
              tab === 'ALL'
                ? kycQueue.length
                : kycQueue.filter((k) => k.verificationStatus === tab).length;
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
              No artisan KYC submissions under the {filter.toLowerCase()} category.
            </Text>
          </View>
        ) : (
          filteredList.map((app) => {
            const isPending = app.verificationStatus === 'PENDING';
            const isApproved = app.verificationStatus === 'APPROVED';

            return (
              <Card key={app.id} style={styles.kycCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarLetter}>{app.artisanName.charAt(0)}</Text>
                  </View>
                  <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                      <Text variant="labelLarge" style={styles.artisanName}>
                        {app.artisanName}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isApproved
                            ? styles.badgeApproved
                            : isPending
                            ? styles.badgePending
                            : styles.badgeRejected,
                        ]}
                      >
                        <Text
                          variant="caption"
                          style={[
                            styles.badgeText,
                            isApproved
                              ? { color: '#10B981' }
                              : isPending
                              ? { color: '#F59E0B' }
                              : { color: '#EF4444' },
                          ]}
                        >
                          {app.verificationStatus}
                        </Text>
                      </View>
                    </View>
                    <Text variant="caption" style={styles.submittedText}>
                      Submitted {app.submittedAt} • Phone: {app.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.craftDetailBox}>
                  <Text variant="bodyLarge" style={styles.craftTitle}>
                    {app.craftSpecialty}
                  </Text>
                  <Text variant="caption" style={styles.locationText}>
                    📍 {app.district}, {app.state}
                  </Text>
                </View>

                {/* Identity Credentials */}
                <View style={styles.credentialsRow}>
                  <View style={styles.credChip}>
                    <Icon name="creditCard" size={14} color="#94A3B8" />
                    <Text variant="caption" style={styles.credText}>
                      Aadhaar: •••• {app.aadhaarLast4}
                    </Text>
                  </View>
                  {app.pehchanCardId && (
                    <View style={styles.credChip}>
                      <Icon name="starFilled" size={14} color="#6366F1" />
                      <Text variant="caption" style={[styles.credText, { color: '#818CF8' }]}>
                        {app.pehchanCardId}
                      </Text>
                    </View>
                  )}
                  <View style={styles.credChip}>
                    <Icon name="star" size={14} color="#F59E0B" />
                    <Text variant="caption" style={[styles.credText, { color: '#FCD34D' }]}>
                      Score: {app.reliabilityScore}%
                    </Text>
                  </View>
                </View>

                {app.notes && (
                  <View style={styles.notesBox}>
                    <Text variant="caption" style={styles.notesText}>
                      📝 Note: {app.notes}
                    </Text>
                  </View>
                )}

                {/* Verification Actions */}
                {isPending && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(app)}
                      accessibilityRole="button"
                    >
                      <Icon name="close" size={16} color="#EF4444" />
                      <Text variant="bodySmall" style={{ color: '#EF4444', fontWeight: '700' }}>
                        Reject
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(app)}
                      accessibilityRole="button"
                    >
                      <Icon name="check" size={16} color="#FFFFFF" />
                      <Text variant="bodySmall" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                        Grant Verified Badge
                      </Text>
                    </TouchableOpacity>
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    marginTop: 2,
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
  kycCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3730A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#E0E7FF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artisanName: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  submittedText: {
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgeRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  craftDetailBox: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  craftTitle: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  locationText: {
    color: '#94A3B8',
    marginTop: 2,
  },
  credentialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  credChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  credText: {
    color: '#CBD5E1',
    fontWeight: '500',
  },
  notesBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  notesText: {
    color: '#FCD34D',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
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
});
