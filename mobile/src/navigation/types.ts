import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '@/api/types';

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  KhataTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  LanguageSelection: undefined;
  Onboarding: undefined;
  RoleSelection: undefined;
  AuthPhone: { role: UserRole };
  OtpVerification: {
    phoneNumber: string;
    sessionId: string;
    role: UserRole;
  };
  ProfileSetup: { role: UserRole };
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Product Creation & Image Capture Journey
  CameraPermission: undefined;
  CameraCapture: undefined;
  PhotoReview: undefined;
  AiEnhancement: undefined;

  // Voice-First AI Description & Conversational Q&A
  MicPermission: undefined;
  VoiceDescription: undefined;
  VoiceFollowUp: undefined;

  // Catalog Synthesis, Pricing & Publishing
  CatalogGeneration: undefined;
  PricingRecommendation: undefined;
  ProductPreview: undefined;
  PublishSuccess: undefined;

  // Buyer Marketplace & Commerce Journey
  MarketplaceHome: undefined;
  Categories: undefined;
  Search: undefined;
  ProductDetail: { productId: string };
  Wishlist: undefined;
  Cart: undefined;
  Checkout: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };

  // AI Market Linkage & B2B Cluster Opportunity Journey
  Opportunities: undefined;
  OpportunityDetail: { opportunityId: string };
  QuoteNegotiation: { opportunityId: string };
  B2BContract: { contractId: string };
  CreateBulkRfq: undefined;
};
