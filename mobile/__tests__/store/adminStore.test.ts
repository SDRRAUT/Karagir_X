import { useAdminStore } from '@/store/useAdminStore';

describe('useAdminStore', () => {
  it('hydrates platform data from adminService', async () => {
    const store = useAdminStore.getState();
    await store.fetchDashboardData();

    const state = useAdminStore.getState();
    expect(state.metrics).not.toBeNull();
    expect(state.kycQueue.length).toBeGreaterThan(0);
    expect(state.moderationQueue.length).toBeGreaterThan(0);
    expect(state.escrowQueue.length).toBeGreaterThan(0);
    expect(state.isLoading).toBe(false);
  });

  it('approves a pending KYC submission in store', async () => {
    const store = useAdminStore.getState();
    await store.fetchDashboardData();

    const initialPending = store.kycQueue.find((k) => k.verificationStatus === 'PENDING');
    if (initialPending) {
      await store.approveKyc(initialPending.id);
      const updated = useAdminStore.getState().kycQueue.find((k) => k.id === initialPending.id);
      expect(updated?.verificationStatus).toBe('APPROVED');
    }
  });

  it('moderates a flagged listing in store', async () => {
    const store = useAdminStore.getState();
    await store.fetchDashboardData();

    const targetListing = store.moderationQueue[0];
    if (targetListing) {
      await store.approveListing(targetListing.id);
      const updated = useAdminStore.getState().moderationQueue.find((l) => l.id === targetListing.id);
      expect(updated?.status).toBe('APPROVED');
    }
  });

  it('releases an escrow transaction in store', async () => {
    const store = useAdminStore.getState();
    await store.fetchDashboardData();

    const targetEscrow = store.escrowQueue[0];
    if (targetEscrow) {
      await store.forceReleaseEscrow(targetEscrow.id);
      const updated = useAdminStore.getState().escrowQueue.find((e) => e.id === targetEscrow.id);
      expect(updated?.escrowStatus).toBe('RELEASED_TO_ARTISAN');
    }
  });
});
