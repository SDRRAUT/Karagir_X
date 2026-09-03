import { envConfig } from '@/config/env';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  level: LogLevel;
  tag: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  error?: Error | unknown;
}

export type LogSink = (entry: LogEntry) => void;

class Logger {
  private sinks: LogSink[] = [];

  constructor() {
    // Default console sink
    this.addSink(this.defaultConsoleSink);
  }

  public addSink(sink: LogSink): void {
    this.sinks.push(sink);
  }

  public debug(tag: string, message: string, metadata?: Record<string, unknown>): void {
    if (envConfig.environment !== 'production') {
      this.dispatch('DEBUG', tag, message, metadata);
    }
  }

  public info(tag: string, message: string, metadata?: Record<string, unknown>): void {
    this.dispatch('INFO', tag, message, metadata);
  }

  public warn(tag: string, message: string, metadata?: Record<string, unknown>): void {
    this.dispatch('WARN', tag, message, metadata);
  }

  public error(tag: string, message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    this.dispatch('ERROR', tag, message, metadata, error);
  }

  private dispatch(
    level: LogLevel,
    tag: string,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error | unknown
  ): void {
    const entry: LogEntry = {
      level,
      tag,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      error,
    };

    for (const sink of this.sinks) {
      try {
        sink(entry);
      } catch {
        // Prevent logging failures from breaking application runtime
      }
    }
  }

  private defaultConsoleSink(entry: LogEntry): void {
    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.tag}] ${entry.message}`;
    switch (entry.level) {
      case 'DEBUG':
        // eslint-disable-next-line no-console
        console.log(formatted, entry.metadata || '');
        break;
      case 'INFO':
        // eslint-disable-next-line no-console
        console.info(formatted, entry.metadata || '');
        break;
      case 'WARN':
        console.warn(formatted, entry.metadata || '');
        break;
      case 'ERROR':
        console.error(formatted, entry.error || '', entry.metadata || '');
        break;
    }
  }
}

export const logger = new Logger();
