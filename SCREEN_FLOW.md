# KaragirX — Master Screen Flow & Navigation Architecture (Boxes & Lines)

> **Purpose**: Visual box-and-line architectural map of all screens, user journeys, navigation state machines, and voice guidance touchpoints across the **KaragirX** mobile application.

---

## 1. Master System Flowchart (Boxes & Lines)

```
                              ┌───────────────────────────────┐
                              │       APP LAUNCHED            │
                              └───────────────┬───────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │       01. SPLASH SCREEN       │
                              │   [ KarigarX Logo Reveal ]    │
                              │   (3-Second Auto Progress)    │
                              └───────────────┬───────────────┘
                                              │
                                     (Timer / Tap to Skip)
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │     02. AUTH PHONE SCREEN     │
                              │  [ Buyer | Artisan | Sahyogi ]│
                              │  [ MOBILE NUMBER: [ +91 ] [🔊]│
                              │  [ ⚡ 1-Tap Demo Login ]      │
                              │  [ Continue to Studio → ]     │
                              └───────┬───────────────┬───────┘
                                      │               │
                     (Enter Mobile & Submit)    (Tap ⚡ 1-Tap Demo)
                                      │               │
                                      ▼               │
                        ┌───────────────────────────┐ │
                        │  06. OTP VERIFICATION     │ │
                        │  [ 6-Digit OTP Box ] [ 🔊 ]│ │
                        │  [ Verify & Continue → ]  │ │
                        └─────────────┬─────────────┘ │
                                      │               │
                           (Verify Success)           │
                                      │               │
                                      ▼               │
                        ┌───────────────────────────┐ │
                        │   07. PROFILE SETUP       │ │
                        │  1. Full Name        [ 🔊 ]│ │
                        │  2. Craft Selection  [ 🔊 ]│ │
                        │  3. Workshop Location[ 🔊 ]│ │
                        │  4. SHG / Helper Code[ 🔊 ]│ │
                        │  [ Complete Setup → ]     │ │
                        └─────────────┬─────────────┘ │
                                      │               │
                             (Profile Complete)       │
                                      │               │
                                      ▼               ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              08. MAIN TABS DYNAMIC ROUTER                                 │
│                     (Switches Home Cockpit based on User Persona)                         │
└───────────────┬───────────────────────────┬───────────────────────────┬───────────────────┘
                │                           │                           │
         (Role = ARTISAN)             (Role = BUYER)             (Role = FACILITATOR)
                │                           │                           │
                ▼                           ▼                           ▼
┌───────────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│   09. ARTISAN STUDIO COCKPIT  │ │  10. BUYER DISCOVER HOME  │ │  11. SAHYOGI FIELD DESK   │
│ • Production Batches & Escrow │ │ • 6 Killer Features Hub   │ │ • 5,000-Unit Cluster Gauge│
│ • Payout Ledger (₹)           │ │ • Verified Master Artisans│ │ • SOS Quota Reallocation  │
│ • [ 📸 AI Smart Catalogue ]   │ │ • Diwali Heritage Deals   │ │ • QC Spec Audit Tool      │
└───────────────┬───────────────┘ └─────────────┬─────────────┘ └───────────────────────────┘
                │                               │
                ▼                               ▼
    [ AI 9-Step Studio Flow ]       [ Marketplace & Commerce ]
         (See Section 3)                 (See Section 4)
```

---

## 2. Phase 1: Onboarding, Language & Authentication (Boxes & Lines)

```
                      ┌───────────────────────────────────────────┐
                      │            01. SPLASH SCREEN              │
                      │       [ Clean KarigarX Artwork ]          │
                      │        (Duration: 3.0 Seconds)            │
                      └─────────────────────┬─────────────────────┘
                                            │
                                            ▼
                      ┌───────────────────────────────────────────┐
                      │         02. AUTH PHONE SCREEN             │
                      │  • Segmented Role Selector:               │
                      │    [ 🛍️ Buyer ] [ 🎨 Artisan ] [ 🤝 Helper ]│
                      │  • Mobile Input: [ 🇮🇳 +91 ] [Phone] [ 🔊 ] │
                      │  • Quick Demo:   [ ⚡ 1-Tap Demo ]        │
                      │  • Button:       [ Continue to Studio → ] │
                      └───┬───────────────────┬───────────────┬───┘
                          │                   │               │
                (Tap 🌐 Change Lang)     (Tap ℹ️ Tour)   (Enter Mobile)
                          │                   │               │
                          ▼                   ▼               ▼
┌───────────────────────────────┐ ┌────────────────────────┐ ┌───────────────────────────────┐
│ 03. LANGUAGE SELECTION SCREEN │ │ 04. ONBOARDING (TOUR)  │ │ 06. OTP VERIFICATION SCREEN  │
│ • English (Default)           │ │ Slide 1: Photo AI [ 🔊 ]│ │ • 6-Digit OTP Boxes         │
│ • Hindi (हिंदी)               │ │ Slide 2: Pricing  [ 🔊 ]│ │ • Voice Cue: [ 🔊 Audio ]   │
│ • 6 Regional Languages        │ │ Slide 3: Escrow   [ 🔊 ]│ │ • Button: [ Verify OTP → ]   │
└───────────────┬───────────────┘ └───────────┬────────────┘ └───────────────┬───────────────┘
                │                             │                              │
         (Select Language)             (Tap Get Started)              (Verify Success)
                │                             │                              │
                ▼                             ▼                              ▼
          (Back to Auth)          ┌────────────────────────┐ ┌───────────────────────────────┐
                                  │ 05. ROLE SELECTION     │ │ 07. PROFILE SETUP SCREEN      │
                                  │ • Master Artisan Card  │ │ • 1. Full Name          [ 🔊 ]│
                                  │ • Buyer / B2B Card     │ │ • 2. Craft Category     [ 🔊 ]│
                                  │ • Cluster Sahyogi Card │ │ • 3. Workshop District  [ 🔊 ]│
                                  └───────────┬────────────┘ │ • 4. SHG Code (Optional)[ 🔊 ]│
                                              │              │ • Button: [ Save Profile → ]  │
                                      (Select Persona)       └───────────────┬───────────────┘
                                              │                              │
                                              ▼                              ▼
                                      (Back to AuthPhone)             (Go to Main Tabs)
```

---

## 3. Phase 2: Master Artisan AI Studio & Publishing Flow (Boxes & Lines)

```
┌─────────────────────────────────────────────────────────────────┐
│                  09. ARTISAN STUDIO COCKPIT                     │
│   • Active Workshop Orders & ₹ Escrow Ledger                    │
│   • CTA Action: [ 📸 AI Smart Catalogue (Photo + Voice) ]       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  16. CAMERA PERMISSION SCREEN                   │
│   • Explain Studio Craft Capture Camera Access                  │
│   • Button: [ Allow Camera → ]                                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   17. CAMERA CAPTURE SCREEN                     │
│   • Live Viewfinder with Multi-angle Framing Grid               │
│   • Action: [ Snap Product Photo 📸 ]                           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   18. PHOTO REVIEW SCREEN                       │
│   • Preview Captured Image Quality                              │
│   • Actions: [ ↺ Retake ]  OR  [ ✨ Enhance Photo → ]           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 19. AI ENHANCEMENT SCREEN                       │
│   • AI Studio Background Cleaner (Studio White Backdrop)        │
│   • Natural Shadow Generator & Crisp Color Balancing            │
│   • Button: [ Continue to Voice Saathi → ]                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   20. MIC PERMISSION SCREEN                     │
│   • Explain Voice Saathi Conversational Microphone Usage        │
│   • Button: [ Allow Microphone → ]                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 21. VOICE DESCRIPTION SCREEN                    │
│   • One-Tap Audio Recording in Mother Tongue                    │
│   • Artisan explains craft story, clay/loom type, hours worked  │
│   • Action: [ ⏹️ Stop Recording & Synthesize ]                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  22. VOICE FOLLOW-UP SCREEN                     │
│   • AI Voice Saathi asks 2 clarifying questions in Hindi:       │
│     Q1: "कच्चे माल की लागत कितनी लगी?"                         │
│     Q2: "इस शिल्प को बनाने में कितने दिन लगे?"                  │
│   • Action: [ Complete Voice Interview → ]                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                23. CATALOG GENERATION SCREEN                    │
│   • AI Synthesis: Trilingual Title (English, Hindi, Regional)   │
│   • Automated Artisan Story & E-commerce Search Tags            │
│   • Button: [ View Fair Pricing Breakdown → ]                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              24. PRICING RECOMMENDATION SCREEN                  │
│   • Transparent Cost Formula: Raw Material + Labor + Packaging  │
│   • Fair Market Price Recommendation (95% Direct to Artisan)    │
│   • Button: [ Preview Live Listing → ]                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  25. PRODUCT PREVIEW SCREEN                     │
│   • Full Buyer-Facing Product Card                              │
│   • Digital Provenance Passport & Authentic GI Tag Seal         │
│   • Button: [ 🚀 Publish to Direct Marketplace ]                │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 26. PUBLISH SUCCESS SCREEN                      │
│   • Celebration Modal & Direct Product ID Code                  │
│   • Button: [ Return to Artisan Cockpit ✓ ]                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                     (Back to 09. Artisan Studio)
```

---

## 4. Phase 3: Buyer Marketplace & Commerce Journey (Boxes & Lines)

```
┌─────────────────────────────────────────────────────────────────┐
│                  10. BUYER DISCOVER MARKETPLACE                 │
│   • 6 Killer Features Interactive Showcase                      │
│   • Verified Master Artisan Collections & Diwali Craft Deals    │
│   • Tap Any Craft Card                                          │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
           (Tap Category)                  (Tap Product)
                 │                               │
                 ▼                               ▼
┌─────────────────────────────────┐ ┌─────────────────────────────┐
│      12. CATEGORIES SCREEN      │ │ 27. PRODUCT DETAIL SCREEN   │
│ • Handloom, Pottery, Terracotta │ │ • Multi-Angle Studio Photos │
│ • Folk Painting, Metal, Wood    │ │ • GI Provenance Passport    │
│ • Button: [ Select Category ]   │ │ • [ 🔊 Audio Story Player ] │
└────────────────┬────────────────┘ │ • [ Add to Cart / Buy Now ] │
                 │                  └──────────────┬──────────────┘
                 ▼                                 │
┌─────────────────────────────────┐                │
│       28. SEARCH SCREEN         │                │
│ • Query & Visual Heritage Filter│                │
│ • Tap Result                    │                │
└────────────────┬────────────────┘                │
                 │                                 │
                 └────────────────►────────────────┘
                                  │ (Tap Add to Cart)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      14. CART SCREEN                            │
│   • Cart Item List & Quantity Modifiers (+ / -)                 │
│   • Delivery Timeline Estimate (India Post)                     │
│   • 95% Direct Artisan Payout Transparency Badge                │
│   • Button: [ Proceed to Checkout → ]                           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    30. CHECKOUT SCREEN                          │
│   • Delivery Shipping Address & Pincode Verification            │
│   • Optional Corporate GSTIN Invoice Toggle                     │
│   • Button: [ Proceed to Safe Escrow Payment → ]                │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     31. PAYMENT SCREEN                          │
│   • UPI Intent (GPay, PhonePe, Paytm), Cards, NetBanking        │
│   • 100% Escrow Protection: Funds held safe until delivery      │
│   • Action: [ Pay ₹... Securely ]                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                32. ORDER CONFIRMATION SCREEN                    │
│   • Order Placed Animation & Receipt ID                         │
│   • Downloadable GI Provenance Certificate                      │
│   • Button: [ Track Live India Post Delivery → ]                │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  33. ORDER TRACKING SCREEN                      │
│   • 4 Milestone Stepper:                                        │
│     [1] Packed ➔ [2] India Post Pickup ➔ [3] Transit ➔ [4] Done │
│   • Button: [ Back to Marketplace ]                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 4: Cluster Sahyogi & B2B Bulk Deals (Boxes & Lines)

```
┌─────────────────────────────────────────────────────────────────┐
│             11. SAHYOGI VILLAGE CLUSTER FIELD DESK              │
│   • 5,000-Unit Cluster Quota Progress Bar                       │
│   • SOS Quota Reallocation: Transfer excess capacity to clusters│
│   • Quality Control (QC) Spec Inspection Audit Checklist        │
│   • 1-Tap Assisted Onboarding for non-smartphone artisans       │
└─────────────────────────────────────────────────────────────────┘

                               ▲
                               │ (B2B Bulk Linkage Tab)
                               │
┌─────────────────────────────────────────────────────────────────┐
│                  13. OPPORTUNITIES SCREEN (B2B)                 │
│   • Active Corporate Wholesale RFQs & Bulk Gifting Orders       │
│   • Tap Any B2B Tender                                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              34. OPPORTUNITY DETAIL SCREEN                      │
│   • Cluster Volume Requirement (e.g. 2,000 Terracotta Diyas)    │
│   • Delivery Deadlines, Target Price & Buyer Specifications     │
│   • Button: [ Submit Cluster Quote → ]                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               35. QUOTE NEGOTIATION SCREEN                      │
│   • Counter-Offer Unit Rate & Milestone Payment Schedule        │
│   • Action: [ Accept Terms & Generate Contract → ]              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  36. B2B CONTRACT SCREEN                        │
│   • Legally Binding Digital Escrow Purchase Contract            │
│   • Advance Deposit Escrow Locked Confirmation                  │
│   • Button: [ Confirm & Start Cluster Production ✓ ]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Complete Screen Inventory Index (37 Screens)

| # | Screen Name | File Path | Primary Action | Next Screen | Audio (`VoiceCueButton`) |
|:---:|:---|:---|:---|:---|:---:|
| **01** | `SplashScreen` | [`SplashScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/SplashScreen.tsx) | 3s logo reveal / tap | `AuthPhone` | ❌ |
| **02** | `AuthPhoneScreen` | [`AuthPhoneScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/AuthPhoneScreen.tsx) | Phone input / 1-Tap demo | `OtpVerification` / `MainTabs` | 🔊 Hindi mobile guidance |
| **03** | `LanguageSelectionScreen` | [`LanguageSelectionScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/LanguageSelectionScreen.tsx) | Pick from 8 Indian languages | `AuthPhone` | 🔊 Language preview |
| **04** | `OnboardingScreen` | [`OnboardingScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/OnboardingScreen.tsx) | 3 feature value slides | `RoleSelection` | 🔊 Hindi slide narration |
| **05** | `RoleSelectionScreen` | [`RoleSelectionScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/RoleSelectionScreen.tsx) | Pick Buyer / Artisan / Helper | `AuthPhone` | 🔊 Role description |
| **06** | `OtpVerificationScreen` | [`OtpVerificationScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/OtpVerificationScreen.tsx) | 6-digit OTP verification | `ProfileSetup` / `MainTabs` | 🔊 Hindi OTP guidance |
| **07** | `ProfileSetupScreen` | [`ProfileSetupScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/auth/ProfileSetupScreen.tsx) | Name, craft, location, SHG | `MainTabs` | 🔊 4 Hindi field prompts |
| **08** | `MainTabs` | [`AppNavigator.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/navigation/AppNavigator.tsx) | Bottom bar dynamic router | Dynamic Home Tab | ❌ |
| **09** | `HomeScreen` | [`HomeScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/HomeScreen.tsx) | Artisan studio cockpit | `CameraPermission` | ❌ |
| **10** | `MarketplaceHomeScreen`| [`MarketplaceHomeScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/MarketplaceHomeScreen.tsx) | Discover feed & killer features | `ProductDetail` | ❌ |
| **11** | `SahyogiHomeScreen` | [`SahyogiHomeScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/facilitator/SahyogiHomeScreen.tsx) | Cluster quotas & field ops | SOS Reallocation | ❌ |
| **12** | `CategoriesScreen` | [`CategoriesScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/CategoriesScreen.tsx) | Browse craft categories | `Search` | ❌ |
| **13** | `OpportunitiesScreen` | [`OpportunitiesScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/linkage/OpportunitiesScreen.tsx) | B2B bulk orders & tenders | `OpportunityDetail` | ❌ |
| **14** | `CartScreen` | [`CartScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/CartScreen.tsx) | Cart items & price total | `Checkout` | ❌ |
| **15** | `ProfileScreen` | [`ProfileScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/ProfileScreen.tsx) | Persona switcher & settings | Switch role / Logout | ❌ |
| **16** | `CameraPermissionScreen`| [`CameraPermissionScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/CameraPermissionScreen.tsx) | Request camera access | `CameraCapture` | ❌ |
| **17** | `CameraCaptureScreen` | [`CameraCaptureScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/CameraCaptureScreen.tsx) | Snap craft photo | `PhotoReview` | ❌ |
| **18** | `PhotoReviewScreen` | [`PhotoReviewScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/PhotoReviewScreen.tsx) | Confirm or retake angle | `AiEnhancement` | ❌ |
| **19** | `AiEnhancementScreen` | [`AiEnhancementScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/AiEnhancementScreen.tsx) | Background removal | `MicPermission` | ❌ |
| **20** | `MicPermissionScreen` | [`MicPermissionScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/MicPermissionScreen.tsx) | Request microphone access | `VoiceDescription` | ❌ |
| **21** | `VoiceDescriptionScreen`| [`VoiceDescriptionScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/VoiceDescriptionScreen.tsx) | Record voice story | `VoiceFollowUp` | ❌ |
| **22** | `VoiceFollowUpScreen` | [`VoiceFollowUpScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/VoiceFollowUpScreen.tsx) | Voice Saathi Q&A | `CatalogGeneration` | 🔊 AI speaks Hindi |
| **23** | `CatalogGenerationScreen`| [`CatalogGenerationScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/CatalogGenerationScreen.tsx) | Synthesis of listing | `PricingRecommendation` | ❌ |
| **24** | `PricingRecommendationScreen`| [`PricingRecommendationScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/PricingRecommendationScreen.tsx) | Cost breakdown formula | `ProductPreview` | ❌ |
| **25** | `ProductPreviewScreen` | [`ProductPreviewScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/ProductPreviewScreen.tsx) | Buyer card preview | `PublishSuccess` | ❌ |
| **26** | `PublishSuccessScreen` | [`PublishSuccessScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/product/PublishSuccessScreen.tsx) | Live listing celebration | `HomeScreen` | ❌ |
| **27** | `ProductDetailScreen` | [`ProductDetailScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/ProductDetailScreen.tsx) | GI passport & audio story | `Cart` | 🔊 Artisan story player |
| **28** | `SearchScreen` | [`SearchScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/SearchScreen.tsx) | Search heritage catalog | `ProductDetail` | ❌ |
| **29** | `WishlistScreen` | [`WishlistScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/WishlistScreen.tsx) | Saved items | `ProductDetail` | ❌ |
| **30** | `CheckoutScreen` | [`CheckoutScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/CheckoutScreen.tsx) | Address & delivery pincode | `Payment` | ❌ |
| **31** | `PaymentScreen` | [`PaymentScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/PaymentScreen.tsx) | UPI / Escrow payment | `OrderConfirmation` | ❌ |
| **32** | `OrderConfirmationScreen`| [`OrderConfirmationScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/OrderConfirmationScreen.tsx) | Order placed confirmation | `OrderTracking` | ❌ |
| **33** | `OrderTrackingScreen` | [`OrderTrackingScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/marketplace/OrderTrackingScreen.tsx) | India Post live tracker | `MainTabs` | ❌ |
| **34** | `OpportunityDetailScreen`| [`OpportunityDetailScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/linkage/OpportunityDetailScreen.tsx) | Volume specs & deadline | `QuoteNegotiation` | ❌ |
| **35** | `QuoteNegotiationScreen`| [`QuoteNegotiationScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/linkage/QuoteNegotiationScreen.tsx) | Counter-offer rate | `B2BContract` | ❌ |
| **36** | `B2BContractScreen` | [`B2BContractScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/linkage/B2BContractScreen.tsx) | Sign escrow agreement | `Opportunities` | ❌ |
| **37** | `CreateBulkRfqScreen` | [`CreateBulkRfqScreen.tsx`](file:///c:/Users/rauts/OneDrive/Desktop/karagir%20se/mobile/src/screens/linkage/CreateBulkRfqScreen.tsx) | Buyer custom RFQ | `Opportunities` | ❌ |
