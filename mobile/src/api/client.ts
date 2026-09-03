import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { envConfig } from '@/config/env';
import { logger } from '@/utils/logger';
import { ApiError, NetworkError } from '@/utils/errors';
import { ApiErrorResponse } from './types';

// Simple lightweight UUID v4 generator for idempotency keys without heavy dependencies
export function generateIdempotencyKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export type TokenProvider = () => Promise<string | null>;
export type LocaleProvider = () => string;
export type SessionExpiredHandler = (reason?: string) => void;

export class ApiClient {
  private instance: AxiosInstance;
  private tokenProvider?: TokenProvider;
  private localeProvider?: LocaleProvider;
  private sessionExpiredHandler?: SessionExpiredHandler;

  constructor(baseURL: string = envConfig.apiBaseUrl, timeoutMs: number = envConfig.apiTimeoutMs) {
    this.instance = axios.create({
      baseURL,
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Client-Platform': 'Android',
        'X-App-Version': envConfig.appVersion,
      },
    });

    this.setupInterceptors();
  }

  public setTokenProvider(provider: TokenProvider): void {
    this.tokenProvider = provider;
  }

  public setLocaleProvider(provider: LocaleProvider): void {
    this.localeProvider = provider;
  }

  public setSessionExpiredHandler(handler: SessionExpiredHandler): void {
    this.sessionExpiredHandler = handler;
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // Inject auth token if available
        if (this.tokenProvider) {
          const token = await this.tokenProvider();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Inject locale header
        if (this.localeProvider && config.headers) {
          config.headers['X-Locale'] = this.localeProvider();
        }

        // Inject Idempotency Key for state mutations (POST, PUT, PATCH, DELETE)
        const method = config.method?.toUpperCase();
        if (config.headers && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
          if (!config.headers['X-Idempotency-Key']) {
            config.headers['X-Idempotency-Key'] = generateIdempotencyKey();
          }
        }

        logger.debug('API_REQUEST', `${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API_REQUEST_ERROR', 'Request configuration failed', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug('API_RESPONSE', `${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        // Network Disconnected / No Response
        if (!error.response) {
          logger.warn('API_NETWORK_FAILURE', error.message);
          throw new NetworkError(error.message, { url: error.config?.url });
        }

        const status = error.response.status;
        const data = error.response.data;

        // Handle 401 Session Expiry
        if (status === 401 && this.sessionExpiredHandler) {
          this.sessionExpiredHandler(data?.error?.message || 'Session expired');
        }

        if (data && data.error) {
          logger.warn('API_PROBLEM_DETAILS', `${status}: ${data.error.code} - ${data.error.message}`);
          throw ApiError.fromProblemDetails(data.error, status);
        }

        // Fallback HTTP Error
        logger.warn('API_HTTP_ERROR', `${status}: ${error.message}`);
        throw new ApiError(error.message, 'HTTP_ERROR', status);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
