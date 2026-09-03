import { useSyncStore } from '@/store/useSyncStore';

describe('Sync Store (Outbox Queue)', () => {
  beforeEach(() => {
    useSyncStore.getState().clearQueue();
  });

  it('enqueues mutations into offline outbox', () => {
    useSyncStore.getState().enqueueMutation({
      mutationId: 'mut_101',
      entityType: 'PRODUCT',
      action: 'CREATE',
      payload: { title: 'Madhubani Painting' },
    });

    const queue = useSyncStore.getState().queue;
    expect(queue.length).toBe(1);
    expect(queue[0].mutationId).toBe('mut_101');
    expect(queue[0].status).toBe('PENDING');
  });

  it('marks mutation as processing and removes after sync', () => {
    useSyncStore.getState().enqueueMutation({
      mutationId: 'mut_102',
      entityType: 'ORDER',
      action: 'UPDATE',
      payload: { status: 'ACCEPTED' },
    });

    useSyncStore.getState().markProcessing('mut_102');
    expect(useSyncStore.getState().queue[0].status).toBe('PROCESSING');

    useSyncStore.getState().removeMutation('mut_102');
    expect(useSyncStore.getState().queue.length).toBe(0);
  });
});
