import { paymentService } from '@/api/paymentService';

describe('PaymentService', () => {
  it('creates payment intent and verifies escrow locking', async () => {
    const intent = await paymentService.createPaymentIntent(2150, 'order_123');
    expect(intent.currency).toBe('INR');
    expect(intent.escrowNodalAccount).toBeDefined();

    const verification = await paymentService.verifyPayment(intent.paymentIntentId, 'UPI');
    expect(verification.success).toBe(true);
    expect(verification.transactionId).toBeDefined();
    expect(verification.escrowVaultReference).toContain('VAULT-LOCK');
  });
});
