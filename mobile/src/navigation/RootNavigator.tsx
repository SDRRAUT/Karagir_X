import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AppNavigator } from './AppNavigator';

// Auth Screens
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { LanguageSelectionScreen } from '@/screens/auth/LanguageSelectionScreen';
import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { RoleSelectionScreen } from '@/screens/auth/RoleSelectionScreen';
import { AuthPhoneScreen } from '@/screens/auth/AuthPhoneScreen';
import { OtpVerificationScreen } from '@/screens/auth/OtpVerificationScreen';
import { ProfileSetupScreen } from '@/screens/auth/ProfileSetupScreen';

// Product Creation Flow Screens
import { CameraPermissionScreen } from '@/screens/product/CameraPermissionScreen';
import { CameraCaptureScreen } from '@/screens/product/CameraCaptureScreen';
import { PhotoReviewScreen } from '@/screens/product/PhotoReviewScreen';
import { AiEnhancementScreen } from '@/screens/product/AiEnhancementScreen';

// Voice-First AI Description & Conversational Interview
import { MicPermissionScreen } from '@/screens/product/MicPermissionScreen';
import { VoiceDescriptionScreen } from '@/screens/product/VoiceDescriptionScreen';
import { VoiceFollowUpScreen } from '@/screens/product/VoiceFollowUpScreen';

// Catalog Synthesis, Pricing & Publishing Screens
import { CatalogGenerationScreen } from '@/screens/product/CatalogGenerationScreen';
import { PricingRecommendationScreen } from '@/screens/product/PricingRecommendationScreen';
import { ProductPreviewScreen } from '@/screens/product/ProductPreviewScreen';
import { PublishSuccessScreen } from '@/screens/product/PublishSuccessScreen';

// Buyer Marketplace & Commerce Screens
import {
  BuyerHomeScreen as MarketplaceHomeScreen,
  CategoriesScreen,
  SearchScreen,
  ProductDetailScreen,
  WishlistScreen,
  CartScreen,
  CheckoutScreen,
  PaymentScreen,
  OrderConfirmationScreen,
  OrderTrackingScreen,
} from '@/screens/buyer';

// AI Market Linkage & B2B Cluster Opportunity Screens
import { OpportunitiesScreen } from '@/screens/linkage/OpportunitiesScreen';
import { OpportunityDetailScreen } from '@/screens/linkage/OpportunityDetailScreen';
import { QuoteNegotiationScreen } from '@/screens/linkage/QuoteNegotiationScreen';
import { B2BContractScreen } from '@/screens/linkage/B2BContractScreen';
import { CreateBulkRfqScreen } from '@/screens/linkage/CreateBulkRfqScreen';
import {
  AdminDashboardScreen,
  AdminKycScreen,
  AdminModerationScreen,
  AdminEscrowScreen,
} from '@/screens/admin';

import { useAuthStore } from '@/store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const hasCompletedProfile = !isLoading && (isAuthenticated || !!user?.isProfileComplete);

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) => {
          const role = useAuthStore.getState().user?.role || useAuthStore.getState().activeRole;
          const roleLabel =
            role === 'ARTISAN' ? 'Artisans' :
            role === 'BUYER' ? 'Buyer' :
            role === 'ADMIN' ? 'Command Center' : '';
          return roleLabel ? `Kalakar Setu ~ ${roleLabel}` : (options?.title ?? route?.name ?? 'Kalakar Setu');
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Authentication Journey Stack */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="AuthPhone" component={AuthPhoneScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

        {/* Authenticated Main App */}
        <Stack.Screen name="MainTabs" component={AppNavigator} />

        {/* Product Creation & Image Capture Flow */}
        <Stack.Screen name="CameraPermission" component={CameraPermissionScreen} />
        <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
        <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
        <Stack.Screen name="AiEnhancement" component={AiEnhancementScreen} />

        {/* Voice-First AI Description & Conversational Interview */}
        <Stack.Screen name="MicPermission" component={MicPermissionScreen} />
        <Stack.Screen name="VoiceDescription" component={VoiceDescriptionScreen} />
        <Stack.Screen name="VoiceFollowUp" component={VoiceFollowUpScreen} />

        {/* Catalog Synthesis, Fair Pricing & Marketplace Publishing */}
        <Stack.Screen name="CatalogGeneration" component={CatalogGenerationScreen} />
        <Stack.Screen name="PricingRecommendation" component={PricingRecommendationScreen} />
        <Stack.Screen name="ProductPreview" component={ProductPreviewScreen} />
        <Stack.Screen name="PublishSuccess" component={PublishSuccessScreen} />

        {/* Buyer Marketplace & Commerce Flow */}
        <Stack.Screen name="MarketplaceHome" component={MarketplaceHomeScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />

        {/* AI Market Linkage & B2B Cluster Engine Flow */}
        <Stack.Screen name="Opportunities" component={OpportunitiesScreen} />
        <Stack.Screen name="OpportunityDetail" component={OpportunityDetailScreen} />
        <Stack.Screen name="QuoteNegotiation" component={QuoteNegotiationScreen} />
        <Stack.Screen name="B2BContract" component={B2BContractScreen} />
        <Stack.Screen name="CreateBulkRfq" component={CreateBulkRfqScreen} />

        {/* Platform Admin & Governance Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminKyc" component={AdminKycScreen} />
        <Stack.Screen name="AdminModeration" component={AdminModerationScreen} />
        <Stack.Screen name="AdminEscrow" component={AdminEscrowScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
