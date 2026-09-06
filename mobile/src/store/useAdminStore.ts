import { create } from 'zustand';
import { logger } from '@/utils/logger';
import {
  AdminPlatformMetrics,
  AdminKycApplication,
  AdminFlaggedListing,
  AdminEscrowTransaction,
} from '@/api/types';
import { adminService } from '@/api/adminService';

interface AdminState {
  metrics: AdminPlatformMetrics | null;
  kycQueue: AdminKycApplication[];
  moderationQueue: AdminFlaggedListing[];
  escrowQueue: AdminEscrowTransaction[];
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;
  approveKyc: (appId: string) => Promise<void>;
  rejectKyc: (appId: string, notes?: string) => Promise<void>;
  approveListing: (listingId: string) => Promise<void>;
  rejectListing: (listingId: string) => Promise<void>;
  forceReleaseEscrow: (escrowId: string) => Promise<void>;
  resolveDispute: (escrowId: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_ARTISAN') => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  metrics: null,
  kycQueue: [],
  moderationQueue: [],
  escrowQueue: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      const [metrics, kycList, listings, escrowList] = await Promise.all([
        adminService.getPlatformMetrics(),
        adminService.getPendingKycList(),
        adminService.getFlaggedListings(),
        adminService.getEscrowTransactions(),
      ]);
      set({
        metrics,
        kycQueue: kycList,
        moderationQueue: listings,
        escrowQueue: escrowList,
        isLoading: false,
      });
      logger.info('ADMIN_STORE', 'Admin state hydrated successfully');
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Failed to fetch admin data', err);
      set({ error: err.message || 'Failed to load admin data', isLoading: false });
    }
  },

  approveKyc: async (appId: string) => {
    try {
      const updated = await adminService.updateKycStatus(appId, 'APPROVED');
      set((state) => ({
        kycQueue: state.kycQueue.map((k) => (k.id === appId ? updated : k)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              pendingKycCount: Math.max(0, state.metrics.pendingKycCount - 1),
              activeArtisansCount: state.metrics.activeArtisansCount + 1,
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Approved KYC: ${appId}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error approving KYC', err);
    }
  },

  rejectKyc: async (appId: string, notes?: string) => {
    try {
      const updated = await adminService.updateKycStatus(appId, 'REJECTED', notes);
      set((state) => ({
        kycQueue: state.kycQueue.map((k) => (k.id === appId ? updated : k)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              pendingKycCount: Math.max(0, state.metrics.pendingKycCount - 1),
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Rejected KYC: ${appId}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error rejecting KYC', err);
    }
  },

  approveListing: async (listingId: string) => {
    try {
      const updated = await adminService.moderateListing(listingId, 'APPROVED');
      set((state) => ({
        moderationQueue: state.moderationQueue.map((l) => (l.id === listingId ? updated : l)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              flaggedListingsCount: Math.max(0, state.metrics.flaggedListingsCount - 1),
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Approved listing: ${listingId}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error approving listing', err);
    }
  },

  rejectListing: async (listingId: string) => {
    try {
      const updated = await adminService.moderateListing(listingId, 'REJECTED');
      set((state) => ({
        moderationQueue: state.moderationQueue.map((l) => (l.id === listingId ? updated : l)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              flaggedListingsCount: Math.max(0, state.metrics.flaggedListingsCount - 1),
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Rejected listing: ${listingId}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error rejecting listing', err);
    }
  },

  forceReleaseEscrow: async (escrowId: string) => {
    try {
      const updated = await adminService.forceReleaseEscrow(escrowId);
      set((state) => ({
        escrowQueue: state.escrowQueue.map((e) => (e.id === escrowId ? updated : e)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              totalEscrowLocked: Math.max(0, state.metrics.totalEscrowLocked - updated.amount),
              activeDisputesCount: state.escrowQueue.filter((e) => e.id !== escrowId && e.hasDispute).length,
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Force released escrow: ${escrowId}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error releasing escrow', err);
    }
  },

  resolveDispute: async (escrowId: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_ARTISAN') => {
    try {
      const updated = await adminService.resolveDispute(escrowId, resolution);
      set((state) => ({
        escrowQueue: state.escrowQueue.map((e) => (e.id === escrowId ? updated : e)),
        metrics: state.metrics
          ? {
              ...state.metrics,
              activeDisputesCount: Math.max(0, state.metrics.activeDisputesCount - 1),
            }
          : null,
      }));
      logger.info('ADMIN_STORE', `Resolved dispute: ${escrowId} -> ${resolution}`);
    } catch (err: any) {
      logger.error('ADMIN_STORE', 'Error resolving dispute', err);
    }
  },
}));
