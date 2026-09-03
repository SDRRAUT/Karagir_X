export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/auth/artisan/send-otp',
    VERIFY_OTP: '/auth/artisan/verify-otp',
    SWITCH_PROFILE: '/auth/switch-profile',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  ARTISAN: {
    PROFILE: '/artisan/profile',
    DASHBOARD_SUMMARY: '/artisan/dashboard/summary',
    KYC_AADHAAR: '/artisan/kyc/aadhaar-verify',
    EARNINGS_PASSBOOK: '/artisan/earnings/passbook',
  },
  AI: {
    ENHANCE_PHOTO: '/ai/vision/enhance-photo',
    TRANSCRIBE_TURN: '/ai/voice/transcribe-turn',
    SYNTHESIZE_CATALOG: '/ai/catalog/synthesize',
    CATALOG_SYNTHESIZE: '/ai/catalog/synthesize',
  },
  PRICING: {
    CALCULATE_FAIR_PRICE: '/pricing/calculate-fair-price',
  },
  PRODUCTS: {
    BASE: '/products',
    LIST: '/products',
    CREATE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    BY_ID: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    ARTISAN_LIST: '/artisan/orders',
    BY_ID: (id: string) => `/artisan/orders/${id}`,
    ACCEPT: (id: string) => `/artisan/orders/${id}/accept`,
    REJECT: (id: string) => `/artisan/orders/${id}/reject`,
  },
  PAYMENTS: {
    INTENT: '/payments/create-intent',
    VERIFY: '/payments/verify',
  },
  LINKAGE: {
    OPPORTUNITIES: '/linkage/opportunities',
    DETAIL: (id: string) => `/linkage/opportunities/${id}`,
    SUBMIT_QUOTE: (id: string) => `/linkage/opportunities/${id}/quote`,
    CREATE_RFQ: '/linkage/b2b/rfq',
    CONTRACTS: '/linkage/b2b/contracts',
  },
  SYNC: {
    BATCH_OUTBOX: '/sync/batch-outbox',
  },
} as const;
