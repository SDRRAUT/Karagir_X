import { adminService } from '@/api/adminService';

describe('AdminService', () => {
  it('fetches platform metrics with GMV and active counts', async () => {
    const metrics = await adminService.getPlatformMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.totalGmv).toBeGreaterThan(0);
    expect(metrics.activeArtisansCount).toBeGreaterThan(0);
    expect(metrics.platformCommissionRevenue).toBe(Math.round(metrics.totalGmv * 0.05));
    expect(metrics.pendingKycCount).toBeGreaterThanOrEqual(0);
  });

  it('updates artisan KYC application status to APPROVED', async () => {
    const pendingList = await adminService.getPendingKycList();
    expect(pendingList.length).toBeGreaterThan(0);

    const first = pendingList[0];
    const updated = await adminService.updateKycStatus(first.id, 'APPROVED');
    expect(updated.verificationStatus).toBe('APPROVED');
  });

  it('moderates a flagged catalog listing', async () => {
    const listings = await adminService.getFlaggedListings();
    expect(listings.length).toBeGreaterThan(0);

    const first = listings[0];
    const updated = await adminService.moderateListing(first.id, 'APPROVED');
    expect(updated.status).toBe('APPROVED');
  });

  it('manages escrow transactions and releases funds', async () => {
    const txns = await adminService.getEscrowTransactions();
    expect(txns.length).toBeGreaterThan(0);

    const first = txns[0];
    const released = await adminService.forceReleaseEscrow(first.id);
    expect(released.escrowStatus).toBe('RELEASED_TO_ARTISAN');
  });

  it('resolves an active escrow dispute with buyer refund', async () => {
    const txns = await adminService.getEscrowTransactions();
    const disputed = txns.find((t) => t.hasDispute);
    if (disputed) {
      const resolved = await adminService.resolveDispute(disputed.id, 'REFUND_BUYER');
      expect(resolved.escrowStatus).toBe('REFUNDED_TO_BUYER');
      expect(resolved.hasDispute).toBe(false);
    }
  });
});
