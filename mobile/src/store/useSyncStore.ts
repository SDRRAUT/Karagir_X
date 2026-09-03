import { create } from 'zustand';
import { logger } from '@/utils/logger';

export interface OutboxMutation {
  mutationId: string;
  entityType: 'PRODUCT' | 'ORDER' | 'STOCK' | 'PROFILE';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'PROCESSING' | 'FAILED';
}

export interface SyncState {
  queue: OutboxMutation[];
  isSyncing: boolean;

  // Actions
  enqueueMutation: (mutation: Omit<OutboxMutation, 'createdAt' | 'retryCount' | 'status'>) => void;
  removeMutation: (mutationId: string) => void;
  markProcessing: (mutationId: string) => void;
  markFailed: (mutationId: string) => void;
  setSyncing: (isSyncing: boolean) => void;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  queue: [],
  isSyncing: false,

  enqueueMutation: (mutation) => {
    const newEntry: OutboxMutation = {
      ...mutation,
      createdAt: Date.now(),
      retryCount: 0,
      status: 'PENDING',
    };

    set((state) => ({
      queue: [...state.queue, newEntry],
    }));
    logger.info('SYNC_STORE', `Enqueued outbox mutation: ${mutation.mutationId} (${mutation.entityType})`);
  },

  removeMutation: (mutationId) => {
    set((state) => ({
      queue: state.queue.filter((m) => m.mutationId !== mutationId),
    }));
    logger.info('SYNC_STORE', `Removed synced mutation: ${mutationId}`);
  },

  markProcessing: (mutationId) => {
    set((state) => ({
      queue: state.queue.map((m) =>
        m.mutationId === mutationId ? { ...m, status: 'PROCESSING' } : m
      ),
    }));
  },

  markFailed: (mutationId) => {
    set((state) => ({
      queue: state.queue.map((m) =>
        m.mutationId === mutationId
          ? { ...m, status: 'FAILED', retryCount: m.retryCount + 1 }
          : m
      ),
    }));
    logger.warn('SYNC_STORE', `Mutation failed: ${mutationId}`);
  },

  setSyncing: (isSyncing) => set({ isSyncing }),
  clearQueue: () => set({ queue: [] }),
}));
