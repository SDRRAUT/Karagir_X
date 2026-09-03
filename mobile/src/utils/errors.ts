export interface VoicePromptLocale {
  hi?: string;
  en?: string;
  [locale: string]: string | undefined;
}

export interface ProblemDetails {
  code: string;
  message: string;
  voice_prompt_locale?: VoicePromptLocale;
  details?: Record<string, unknown>;
  timestamp?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly voicePromptLocale?: VoicePromptLocale;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    voicePromptLocale?: VoicePromptLocale,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.voicePromptLocale = voicePromptLocale;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network disconnected. Changes saved locally.', details?: Record<string, unknown>) {
    super(
      message,
      'NETWORK_DISCONNECTED',
      0,
      {
        hi: 'Internet nahi chal raha hai. Aapka kaam phone mein safe hai.',
        en: 'Network disconnected. Your work is saved on the phone.',
      },
      details
    );
    this.name = 'NetworkError';
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    voicePromptLocale?: VoicePromptLocale,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, voicePromptLocale, details);
    this.name = 'ApiError';
  }

  public static fromProblemDetails(problem: ProblemDetails, statusCode: number): ApiError {
    return new ApiError(
      problem.message,
      problem.code,
      statusCode,
      problem.voice_prompt_locale,
      problem.details
    );
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Session expired. Please re-authenticate.') {
    super(message, 'UNAUTHORIZED', 401, {
      hi: 'Aapka session expire ho gaya hai. Kripya dobara login karein.',
      en: 'Your session has expired. Please log in again.',
    });
    this.name = 'AuthError';
  }
}
