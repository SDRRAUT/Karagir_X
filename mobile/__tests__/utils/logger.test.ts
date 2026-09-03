import { logger, LogEntry } from '@/utils/logger';

describe('Structured Logger', () => {
  it('dispatches logs to custom sinks', () => {
    const received: LogEntry[] = [];
    logger.addSink((entry) => received.push(entry));

    logger.info('TEST_TAG', 'This is a test info message', { count: 42 });

    expect(received.length).toBeGreaterThan(0);
    const last = received[received.length - 1];
    expect(last.level).toBe('INFO');
    expect(last.tag).toBe('TEST_TAG');
    expect(last.message).toBe('This is a test info message');
    expect(last.metadata).toEqual({ count: 42 });
    expect(last.timestamp).toBeDefined();
  });

  it('captures errors with error level', () => {
    const received: LogEntry[] = [];
    logger.addSink((entry) => received.push(entry));

    const testError = new Error('Database connection failed');
    logger.error('CRITICAL', 'Operation failed', testError);

    const last = received[received.length - 1];
    expect(last.level).toBe('ERROR');
    expect(last.tag).toBe('CRITICAL');
    expect(last.error).toBe(testError);
  });
});
