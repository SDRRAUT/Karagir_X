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

export interface Country {
  id: number;
  name: string;
  isoCode: string;
  phoneCode: string;
  nameHi?: string;
  nameMr?: string;
  isActive: boolean;
}

export interface State {
  id: number;
  countryId: number;
  name: string;
  nameHi?: string;
  nameMr?: string;
  lgdCode: number;
  stateType: 'STATE' | 'UT';
  isActive: boolean;
}

export interface District {
  id: number;
  stateId: number;
  name: string;
  nameHi?: string;
  nameMr?: string;
  lgdCode: number;
  isActive: boolean;
}

export interface SubDistrict {
  id: number;
  districtId: number;
  name: string;
  nameHi?: string;
  nameMr?: string;
  lgdCode: number;
  subDistrictType: 'TALUKA' | 'TEHSIL' | 'MANDAL' | 'BLOCK' | 'SUB_DIVISION';
  isActive: boolean;
}

export interface Village {
  id: number;
  subDistrictId: number;
  name: string;
  nameHi?: string;
  nameMr?: string;
  lgdCode?: number;
  pincode?: string;
  isCraftCluster: boolean;
  craftSpecialty?: string;
  isActive: boolean;
}

export interface LocationHierarchyValue {
  countryId?: number;
  stateId?: number;
  districtId?: number;
  subDistrictId?: number;
  villageId?: number;
  countryName: string;
  stateName: string;
  districtName: string;
  subDistrictName?: string;
  villageName?: string;
  pincode?: string;
}

export interface UserProfile {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  preferredLanguage: string;
  craftCategoryCode?: string;
  countryId?: number;
  stateId?: number;
  districtId?: number;
  subDistrictId?: number;
  villageId?: number;
  district?: string;
  state?: string;
  subDistrict?: string;
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
  role?: UserRole;
  craft_category_code: string;
  country_id?: number;
  state_id?: number;
  district_id?: number;
  sub_district_id?: number;
  village_id?: number;
  district: string;
  state: string;
  sub_district?: string;
  village_name?: string;
  shg_or_facilitator_code?: string;
}
