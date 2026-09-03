export type UserRole = 'ARTISAN' | 'BUYER' | 'FACILITATOR' | 'ADMIN_STAFF';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    voice_prompt_locale?: Record<string, string>;
    details?: Record<string, unknown>;
    timestamp?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface UserProfile {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  preferredLanguage: string;
  craftCategoryCode?: string;
  district?: string;
  state?: string;
  villageName?: string;
  shgOrFacilitatorCode?: string;
  isProfileComplete?: boolean;
}

export interface SendOtpRequest {
  phone_number: string;
  locale: string;
  role?: UserRole;
}

export interface SendOtpResponse {
  status: string;
  session_id: string;
  retry_after_seconds: number;
}

export interface VerifyOtpRequest {
  session_id: string;
  otp_code: string;
  phone_number: string;
  role?: UserRole;
}

export interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  expires_in_seconds: number;
  user: UserProfile;
  is_new_user: boolean;
}

export interface ProfileSetupRequest {
  full_name: string;
  craft_category_code: string;
  district: string;
  state: string;
  village_name?: string;
  shg_or_facilitator_code?: string;
}
