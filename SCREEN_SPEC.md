# Kalakar Setu — Complete Screen Specification & Screen Inventory
## कला से बाज़ार तक | Production-Ready UI/UX Component & State Architecture

> **Document Type:** Screen Inventory & Detailed UI Specification  
> **Version:** 1.0 — Production-Ready Specification  
> **Date:** 2026-09-03  
> **Status:** 🟡 Awaiting Product Owner Review  
> **Sources:** [PRODUCT_DISCOVERY.md](file:///C:/Users/rauts/OneDrive/Desktop/karagir%20se/PRODUCT_DISCOVERY.md), [REQUIREMENTS.md](file:///C:/Users/rauts/OneDrive/Desktop/karagir%20se/REQUIREMENTS.md), & [USER_FLOWS.md](file:///C:/Users/rauts/OneDrive/Desktop/karagir%20se/USER_FLOWS.md)  
> **Constraint Checklist:** Zero omissions. No use of placeholder terms or abbreviations. Complete component, state, data, API, accessibility, and edge-case definitions for every screen.

---

# Global Architectural Standards

### 1. Typography & Script Hierarchy
- **Indic Display Fonts:** Noto Sans Devanagari, Noto Sans Bengali, Noto Sans Tamil, Noto Sans Telugu, Noto Sans Gujarati, Noto Sans Odia.
- **Latin & Numeral Display:** Inter Display (Medium, SemiBold, Bold) for UI labels; Outfit for marketing hero headings.
- **Font Scale Bounds:** Minimum body copy: 16sp. Primary touch button labels: 18sp Bold. Financial numerals: 24sp–32sp Bold. Supports Android system font scaling up to 200% without layout clipping.

### 2. Touch Target & Layout Tokens
- **Minimum Tap Target:** 56dp × 56dp for all interactive artisan elements (exceeds standard 48dp WCAG minimum to accommodate elderly and manual laborers with calloused hands).
- **Icon-to-Text Pairing:** Every functional button contains a distinct, high-contrast cultural visual icon paired with clear localized script.
- **Screen Margins:** 16dp horizontal gutter, 24dp vertical section spacing, 12dp card corner radius, 8dp elevation shadow.

### 3. Color Tokens
- **Forest Emerald (Primary Success & Money):** `#1E5631` (Contrast ratio 7.4:1 against white)
- **Deep Terracotta (Cultural Accent & CTA):** `#C04000` (Contrast ratio 5.1:1 against white)
- **Ochre Gold (Badges & Trust Highlights):** `#D4AF37`
- **Alert Crimson (Warnings & Rejections):** `#B00020`
- **Surface Neutral Light:** `#F8F9FA`
- **Surface Dark Card:** `#1A1C1E`

---

# Screen Taxonomy Index

### Section A: Artisan Mobile App (42 Screens)
- `ART-SCR-01`: Splash Screen
- `ART-SCR-02`: Language Selection Screen
- `ART-SCR-03`: Phone Number Registration Screen
- `ART-SCR-04`: SMS OTP Verification Screen
- `ART-SCR-05`: Voice Name & Profile Setup Screen
- `ART-SCR-06`: Location & District Verification Screen
- `ART-SCR-07`: Craft Category & Discipline Selection Screen
- `ART-SCR-08`: Facilitator & SHG Linkage Screen
- `ART-SCR-09`: Visual & Audio Welcome Tutorial Screen
- `ART-SCR-10`: Artisan Home Dashboard Screen
- `ART-SCR-11`: Profile & Multi-Account Switcher Screen
- `ART-SCR-12`: Aadhaar e-KYC Verification Screen
- `ART-SCR-13`: Bank Account & Payout Setup Screen
- `ART-SCR-14`: Camera Permission Primer Screen
- `ART-SCR-15`: Product Camera Capture & Smart Guide Screen
- `ART-SCR-16`: Photo Review & Multi-Angle Gallery Screen
- `ART-SCR-17`: AI Image Enhancement & Studio Comparison Screen
- `ART-SCR-18`: Microphone Permission Primer Screen
- `ART-SCR-19`: Voice Product Description Screen
- `ART-SCR-20`: AI Conversational Follow-Up Q&A Screen
- `ART-SCR-21`: AI Catalog Generation Progress Screen
- `ART-SCR-22`: Dynamic Fair Price Recommendation Screen
- `ART-SCR-23`: Listing Voice Readback & Audio Edit Screen
- `ART-SCR-24`: Publishing Success & Digital Craft Passport QR Screen
- `ART-SCR-25`: Printable QR Packaging Tag Generation Screen
- `ART-SCR-26`: Artisan Inventory / Product Management Screen
- `ART-SCR-27`: Product Edit & Stock Update Modal Screen
- `ART-SCR-28`: Orders List & Status Filter Screen
- `ART-SCR-29`: Order Detail & Voice Acceptance Screen
- `ART-SCR-30`: Packaging & Dispatch Guidance Screen
- `ART-SCR-31`: Postal Drop-Off / Courier Pickup Selection Screen
- `ART-SCR-32`: Dispatch Barcode & Shipping Label Display Screen
- `ART-SCR-33`: Earnings Dashboard & Digital Passbook (Khata) Screen
- `ART-SCR-34`: Payout Transaction History & Statement Screen
- `ART-SCR-35`: B2B Market Opportunities & Cluster Invitations Screen
- `ART-SCR-36`: Cluster Production Brief & Quota Acceptance Screen
- `ART-SCR-37`: Cluster Milestone Tracking & Photo Submission Screen
- `ART-SCR-38`: Voice-First Help & FAQ Screen
- `ART-SCR-39`: Live Support Connect & Call Request Screen
- `ART-SCR-40`: Artisan Settings & App Preferences Screen
- `ART-SCR-41`: Offline Storage & Sync Queue Status Screen
- `ART-SCR-42`: Universal Error & Connection Recovery Screen

### Section B: Buyer Web & Mobile Experience (27 Screens)
- `BUY-SCR-01`: Storefront Splash & Welcome Screen
- `BUY-SCR-02`: Buyer Home & Curated Collections Screen
- `BUY-SCR-03`: Multimodal Search & Auto-Suggestion Screen
- `BUY-SCR-04`: Voice Search Overlay Screen
- `BUY-SCR-05`: Visual Image Search Upload Screen
- `BUY-SCR-06`: Search Results & Product Listing Screen
- `BUY-SCR-07`: Search Filter & Facet Refinement Drawer Screen
- `BUY-SCR-08`: Interactive India Craft Map Discovery Screen
- `BUY-SCR-09`: Product Detail Page (PDP) & Photo Gallery Screen
- `BUY-SCR-10`: Artisan Voice Story Audio Player Overlay Screen
- `BUY-SCR-11`: Digital Craft Passport Web Verification Screen (Public Scan)
- `BUY-SCR-12`: Artisan Public Profile & Catalog Screen
- `BUY-SCR-13`: Buyer Wishlist Screen
- `BUY-SCR-14`: Shopping Cart & Multi-Artisan Package Screen
- `BUY-SCR-15`: Buyer Auth / Phone OTP Login Screen
- `BUY-SCR-16`: Shipping Address Selection & Entry Screen
- `BUY-SCR-17`: Pincode Serviceability & Delivery Estimate Modal Screen
- `BUY-SCR-18`: Order Checkout & Summary Review Screen
- `BUY-SCR-19`: Payment Method Selection Screen (UPI / Cards / NetBanking / COD)
- `BUY-SCR-20`: Payment Processing & Bank Redirect Screen
- `BUY-SCR-21`: Order Success & Receipt Confirmation Screen
- `BUY-SCR-22`: Buyer Orders List Screen
- `BUY-SCR-23`: Order Tracking & Postal Telemetry Timeline Screen
- `BUY-SCR-24`: Verified Purchase Rating & Review Submission Screen
- `BUY-SCR-25`: Dispute & Return Request Screen (Photo Proof Upload)
- `BUY-SCR-26`: B2B Wholesale Portal & Bulk RFQ Submission Screen
- `BUY-SCR-27`: Buyer Account Settings & Notification Preferences Screen

### Section C: Admin Web Operations Portal (18 Screens)
- `ADM-SCR-01`: Admin Login & Multi-Factor TOTP Screen
- `ADM-SCR-02`: Operations Command Center & Executive Dashboard Screen
- `ADM-SCR-03`: User & Facilitator Management Screen
- `ADM-SCR-04`: Facilitator Accreditation & Document Verification Screen
- `ADM-SCR-05`: Artisan KYC & Workshop Audit Verification Screen
- `ADM-SCR-06`: Artisan Health Scores & Performance Monitoring Screen
- `ADM-SCR-07`: Product Catalog Governance & Quality Audit Screen
- `ADM-SCR-08`: AI Content Moderation Queue & Flagged Items Screen
- `ADM-SCR-09`: Order Monitoring & Delayed Shipment Radar Screen
- `ADM-SCR-10`: Return Dispute Adjudication & Insurance Claims Screen
- `ADM-SCR-11`: B2B RFQ Review & Cluster Formation Orchestrator Screen
- `ADM-SCR-12`: Active Cluster Progress & Quality Checkpoint Screen
- `ADM-SCR-13`: Escrow Account Reconciliation & Financial Ledger Screen
- `ADM-SCR-14`: Batch IMPS Payout Sign-Off Screen
- `ADM-SCR-15`: Marketing Content Management System (CMS) & Curations Screen
- `ADM-SCR-16`: Platform Analytics, Heatmaps & Policy Export Screen
- `ADM-SCR-17`: Platform Settings & System Configuration Screen
- `ADM-SCR-18`: Admin Audit Logs & Staff Security Screen

---

# Detailed Screen Specifications

---

## Section A: Artisan Mobile App Screens

---

### `ART-SCR-01`: Splash Screen
- **Screen Name:** Artisan Splash & Bootstrap Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Initialize application environment, load offline SQLite database, verify cached authentication tokens, and determine routing destination.
- **Entry Point:** Device OS App Icon tap, Deep Link, or Push Notification tap.
- **Exit Points:**
  - Route to `ART-SCR-02` (Language Selection) if first-time launch.
  - Route to `ART-SCR-03` (Registration) if logged out or auth token expired.
  - Route to `ART-SCR-10` (Home Dashboard) if authenticated.
- **UI Components:**
  - Central Kalakar Setu cultural emblem graphic (SVG).
  - Bilingual branding lockup: *"Kalakar Setu — कला से बाज़ार तक"*.
  - Subtle rotating potter's wheel loading spinner at the bottom center.
  - Offline mode indicator pill (renders only if network interface is disconnected).
- **Actions:** None (Automatic bootstrap timer).
- **Navigation:** Auto-routes after maximum 1.5 seconds.
- **Data:**
  - Read `AppPreferences.is_first_launch` (Boolean).
  - Read `AuthTokenStore.jwt_token` (String, encrypted).
  - Read `DeviceNetworkState.is_connected` (Boolean).
- **API Requirements:** None (Local execution).
- **Loading State:** Native window background renders brand color `#1E5631` instantly to prevent white flash.
- **Empty State:** Not applicable.
- **Error State:** Corrupted local storage triggers database repair routine and forces fallback to `ART-SCR-02`.
- **Success State:** Transitions to target screen with cross-fade animation.
- **Permissions:** None.
- **Accessibility Requirements:** Content description for logo: *"Kalakar Setu application starting up"*.
- **Edge Cases:** Device storage full; handle graceful read-only database fallback.

---

### `ART-SCR-02`: Language Selection Screen
- **Screen Name:** Language Selection Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Allow low-literacy artisans to set their mother tongue using visual script cards and automatic voice narration.
- **Entry Point:** Initial launch from `ART-SCR-01` or Settings (`ART-SCR-40`).
- **Exit Points:** Route to `ART-SCR-03` (Phone Registration) or return to `ART-SCR-40`.
- **UI Components:**
  - Top header: Animated audio wave graphic with title: *"Kripya Apni Bhasha Chunein / Please Select Your Language"*.
  - Language Grid: 8 large touch cards (height 96dp) showing Indian flag icon, script name, and speaker icon:
    1. हिन्दी (Hindi)
    2. English
    3. বাংলা (Bengali)
    4. தமிழ் (Tamil)
    5. मराठी (Marathi)
    6. ગુજરાતી (Gujarati)
    7. ଓଡ଼ିଆ (Odia)
    8. తెలుగు (Telugu)
  - Bottom Floating Action Bar: Green confirmation button *"Aage Badhein / Continue"* (enabled after card selection).
- **Actions:**
  - Tap card: Highlights card in Forest Emerald (`#1E5631`), emits haptic pulse, plays audio pronunciation of language name.
  - Tap Speaker button on any card: Re-plays language audio prompt.
  - Tap Continue button: Saves language token and navigates.
- **Navigation:** Tapping Continue routes to `ART-SCR-03`.
- **Data:**
  - Output: `selected_locale_code` (e.g., `'hi_IN'`, `'bn_IN'`).
- **API Requirements:** None (Local static bundle assets).
- **Loading State:** Grid renders immediately from bundled assets.
- **Empty State:** Not applicable.
- **Error State:** Audio track missing falls back to synthetic Android TTS engine.
- **Success State:** Highlight ring animates around selected language card with audio confirmation: *"Aapne Hindi chuni hai."*
- **Permissions:** None.
- **Accessibility Requirements:** Each card has `accessibilityLabel` in its native language. Minimum touch target 96dp × 140dp.
- **Edge Cases:** User speaks dialect not present in top 8; fallback card at bottom reads *"Doosri Bhasha / Other Dialects"* mapping to Hindi base.

---

### `ART-SCR-03`: Phone Number Registration Screen
- **Screen Name:** Artisan Mobile Registration Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Capture 10-digit mobile number via tactile keypad or voice dictation.
- **Entry Point:** `ART-SCR-02`.
- **Exit Points:**
  - Route to `ART-SCR-04` (OTP Verification).
  - Back navigation to `ART-SCR-02`.
- **UI Components:**
  - Audio prompt banner with auto-playing voice: *"Apna 10 ankon ka mobile number darj karein."*
  - Top illustration of a mobile handset displaying an incoming SMS.
  - Phone Number Input Display: Prefix `+91` followed by 10 underlined digit slots.
  - Large Mic Button for voice dictation.
  - Built-in Custom Tactile Numeric Keypad (Numbers 0–9, Backspace, Clear).
  - Bottom Primary Button: *"OTP Bhejo / Send OTP"* (Disabled until 10 digits entered).
- **Actions:**
  - Keypad tap: Appends digit with tactile audio tone.
  - Keypad Backspace: Deletes last digit.
  - Tap Mic: Listens for number dictation via Speech-to-Text.
  - Tap "Send OTP": Dispatches API call and navigates.
- **Navigation:** Success routes to `ART-SCR-04`.
- **Data:**
  - Input: `phone_number` (String, 10 numeric characters).
- **API Requirements:** `POST /api/v1/auth/artisan/send-otp` (Payload: `{ "phone": "+91XXXXXXXXXX" }`).
- **Loading State:** Button displays spinner and text *"Code bhej rahe hain..."*; keypad disabled.
- **Empty State:** Digit slots render empty underline dashes with flashing green cursor.
- **Error State:**
  - Number < 10 digits: Display shakes horizontally, emits double low buzz, voice says: *"Pura number daalein."*
  - Server rate limit error: Alert banner displays *"Kripya 2 minute baad prayas karein."*
- **Success State:** Transition to `ART-SCR-04`.
- **Permissions:** None.
- **Accessibility Requirements:** Keypad buttons have explicit audio labels ("Ek", "Do", "Teen"). Screen reader announces full entered number on completion.
- **Edge Cases:** User pastes number with spaces or leading zero; input sanitizer strips non-numeric characters and leading `0` or `+91`.

---

### `ART-SCR-04`: SMS OTP Verification Screen
- **Screen Name:** Artisan OTP Verification Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Authenticate user identity via 6-digit one-time password with auto-retrieval support.
- **Entry Point:** `ART-SCR-03`.
- **Exit Points:**
  - Route to `ART-SCR-05` (Profile Setup) if new user.
  - Route to `ART-SCR-10` (Dashboard) if existing user.
  - Back navigation to `ART-SCR-03` to change phone number.
- **UI Components:**
  - Sub-header displaying masked phone number (`+91 XXXXX-XX421`) with pencil edit icon.
  - 6 individual boxed digit cells for OTP display.
  - Countdown timer circle displaying seconds remaining (Starts at 60s).
  - Audio prompt: *"Aapke phone par 6 ankon ka code aaya hai."*
  - Resend Actions Container (Active after countdown reaches zero):
    - Button A: *"SMS Dobara Bhejein / Resend SMS"*
    - Button B: *"Phone Call Par Code Paayein / Voice Call OTP"*
  - Numeric Keypad (identical to `ART-SCR-03`).
- **Actions:**
  - Auto-retrieval intercepts SMS via Google SMS Retriever API.
  - Manual keypad entry of 6 digits.
  - Tap Edit Phone Number: Returns to `ART-SCR-03`.
  - Tap Resend / Call: Dispatches resend API request.
- **Navigation:** Success routes to `ART-SCR-05` or `ART-SCR-10`.
- **Data:**
  - Input: `otp_code` (String, 6 digits), `session_id` (String).
  - Output: `access_token` (JWT), `refresh_token` (JWT), `is_new_user` (Boolean).
- **API Requirements:**
  - `POST /api/v1/auth/artisan/verify-otp` (Payload: `{ "phone": "...", "otp": "...", "session_id": "..." }`).
  - `POST /api/v1/auth/artisan/resend-otp` (Payload: `{ "session_id": "...", "channel": "SMS|VOICE" }`).
- **Loading State:** Auto-verifying triggers rolling spinner inside the OTP boxes.
- **Empty State:** Empty boxes with focus highlight on first digit.
- **Error State:**
  - Incorrect OTP: Boxes turn Crimson (`#B00020`), audio prompt says *"Code galat hai. Dobara daalein."* Remaining attempts displayed (e.g., *"2 prayas baaki"*).
  - Expired OTP: Prompts *"Code expire ho gaya hai. Naya code mangwayein."*
- **Success State:** Green checkmark overlay animates across the 6 boxes with success bell chime.
- **Permissions:** `android.permission.RECEIVE_SMS` (Optional, using SMS Retriever API without runtime permission prompt).
- **Accessibility Requirements:** Screen reader announces: *"Enter 6-digit code received on mobile"*. Focus automatically advances through each digit box.
- **Edge Cases:** Network disconnects after SMS arrives; user enters code, app queues token validation and executes immediately when socket reopens.

---

### `ART-SCR-05`: Voice Name & Profile Setup Screen
- **Screen Name:** Voice-Guided Name & Identity Setup Screen
- **Role:** Artisan
- **Purpose:** Collect artisan full name and optional photo using voice input.
- **Entry Point:** `ART-SCR-04` (New registration).
- **Exit Points:** Route to `ART-SCR-06` (Location Verification).
- **UI Components:**
  - Circular avatar placeholder with camera badge icon (*"Apni photo lagayein"*).
  - Centered pulsating microphone button with audio waves.
  - Large Name Display Box showing transcribed Hindi / local script and English translation.
  - Two confirmation buttons: Green Thumbs Up (👍 *"Haan, Sahi Hai"*) and Red Thumbs Down (👎 *"Dobara Boliye"*).
  - Small text keyboard toggle icon at top right for literate family members.
- **Actions:**
  - Tap Avatar: Opens camera/gallery bottom sheet to capture profile photo.
  - Tap Mic: Starts voice recording; speaks name.
  - Tap Thumbs Up: Confirms captured name and navigates.
  - Tap Thumbs Down: Clears transcription and prompts for re-recording.
- **Navigation:** Routes to `ART-SCR-06`.
- **Data:**
  - Output: `artisan_name` (String), `profile_photo_url` (String, optional).
- **API Requirements:**
  - `POST /api/v1/ai/voice/transcribe-name` (Multipart audio file).
  - `PUT /api/v1/artisan/profile/basic` (Payload: `{ "name": "...", "photo_asset_id": "..." }`).
- **Loading State:** Waveform pulses while processing Speech-to-Text with text *"Naam sun rahe hain..."*.
- **Empty State:** Text box shows placeholder: *"Yahan aapka naam dikhega"*.
- **Error State:** Speech unintelligible; voice says *"Awaaz saaf nahi aayi. Kripya apna naam dobara bolein."*
- **Success State:** Name appears in bold font; audio confirms: *"[Name] — kya yeh sahi hai?"*.
- **Permissions:** `android.permission.RECORD_AUDIO`, `android.permission.CAMERA`.
- **Accessibility Requirements:** High-contrast confirmation icons (80dp diameter). Audio readback of captured name.
- **Edge Cases:** Artisan speaks full sentence (*"Mera naam Sunita Devi hai gaon Madhubani"*); NLU entity extractor strips conversational filler and extracts only `"Sunita Devi"`.

---

### `ART-SCR-06`: Location & District Verification Screen
- **Screen Name:** Artisan Location & Cluster Verification Screen
- **Role:** Artisan
- **Purpose:** Detect geographic craft cluster and verify state and district for logistics and GI tag eligibility.
- **Entry Point:** `ART-SCR-05`.
- **Exit Points:** Route to `ART-SCR-07` (Craft Category Selection).
- **UI Components:**
  - Graphic map pin illustration over regional state map.
  - Audio prompt: *"Aapka sthan jaanch rahe hain..."*.
  - Detected Location Card:
    - District Name (e.g., *"Madhubani"*).
    - State Name (e.g., *"Bihar"*).
    - Pincode (e.g., *"847211"*).
  - Manual Edit Button: *"Sthan Badlein / Change Location"* (Opens voice-enabled district search).
  - Large Green Confirmation Button: *"Sthan Sahi Hai / Confirm Location"*.
- **Actions:**
  - Tap Confirm: Commits location data.
  - Tap Change: Opens state and district dropdown with voice search.
- **Navigation:** Routes to `ART-SCR-07`.
- **Data:**
  - Output: `latitude` (Float), `longitude` (Float), `district` (String), `state` (String), `pincode` (String).
- **API Requirements:**
  - `POST /api/v1/geo/reverse-geocode` (Payload: `{ "lat": 26.35, "lng": 86.07 }`).
  - `PUT /api/v1/artisan/profile/location`.
- **Loading State:** Shimmer animation over district and state cards while GPS resolves.
- **Empty State:** If GPS denied, renders simple state grid with large state icons.
- **Error State:** GPS unavailable; voice prompt asks: *"Apne rajya aur zile ka naam bolein."*
- **Success State:** Map pin drops onto the visual state card with green success checkmark.
- **Permissions:** `android.permission.ACCESS_FINE_LOCATION`, `android.permission.ACCESS_COARSE_LOCATION`.
- **Accessibility Requirements:** Screen reader reads: *"Detected location: Madhubani district, Bihar. Tap bottom button to confirm."*
- **Edge Cases:** Artisan lives in remote forest area without cellular tower triangulation; app caches GPS lat/long and resolves district name via bundled offline district boundary GeoJSON polygons.

---

### `ART-SCR-07`: Craft Category & Discipline Selection Screen
- **Screen Name:** Craft Discipline Selection Screen
- **Role:** Artisan
- **Purpose:** Select primary and secondary craft traditions to configure AI cataloging models and question taxonomies.
- **Entry Point:** `ART-SCR-06`.
- **Exit Points:** Route to `ART-SCR-08` (Facilitator Linkage).
- **UI Components:**
  - Header: Audio prompt *"Aap kis cheez ke kalakar hain? Apni kala chunein."*
  - Visual Craft Grid: 6 oversized cards with authentic photos and icons:
    - 🧵 Handloom & Weaving (बुनाई और हथकरघा)
    - 🏺 Clay, Terracotta & Pottery (मिट्टी शिल्प)
    - 🎨 Traditional Painting (पारंपरिक चित्रकला - मधुबनी, वारली, पट्टचित्र)
    - 🪵 Woodcraft & Carving (काष्ठ शिल्प)
    - 💍 Metalcraft & Jewelry (धातु शिल्प व आभूषण)
    - 🧺 Bamboo, Cane & Natural Fiber (बांस व प्राकृतिक रेशा)
  - Bottom Bar: *"Aage Badhein / Proceed"* button (Active upon selection).
- **Actions:**
  - Tap Craft Card: Card elevates, border changes to Forest Emerald, audio clip plays naming the craft and common items.
  - Tap Proceed: Saves craft classification.
- **Navigation:** Routes to `ART-SCR-08`.
- **Data:**
  - Output: `primary_craft_code` (String, e.g., `'PAINTING_MITHILA'`), `craft_subcategories` (Array of Strings).
- **API Requirements:** `PUT /api/v1/artisan/profile/craft`.
- **Loading State:** Cards load cached high-res vector craft icons instantly.
- **Empty State:** Not applicable.
- **Error State:** Selection missing; tapping Proceed vibrates button and voice reminds: *"Kripya ek kala chunein."*
- **Success State:** Selected card scales up slightly with checkmark badge.
- **Permissions:** None.
- **Accessibility Requirements:** Full audio description for each card. Minimum card dimensions: 150dp × 150dp.
- **Edge Cases:** Artisan practices rare craft not listed; bottom tile *"Doosri Kala / Other Craft"* opens voice recorder to state custom craft name.

---

### `ART-SCR-08`: Facilitator & SHG Linkage Screen
- **Screen Name:** Facilitator & Self-Help Group Linkage Screen
- **Role:** Artisan
- **Purpose:** Link artisan account to a local NGO field agent, CSC operator, or SHG cluster leader.
- **Entry Point:** `ART-SCR-07`.
- **Exit Points:** Route to `ART-SCR-09` (Welcome Tutorial) or `ART-SCR-10` (Dashboard).
- **UI Components:**
  - Informational illustration of an artisan shaking hands with a community facilitator.
  - Audio prompt: *"Kya aap kisi Sahayak ya Swayam Sahayata Samuh (SHG) se jude hain?"*
  - Option 1 (Primary): Large QR Scanner card: *"Sahayak ka QR Code Scan Karein"*.
  - Option 2 (Secondary): Phone number entry card: *"Sahayak ka Mobile Number Daalein"*.
  - Option 3 (Tertiary): Large Outline Button: *"Main Akele Kaam Karta Hoon (Skip)"*.
- **Actions:**
  - Tap "Scan QR Code": Launches integrated camera scanner.
  - Tap "Skip": Bypasses linkage without penalty.
  - Input Facilitator Number: Validates facilitator profile.
- **Navigation:** Routes to `ART-SCR-09`.
- **Data:**
  - Output: `facilitator_id` (String, nullable), `shg_group_id` (String, nullable).
- **API Requirements:** `POST /api/v1/artisan/link-facilitator` (Payload: `{ "facilitator_code": "..." }`).
- **Loading State:** Camera QR scanner displays scanning laser line animation.
- **Empty State:** Not applicable.
- **Error State:** Invalid QR scanned; voice says: *"Yeh QR code kisi sahayak ka nahi hai. Skip karein ya dobara scan karein."*
- **Success State:** Verified Facilitator badge appears with facilitator photo, name, and NGO organization name.
- **Permissions:** `android.permission.CAMERA` (if QR scan chosen).
- **Accessibility Requirements:** Audio guidance explaining what a facilitator is and confirming that skipping is completely safe.
- **Edge Cases:** Facilitator is not registered yet; artisan enters facilitator phone number, app creates pending referral ticket in admin queue.

---

### `ART-SCR-09`: Visual & Audio Welcome Tutorial Screen
- **Screen Name:** Artisan 3-Step Interactive Tutorial Screen
- **Role:** Artisan
- **Purpose:** Teach low-literacy artisans the 3 core app actions (Photo, Voice, Payout) via animated micro-videos and audio.
- **Entry Point:** `ART-SCR-08`.
- **Exit Points:** Route to `ART-SCR-10` (Dashboard).
- **UI Components:**
  - 3 Swipeable Carousel Cards with auto-playing audio narration:
    - Card 1: 📸 Animated phone taking a photo of a handloom cloth with background disappearing into clean white. Audio: *"1. Photo kheechein — app apne aap background saaf kar dega."*
    - Card 2: 🎤 Animated microphone with sound waves. Audio: *"2. Apni bhasha mein bolein — AI listing aur sahi daam bana dega."*
    - Card 3: 💰 Animated rupee coin falling into a bank passbook. Audio: *"3. Order aane par saman bhejein aur seedhe bank mein paise paayein."*
  - Dot page indicator (1 of 3, 2 of 3, 3 of 3).
  - Bottom Fixed Button: *"Shuru Karein / Get Started"* (🚀).
- **Actions:**
  - Swipe left/right: Changes card and plays corresponding audio prompt.
  - Tap "Get Started": Sets tutorial complete flag and navigates to Dashboard.
- **Navigation:** Routes to `ART-SCR-10`.
- **Data:**
  - Update: `AppPreferences.tutorial_completed = true`.
- **API Requirements:** None (Local vector animations and audio assets).
- **Loading State:** Instant load.
- **Empty State:** Not applicable.
- **Error State:** Swipe gesture missed; prominent *"Aage"* arrow button provides single-tap navigation alternative.
- **Success State:** Confetti particle overlay on final card.
- **Permissions:** None.
- **Accessibility Requirements:** Auto-advancing audio with pause/replay controls.
- **Edge Cases:** User exits app during tutorial; upon restart, tutorial is retained until explicitly completed.

---

### `ART-SCR-10`: Artisan Home Dashboard Screen
- **Screen Name:** Artisan Main Operations Dashboard
- **Role:** Artisan
- **Purpose:** Primary application home delivering full situational awareness, pending order alerts, earnings summaries, and 1-tap listing creation.
- **Entry Point:** App launch (authenticated) or completion of onboarding.
- **Exit Points:**
  - Bottom Tab: `ART-SCR-28` (Orders).
  - Bottom Tab: `ART-SCR-26` (Inventory).
  - Bottom Tab: `ART-SCR-33` (Earnings).
  - Bottom Tab: `ART-SCR-11` (Profile).
  - Center Pulsing Action Button: `ART-SCR-14` / `ART-SCR-15` (Camera Product Capture).
  - Floating Mic Assistant: Voice command overlay.
- **UI Components:**
  - Top Bar: Artisan profile avatar, Name, Green Verified Artisan Badge, Active Language pill.
  - High-Priority Action Card (Conditional): Renders if pending orders exist:
    - Bright Amber banner: *"📦 1 Naya Order Aaya Hai! (₹2,200) — Dekhne ke liye yahan chuyein"*.
  - Monthly Earnings Hero Card:
    - Large text: *"Is Mahine ki Kamai: ₹8,400"*.
    - Trend arrow: *"↑ 20% pichle mahine se zyada"*.
    - Speaker icon: Tapping reads earnings aloud.
  - Quick Action Matrix (4 large tactile tiles):
    - ➕ **Naya Product Daalein** (Giant Center Button with pulsing ring)
    - 📦 **Mere Orders** (With badge counter `[1]`)
    - 💰 **Mera Khata (Earnings)**
    - 🤝 **Bada Bazaar (B2B Bulk Opportunities)**
  - Recent Listings Horizontal Carousel: Shows last 3 published products with live status dots.
  - Floating Mic Assistant at bottom right.
- **Actions:**
  - Tap Center Camera Button: Directly opens Product Capture (`ART-SCR-15`).
  - Tap Pending Order Banner: Opens Order Detail (`ART-SCR-29`).
  - Tap Floating Mic: Prompts *"Boliye, kya madad chahiye?"* and accepts voice command.
- **Navigation:** Deep-links to corresponding module screens.
- **Data:**
  - `artisan_profile` (Object), `monthly_earnings` (Currency), `pending_orders_count` (Integer), `recent_products` (Array).
- **API Requirements:** `GET /api/v1/artisan/dashboard/summary`.
- **Loading State:** Skeleton shimmer shapes for earnings card and product carousel.
- **Empty State:** New artisan with zero listings: Replaces recent listings with animated illustration of an empty market stall and voice prompt: *"Aapki dukan khali hai — pehla product jodne ke liye bada camera button dabayein."*
- **Error State:** Network offline: Renders offline banner at top, displays cached data from local SQLite database with timestamp: *"Pichla update: Aaj subah 10 baje"*.
- **Success State:** Dynamic greeting: *"Namaste Sunita ji! Aaj aapki dukan par 40 naye grahak aaye."*
- **Permissions:** None (Inherited).
- **Accessibility Requirements:** All cards have descriptive accessibility labels. Ambient audio greeting can be toggled in settings.
- **Edge Cases:** Device screen size is small (e.g., 4.5-inch Android Go); layout collapses gracefully into a scrollable single column without clipping the center camera button.

---

### `ART-SCR-11`: Profile & Multi-Account Switcher Screen
- **Screen Name:** Artisan Profile & Shared-Device Switcher Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Manage personal details, craft certificates, verification status, and switch between multiple artisan profiles on a shared household phone.
- **Entry Point:** Bottom navigation tab *"Mera Profile"* on `ART-SCR-10`.
- **Exit Points:**
  - Route to `ART-SCR-12` (Aadhaar KYC).
  - Route to `ART-SCR-13` (Bank Setup).
  - Route to `ART-SCR-40` (Settings).
  - Switch active user session.
- **UI Components:**
  - Artisan Profile Header: Photo, Full Name, Verified Status Badge, Member Since Date, Master Craft Category.
  - Verification Callout Card (If unverified): Yellow shield with CTA: *"Get Verified Badge & Unlock Bank Payouts"*.
  - Bank Account Card: Displays masked bank account number and bank logo with status *"Verified"*.
  - Shared Household Profiles Section (*"Is phone ke anya kalakar"*):
    - Horizontal avatar list of profiles linked to device.
    - Button: *"➕ Naya Kalakar Jodein (Add Another Artisan)"*.
  - App Language Selector row.
  - Log Out / Switch User tactile button.
- **Actions:**
  - Tap Profile Avatar to switch account: Prompts for 4-digit PIN or biometric thumbprint.
  - Tap "Add Another Artisan": Initiates Flow A2 for new phone number.
  - Tap "Get Verified Badge": Routes to `ART-SCR-12`.
- **Navigation:** Routes to KYC, Bank Setup, or executes profile switch.
- **Data:**
  - Profile metadata, KYC tier, list of cached device profile tokens.
- **API Requirements:**
  - `GET /api/v1/artisan/profile/details`.
  - `POST /api/v1/auth/switch-profile` (Payload: `{ "target_artisan_id": "...", "pin": "..." }`).
- **Loading State:** Shimmer animation over profile cards.
- **Empty State:** Switcher section shows single profile with explanation: *"Aapke parivar ke anya kalakar bhi is phone se bech sakte hain."*
- **Error State:** Incorrect profile switch PIN; vibrates and plays audio: *"PIN galat hai."*
- **Success State:** Instant profile context switch; dashboard updates to selected artisan's products and orders.
- **Permissions:** `android.permission.USE_BIOMETRIC`.
- **Accessibility Requirements:** PIN keypad buttons sized 64dp × 64dp with audible click feedback.
- **Edge Cases:** 10 profile limit reached on device; alert explains: *"Is phone par adhiktam 10 profile jud sakte hain."*

---

### `ART-SCR-12`: Aadhaar e-KYC Verification Screen
- **Screen Name:** Aadhaar e-KYC Verification Screen
- **Role:** Artisan
- **Purpose:** Complete identity verification via DigiLocker / UIDAI OTP to enable payouts and grant Verified Artisan trust badge without storing raw Aadhaar.
- **Entry Point:** `ART-SCR-11` or triggered automatically during first payout attempt (`ART-SCR-33`).
- **Exit Points:** Return to `ART-SCR-11` or `ART-SCR-33`.
- **UI Components:**
  - Official Government DigiLocker / MeitY authorized partner badge lockup.
  - Audio prompt: *"Apna 12 ankon ka Aadhaar number darj karein. Raw Aadhaar store nahi kiya jayega."*
  - 12-digit Aadhaar input field with automatic 4-digit hyphen grouping (`XXXX-XXXX-XXXX`).
  - Custom tactile numeric keypad.
  - Privacy Guarantee Pill: *"🔒 Bharat Sarkar ke niyam anusar aapka Aadhaar number surakshit hai."*
  - Primary CTA: *"Aadhaar OTP Bhejo / Request OTP"*.
- **Actions:**
  - Enter Aadhaar digits.
  - Tap "Request OTP": Calls UIDAI gateway.
  - Sub-view opens: 6-digit Aadhaar OTP input field.
  - Enter OTP and tap *"Pehchaan Satyaapit Karein / Verify Identity"*.
- **Navigation:** Returns to calling screen upon success.
- **Data:**
  - Input: `aadhaar_number` (String, 12 digits, transient), `aadhaar_otp` (String, 6 digits).
  - Output: `kyc_status: VERIFIED`, `verification_token` (Encrypted string).
- **API Requirements:**
  - `POST /api/v1/kyc/aadhaar/initiate` (Payload: `{ "aadhaar_number": "..." }`).
  - `POST /api/v1/kyc/aadhaar/confirm` (Payload: `{ "txn_id": "...", "otp": "..." }`).
- **Loading State:** Shield animation with progress bar: *"Sarkar ke server se jaanch ho rahi hai..."*.
- **Empty State:** Keypad ready for input.
- **Error State:**
  - Aadhaar number invalid checksum: Keypad highlights red, voice says: *"Aadhaar number galat hai."*
  - UIDAI server timeout: Offers fallback to upload manual Voter ID / PAN photo for 24-hour admin review.
- **Success State:** Verified Gold Shield pops up with green ribbons; audio announces: *"Badhai ho! Aapka account satyaapit ho gaya hai."*
- **Permissions:** None.
- **Accessibility Requirements:** Large 20sp bold numerals. High-contrast colors.
- **Edge Cases:** Artisan's Aadhaar is linked to old mobile number they no longer hold; app presents *"Aadhaar card ki photo upload karein"* manual path.

---

### `ART-SCR-13`: Bank Account & Payout Setup Screen
- **Screen Name:** Bank Account & Direct Payout Configuration Screen
- **Role:** Artisan
- **Purpose:** Securely link artisan bank savings account or Pradhan Mantri Jan Dhan Account for automated sales earnings deposits.
- **Entry Point:** `ART-SCR-11` or Payout flow (`ART-SCR-33`).
- **Exit Points:** Return to calling screen.
- **UI Components:**
  - Illustration of a bank passbook showing where Account Number and IFSC Code are printed.
  - Audio prompt: *"Apni bank passbook dekh kar account number aur IFSC code bharein."*
  - Input Field 1: Bank Account Number (Numeric).
  - Input Field 2: Confirm Bank Account Number (Numeric).
  - Input Field 3: IFSC Code (Alphanumeric with branch auto-resolver).
  - Resolved Bank Card: Shows verified Bank Name (e.g., *"State Bank of India"*) and Branch (e.g., *"Madhubani Main Branch"*).
  - Primary CTA: *"Khata Verify Karein / Save Bank Details"*.
- **Actions:**
  - Enter Account Number and IFSC.
  - System executes ₹1 penny-drop validation via Cashfree/Razorpay Payouts.
- **Navigation:** Returns with verified bank token.
- **Data:**
  - Input: `account_number`, `ifsc_code`, `beneficiary_name`.
  - Output: `bank_account_token`, `is_name_match: Boolean`.
- **API Requirements:** `POST /api/v1/artisan/bank/penny-drop-verify`.
- **Loading State:** Spinner displays: *"Bank se ₹1 bhejkar jaanch kar rahe hain..."*.
- **Empty State:** Form empty with camera button allowing artisan to take photo of passbook first page for OCR auto-fill.
- **Error State:**
  - Name on bank account does not match artisan name: Displays comparison card and prompts manual review ticket.
  - Invalid IFSC code: Red alert explains: *"IFSC code galat hai. Passbook par check karein."*
- **Success State:** Bank card turns green with verified checkmark and voice says: *"Aapka bank khata kamai paane ke liye jud gaya hai."*
- **Permissions:** `android.permission.CAMERA` (if passbook OCR option selected).
- **Accessibility Requirements:** Audio readback of resolved bank name and branch.
- **Edge Cases:** Rural Gramin Bank IFSC changed due to bank merger; system maintains alias database of merged Indian rural banks.

---

### `ART-SCR-14`: Camera Permission Primer Screen
- **Screen Name:** Camera Permission Contextual Primer Screen
- **Role:** Artisan
- **Purpose:** Explain in simple regional voice why camera access is essential before showing OS system permission dialog.
- **Entry Point:** Tapping central camera button on `ART-SCR-10` when permission not granted.
- **Exit Points:**
  - Route to `ART-SCR-15` (Camera Capture) if granted.
  - Return to `ART-SCR-10` if denied.
- **UI Components:**
  - Full-screen friendly visual of a camera lens with flowers and craft items.
  - Audio prompt: *"Product ki photo lene ke liye camera ki anumati dena zaroori hai."*
  - Big Green Button: *"Anumati Dein / Allow Camera"* (📷).
  - Sub-button: *"Abhi Nahi / Not Now"*.
- **Actions:**
  - Tap Allow: Triggers Android native OS permission popup.
- **Navigation:** On OS grant, proceeds to `ART-SCR-15`.
- **Data:** None.
- **API Requirements:** None.
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** User permanently denied permission previously; button text changes to *"Phone Settings Kholein"* and deep-links to OS App Info settings.
- **Success State:** Advances to `ART-SCR-15`.
- **Permissions:** `android.permission.CAMERA`.
- **Accessibility Requirements:** Audio plays automatically upon screen opening.
- **Edge Cases:** Device has broken back camera; detects available front camera and notifies user.

---

### `ART-SCR-15`: Product Camera Capture & Smart Guide Screen
- **Screen Name:** Smart Product Camera Capture Screen
- **Role:** Artisan
- **Purpose:** Assist artisan in capturing clear, well-framed, well-lit craft product photos using real-time ML vision feedback.
- **Entry Point:** `ART-SCR-14` or direct camera launch.
- **Exit Points:**
  - Route to `ART-SCR-16` (Photo Review Gallery).
  - Close button back to `ART-SCR-10`.
- **UI Components:**
  - Custom Full-Screen Camera Viewport.
  - Golden Centered Rectangular Guide Frame (Turns Green when lighting and shake thresholds pass).
  - Real-Time Guidance Pill (Changes dynamically):
    - ⚠️ *"Thodi aur roshni chahiye (Too Dark)"*
    - ⚠️ *"Phone sthir rakhein (Holding unsteady)"*
    - ✅ *"Bilkul sahi! Photo kheechein (Perfect frame)"*
  - Flash / Torch Toggle Button (Top right).
  - Shutter Button: Large 80dp circular green button with camera icon.
  - Gallery Import Icon (Bottom left) for existing photos.
  - Photo Count Thumbnail Badge (Bottom right): Shows current count (e.g., `0/4`).
- **Actions:**
  - Tap Shutter: Captures full-resolution image.
  - Tap Torch: Toggles continuous LED fill-light for dark rooms.
  - Tap Gallery: Opens file picker.
- **Navigation:** Capturing at least 1 photo activates proceed button to `ART-SCR-16`.
- **Data:**
  - Output: Image file written to cache directory `file:///.../prod_raw_01.jpg`.
- **API Requirements:** None (On-device CameraX and ML vision analyzer).
- **Loading State:** Camera stream active at 30fps.
- **Empty State:** Viewfinder live.
- **Error State:** Camera hardware failure; shows error card: *"Camera shuru nahi ho saka. Phone restart karein."*
- **Success State:** Shutter animation with audio click; captured photo slides into bottom thumbnail tray.
- **Permissions:** `android.permission.CAMERA`.
- **Accessibility Requirements:** Spoken feedback every 3 seconds if framing is poor. Haptic tick on shutter press.
- **Edge Cases:** Artisan photographs a human face instead of craft; on-device object detector prompts: *"Yeh kisi vyakti ki photo lag rahi hai. Kripya apne banaye saman ki photo lein."*

---

### `ART-SCR-16`: Photo Review & Multi-Angle Gallery Screen
- **Screen Name:** Captured Photos Multi-Angle Review Screen
- **Role:** Artisan
- **Purpose:** Review captured photos (1 to 4 angles), delete blurry shots, or take additional detail/texture photos.
- **Entry Point:** `ART-SCR-15`.
- **Exit Points:**
  - Route to `ART-SCR-17` (AI Enhancement).
  - Retake back to `ART-SCR-15`.
- **UI Components:**
  - Primary Large Photo Preview (Swipeable carousel).
  - Thumbnail strip of all 4 photo slots (Slot 1: Front, Slot 2: Close-up texture, Slot 3: Side/Back, Slot 4: In-hand scale).
  - Quality Indicator Badge per photo: Green Checkmark (*"Quality Achhi Hai"*) or Yellow Warning (*"Thodi Dhundhli"*).
  - Retake Single Photo Button (Trash icon).
  - Add Angle Button: *"Ek aur angle se photo lein (+)"*.
  - Primary CTA Button: *"Photo Sundar Banayein / Enhance Photos"* (✨).
- **Actions:**
  - Tap Trash: Deletes photo from array.
  - Tap Add: Reopens `ART-SCR-15` for slot N.
  - Tap Enhance: Advances to `ART-SCR-17`.
- **Navigation:** Routes to `ART-SCR-17`.
- **Data:**
  - Array of local file URIs: `[ "file:///.../raw_1.jpg", "file:///.../raw_2.jpg" ]`.
- **API Requirements:** None (Local review).
- **Loading State:** High-res thumbnail rendering.
- **Empty State:** Cannot be empty (at least 1 photo required).
- **Error State:** Storage full when saving temporary files; warns user to free space.
- **Success State:** Previews rendered sharply.
- **Permissions:** None.
- **Accessibility Requirements:** Audio prompt explains: *"Aapki 2 photo li gayi hain. Aage badhne ke liye hare button ko dabayein."*
- **Edge Cases:** User takes only 1 photo; app shows gentle recommendation: *"Ek aur photo nazdeek se lene se grahak zyada vishwas karte hain."* User can still proceed with 1 photo.

---

### `ART-SCR-17`: AI Image Enhancement & Studio Comparison Screen
- **Screen Name:** AI Image Studio Enhancement Screen
- **Role:** Artisan
- **Purpose:** Present side-by-side interactive comparison between raw photo and AI-enhanced studio image (clean white background, calibrated colors, realistic drop shadow).
- **Entry Point:** `ART-SCR-16`.
- **Exit Points:** Route to `ART-SCR-18` (Mic Primer) or `ART-SCR-19` (Voice Description).
- **UI Components:**
  - Split-Screen Interactive Slider Widget:
    - Drag left to reveal original cluttered workshop background.
    - Drag right to reveal pristine e-commerce studio finish with soft shadow.
  - Audio explanation: *"Dekhiye! Background saaf kar diya gaya hai aur rang nikhar gaye hain."*
  - Toggle Button: ✨ *"Enhanced Photo Chunein"* (Default selected) vs. 📷 *"Original Photo Chunein"*.
  - Primary Green Button: *"Yeh Photo Sahi Hai / Accept & Continue"*.
- **Actions:**
  - Drag slider handle to compare before/after.
  - Toggle between Enhanced and Original.
  - Tap Accept: Commits enhanced asset and navigates.
- **Navigation:** Routes to `ART-SCR-19` (or `ART-SCR-18` if mic permission needed).
- **Data:**
  - Input: `raw_image_url`.
  - Output: `enhanced_image_url`, `enhancement_applied: Boolean`.
- **API Requirements:** `POST /api/v1/ai/vision/enhance-product-photo` (Multipart image upload).
- **Loading State:** Shimmering mandala animation with progress text: *"AI photo ko studio jaisa bana raha hai... (15 second)"*.
- **Empty State:** Not applicable.
- **Error State:** Network failure during cloud enhancement; app falls back seamlessly to on-device color/contrast enhanced photo and notifies: *"Internet kamzor tha, basic photo ready hai."*
- **Success State:** High-resolution enhanced studio rendering ready.
- **Permissions:** None.
- **Accessibility Requirements:** Slider has discrete accessibility actions: *"View original"* and *"View enhanced"*.
- **Edge Cases:** Craft has intentional rough fringe threads (e.g., raw silk border); segmentation algorithm uses alpha matting to preserve individual loose fibers without harsh clipping.

---

### `ART-SCR-18`: Microphone Permission Primer Screen
- **Screen Name:** Microphone Permission Contextual Primer Screen
- **Role:** Artisan
- **Purpose:** Explain in regional language why voice recording is needed before launching Android OS microphone permission dialog.
- **Entry Point:** `ART-SCR-17` if audio permission not yet granted.
- **Exit Points:**
  - Route to `ART-SCR-19` (Voice Description) if granted.
  - Return to `ART-SCR-17` if denied.
- **UI Components:**
  - Friendly graphic of an artisan speaking into a glowing smartphone.
  - Voice prompt: *"Product ke baare mein bolkar batane ke liye mic ki anumati dein."*
  - Big Green Button: *"Mic ki Anumati Dein / Allow Mic"* (🎤).
  - Secondary: *"Main Type Karunga (Keyboard Mode)"*.
- **Actions:**
  - Tap Allow: Prompts OS microphone permission.
- **Navigation:** Proceeds to `ART-SCR-19`.
- **Data:** None.
- **API Requirements:** None.
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** Permission permanently blocked; prompts deep-link to Android settings.
- **Success State:** Proceeds to `ART-SCR-19`.
- **Permissions:** `android.permission.RECORD_AUDIO`.
- **Accessibility Requirements:** Auto-playing audio instructions.
- **Edge Cases:** Device microphone hardware broken; app detects failure and automatically switches to pictorial icon selection form.

---

### `ART-SCR-19`: Voice Product Description Screen
- **Screen Name:** Voice Product Description & Recording Screen
- **Role:** Artisan
- **Purpose:** Capture artisan speaking freely about their craft in their native dialect for AI cataloging and Craft Passport audio story.
- **Entry Point:** `ART-SCR-18` or `ART-SCR-17`.
- **Exit Points:** Route to `ART-SCR-20` (Follow-Up Q&A).
- **UI Components:**
  - Top Card: Enhanced product photo thumbnail with title: *"Apni kala ke baare mein batayein"*.
  - Central Animated Ripple Voice Visualizer (Dynamic frequency spectrum).
  - Center Recording Button: Large 96dp emerald microphone button.
  - Status Text: *"Mic dabayein aur bolein... (Jaise: Yeh kya hai, kis cheez se bana hai)"*.
  - Recording Timer (Max 120 seconds).
  - Stop / Done Button (Square icon, appears while recording).
- **Actions:**
  - Tap Mic: Begins audio capture; spectrum pulses with voice input.
  - Tap Stop: Concludes audio recording; sends stream to speech parser.
- **Navigation:** Routes to `ART-SCR-20`.
- **Data:**
  - Output: `audio_recording_path` (WAV file, 16kHz mono), `duration_seconds` (Integer).
- **API Requirements:** `POST /api/v1/ai/voice/transcribe-description` (Multipart audio file stream).
- **Loading State:** Processing transcribed text: *"Aapki awaaz samajh rahe hain..."*.
- **Empty State:** Idle mic ready for tap.
- **Error State:**
  - Silence detected (>5s): Voice prompts: *"Aapki awaaz nahi aayi. Kripya dobara bolein."*
  - Recording < 3 seconds: *"Thoda aur batayein — saman ke baare mein kuch aur boliye."*
- **Success State:** Checkmark sounds; preliminary transcript displayed in artisan script.
- **Permissions:** `android.permission.RECORD_AUDIO`.
- **Accessibility Requirements:** Pulsing visual rings and synchronized haptic vibrations during recording.
- **Edge Cases:** Artisan speaks in Bhojpuri, Maithili, or Marwari; Bhashini dialect acoustic model transcribes phonetic content and maps regional craft vocabulary to standard Hindi/English taxonomies.

---

### `ART-SCR-20`: AI Conversational Follow-Up Q&A Screen
- **Screen Name:** Conversational AI Product Interviewer Screen
- **Role:** Artisan
- **Purpose:** Ask 2 to 4 friendly voice questions to fill information gaps (materials, labor time, motif names) required for fair pricing and search tagging.
- **Entry Point:** `ART-SCR-19`.
- **Exit Points:** Route to `ART-SCR-21` (Catalog Generation).
- **UI Components:**
  - Animated friendly AI assistant avatar (Kalakar Sahayak).
  - Current Question Card with audio auto-play:
    - Text in native script: *"Isay banane mein kitna samay laga?"*
    - Speaker icon to replay question.
  - Large Responsive Mic Button to speak answer.
  - Quick Suggestion Chips below: e.g., `[ 1 Din ]`, `[ 2-3 Din ]`, `[ 1 Hafte ]`, `[ Pata Nahi ]`.
  - Progress Dots: e.g., Question 2 of 3.
  - Skip Button: *"Aage Badhein / Skip"*.
- **Actions:**
  - Tap Mic & Speak: AI transcribes and extracts entity.
  - Tap Suggestion Chip: Fast one-touch answer.
  - Tap Skip: Uses safe craft taxonomy defaults.
- **Navigation:** Completing last question routes to `ART-SCR-21`.
- **Data:**
  - Entity map: `{ "craft_material": "Silk", "labor_hours": 32, "technique": "Handloom Weft" }`.
- **API Requirements:** `POST /api/v1/ai/catalog/qa-turn` (Payload: `{ "question_id": "labor_time", "audio_answer": "..." }`).
- **Loading State:** Assistant avatar tilts head with animated dots while processing answer.
- **Empty State:** Question text and audio play immediately.
- **Error State:** Unclear answer; AI asks simplified multiple-choice question: *"Kya 2 din lage ya 4 din?"*.
- **Success State:** Cheerful chime: *"Shukriya! Saari zaroori jaankari mil gayi."*.
- **Permissions:** `android.permission.RECORD_AUDIO`.
- **Accessibility Requirements:** Fully autonomous audio loop: AI speaks, mic opens automatically, user speaks, AI confirms.
- **Edge Cases:** Artisan says *"Bahut din lage, yaad nahi"*; AI registers high-effort craft and prompts approximate range without blocking flow.

---

### `ART-SCR-21`: AI Catalog Generation Progress Screen
- **Screen Name:** AI Multi-Lingual Catalog Synthesis Screen
- **Role:** Artisan
- **Purpose:** Display engaging visual progress while LLM synthesizes e-commerce titles, storytelling descriptions, tags, and translations.
- **Entry Point:** `ART-SCR-20`.
- **Exit Points:** Route to `ART-SCR-22` (Pricing Recommendation).
- **UI Components:**
  - Central cultural animation: Rotating artisan loom weaving threads together into a completed cloth.
  - Step-by-Step Checkmark List (Fills in sequentially):
    - ⏳ 1. Photo studio finish complete... (✅)
    - ⏳ 2. Kahani aur description tayyar ho raha hai... (✅)
    - ⏳ 3. English aur Hindi mein anuvad ho raha hai... (✅)
    - ⏳ 4. Sahi bazaar daam calculate ho raha hai... (In Progress)
  - Reassuring voice prompt: *"Aapki listing ban rahi hai. Bas kuch second aur..."*.
- **Actions:** None (Automated background pipeline).
- **Navigation:** Auto-routes to `ART-SCR-22` upon backend job completion (<5 seconds).
- **Data:**
  - Generated Catalog Object: Titles (3 languages), Descriptions (3 languages), Attributes, Category taxonomy codes.
- **API Requirements:** `POST /api/v1/ai/catalog/generate-listing`.
- **Loading State:** Progress steps light up with emerald green checkmarks.
- **Empty State:** Not applicable.
- **Error State:** Generation service times out (>8s); system switches to pre-computed rule-based template and continues without failing.
- **Success State:** All 4 steps check green; sound effect transitions to `ART-SCR-22`.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader announces each step as it completes.
- **Edge Cases:** Artisan closes app during generation; background push notification sent when ready: *"Aapka product ready hai! Daam dekhne ke liye tap karein."*

---

### `ART-SCR-22`: Dynamic Fair Price Recommendation Screen
- **Screen Name:** Dynamic Fair Price Recommendation & Explanation Screen
- **Role:** Artisan
- **Purpose:** Present AI-recommended selling price with a transparent, visual cost breakdown so the artisan understands their true labor value and retains final pricing authority.
- **Entry Point:** `ART-SCR-21`.
- **Exit Points:** Route to `ART-SCR-23` (Review & Edit).
- **UI Components:**
  - Top Recommended Price Badge: *"AI Suggested Fair Price: ₹2,150"*.
  - Visual Cost Breakdown Ledger Card:
    - 🧵 **Kacha Maal (Material):** ₹250
    - ⏱️ **Mehnat (Labor 4 Days):** ₹1,400
    - 🎨 **Kala ki Banawat (Complexity Multiplier):** ₹350
    - 📦 **Packaging Estimate:** ₹60
    - 📈 **Bazaar ki Maang (Market Demand):** ₹90
  - Net Earnings Callout (Green Box): *"Aapke Khate Mein Aayenge: ₹2,042 (5% platform fee ke baad)"*.
  - Audio explanation button: Plays full spoken breakdown.
  - Price Adjustment Control:
    - Minus Button (`- ₹50`), Current Price Field (`₹2,150`), Plus Button (`+ ₹50`).
    - Low-price warning badge (appears only if artisan decreases price below minimum wage floor).
  - Primary Action Button: *"Yeh Daam Sahi Hai (Accept ₹2,150)"*.
- **Actions:**
  - Tap `+` or `-`: Adjusts price; take-home earnings recalculates dynamically in real time.
  - Tap Audio Icon: Voice reads exact breakdown in regional language.
  - Tap Accept: Saves finalized selling price.
- **Navigation:** Routes to `ART-SCR-23`.
- **Data:**
  - Cost elements: `material_cost`, `labor_cost`, `complexity_fee`, `packaging_cost`, `recommended_price`, `final_price`, `net_take_home`.
- **API Requirements:** `POST /api/v1/pricing/calculate-fair-price`.
- **Loading State:** Ledger numbers count up from zero with rolling odometer animation.
- **Empty State:** Not applicable.
- **Error State:** Artisan enters price of `₹0`; alert blocks continuation with voice prompt: *"Daam kam se kam ₹100 hona chahiye."*
- **Success State:** Net earnings text highlights in vibrant Forest Emerald.
- **Permissions:** None.
- **Accessibility Requirements:** Numeric adjustment buttons have 64dp touch targets. Announce updated take-home earnings on each tap.
- **Edge Cases:** Artisan sets price at 3x the AI suggestion; app does not block, but displays informative notice: *"Bazaar mein is tarah ke saman aamtaur par ₹2,000–₹2,500 mein bikte hain. Zyada daam par bikne mein samay lag sakta hai."*

---

### `ART-SCR-23`: Listing Voice Readback & Audio Edit Screen
- **Screen Name:** Listing Voice Readback & Confirmation Screen
- **Role:** Artisan
- **Purpose:** Enable low-literacy artisans to verify all generated listing details via audio readback and make voice-driven modifications before publishing.
- **Entry Point:** `ART-SCR-22`.
- **Exit Points:**
  - Route to `ART-SCR-24` (Publishing & Passport).
  - Save as Draft back to `ART-SCR-10`.
- **UI Components:**
  - Product Listing Card Mockup:
    - Main studio enhanced photo.
    - Title in artisan script (e.g., *"हाथ से बनी मधुबनी मछली पेंटिंग"*).
    - Price in bold emerald: `₹2,150`.
    - Stock quantity pill: `[ 1 Piece ]`.
  - Audio Player Bar with Animated Waveform: Auto-reads title, description, and price aloud.
  - Floating Mic Button: For voice edits (e.g., *"Daam badal kar ₹2,200 karo"*).
  - Secondary Action: 💾 *"Draft Save Karein"* (Save draft locally).
  - Primary Pulsing Green CTA: 🚀 *"Bazaar Mein Daalein / Publish Now"*.
- **Actions:**
  - Listen to audio readback.
  - Tap Mic: Speaks voice edit; system updates card dynamically.
  - Tap Save Draft: Persists to local SQLite and exits to dashboard.
  - Tap Publish: Initiates Flow A12.
- **Navigation:** Routes to `ART-SCR-24`.
- **Data:**
  - Full Product Listing Object (Title, Description, Tags, Price, Images, Audio Story).
- **API Requirements:** `POST /api/v1/artisan/products/draft`.
- **Loading State:** Reading audio scrubber moves across waveform.
- **Empty State:** Not applicable.
- **Error State:** User requests unrecognized voice edit; system prompts: *"Kya aap daam badalna chahte hain ya photo?"* with visual buttons.
- **Success State:** Card shines with animated gleam; transitions to `ART-SCR-24`.
- **Permissions:** `android.permission.RECORD_AUDIO`.
- **Accessibility Requirements:** Full screen can be navigated entirely by voice commands: *"Publish karo"*, *"Draft rakho"*, *"Dobara sunao"*.
- **Edge Cases:** Artisan's phone battery drops below 5%; app auto-saves draft to local storage immediately and notifies user.

---

### `ART-SCR-24`: Publishing Success & Digital Craft Passport QR Screen
- **Screen Name:** Product Published & Craft Passport QR Screen
- **Role:** Artisan
- **Purpose:** Celebrate successful marketplace publishing, display unique Digital Craft Passport QR code, and provide social sharing options.
- **Entry Point:** `ART-SCR-23`.
- **Exit Points:**
  - Route to `ART-SCR-25` (Printable Packaging Tag).
  - Return to `ART-SCR-10` (Dashboard).
- **UI Components:**
  - Confetti burst animation with joyous celebration chime.
  - Audio congratulation: *"Badhai ho Sunita ji! Aapka product Kalakar Setu bazaar mein live ho gaya hai."*
  - Digital Craft Passport Card:
    - Unique QR Code Graphic.
    - Passport ID: `IN-BR-MDB-2026-89421`.
    - Maker Name, District, and Craft Heritage Seal.
  - Action Button 1: 🖨️ *"Packaging QR Card Banayein / Create Parcel Tag"* (Routes to `ART-SCR-25`).
  - Action Button 2: 🟢 *"WhatsApp Par Share Karein"* (Sends link to family/customers).
  - Action Button 3: 🏠 *"Dashboard Par Jayein"*.
- **Actions:**
  - Tap WhatsApp Share: Launches WhatsApp with pre-filled message and product link.
  - Tap Create Parcel Tag: Opens printable card generator.
  - Tap Dashboard: Returns to home.
- **Navigation:** Routes to `ART-SCR-25` or `ART-SCR-10`.
- **Data:**
  - `product_id`, `craft_passport_id`, `public_passport_url`, `qr_code_image_base64`.
- **API Requirements:** `POST /api/v1/artisan/products/publish`.
- **Loading State:** QR code renders with spinning passport emblem.
- **Empty State:** Not applicable.
- **Error State:** AI moderation flags listing during publish call; screen transforms to `ART-SCR-42` (Under Review Notice) explaining the flag.
- **Success State:** Full celebration screen with verifiable live link.
- **Permissions:** None.
- **Accessibility Requirements:** Audio plays automatically; screen reader announces: *"Product successfully published. Craft Passport QR code generated."*
- **Edge Cases:** Device is offline when publish tapped; screen displays offline queued badge: *"Internet aate hi live ho jayega"* and saves to SQLite outbox.

---

### `ART-SCR-25`: Printable QR Packaging Tag Generation Screen
- **Screen Name:** Printable Packaging QR Tag Generator Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Generate a standard printable or shareable parcel tag containing the Craft Passport QR code to slip inside the physical shipping package.
- **Entry Point:** `ART-SCR-24` or Product Detail in Inventory (`ART-SCR-26`).
- **Exit Points:** Return to `ART-SCR-24` or `ART-SCR-10`.
- **UI Components:**
  - Preview of Physical 4x6 inch Postcard Tag:
    - Kalakar Setu Header Seal.
    - Artisan Photo and Story Quote: *"Made with love by Sunita Devi, Madhubani"*.
    - High-Density Scannable QR Code.
    - Buyer prompt: *"Scan with your phone to hear my story & verify authenticity"*.
  - Share to Local Printing Shop Button (PDF via WhatsApp).
  - Save Image to Gallery Button.
  - Done Button.
- **Actions:**
  - Tap Share PDF: Generates standard print-ready PDF and launches Android share sheet.
  - Tap Save Image: Saves JPEG tag to device gallery.
- **Navigation:** Returns to Dashboard.
- **Data:**
  - Formatted postcard layout data with dynamic QR matrix.
- **API Requirements:** None (Rendered locally using Android PDFDocument / Canvas).
- **Loading State:** Rendering PDF preview progress bar.
- **Empty State:** Not applicable.
- **Error State:** Storage permission denied for saving image; prompts storage permission dialog.
- **Success State:** Toast notification: *"Tag gallery mein save ho gaya hai."*
- **Permissions:** `android.permission.WRITE_EXTERNAL_STORAGE` (Android 9 and below only).
- **Accessibility Requirements:** Voice guidance explains: *"Is card ko print karke parcel ke dabbe mein daalein."*
- **Edge Cases:** Artisan has no printer; app allows sending PDF directly to local CSC (Common Service Centre) operator via WhatsApp with one tap.

---

### `ART-SCR-26`: Artisan Inventory / Product Management Screen
- **Screen Name:** Artisan Product Inventory Screen
- **Role:** Artisan
- **Purpose:** View all created products, filter by live/sold/draft status, pause products for holidays, and trigger edits.
- **Entry Point:** Bottom navigation tab *"Mere Products"* on `ART-SCR-10`.
- **Exit Points:**
  - Route to `ART-SCR-27` (Product Edit Modal).
  - Route to `ART-SCR-15` (Add New Product).
- **UI Components:**
  - Filter Tabs:
    - 🟢 **Live (Bikne ke liye ready)** `[4]`
    - 🔴 **Bik Gaye (Sold Out)** `[12]`
    - ⏸️ **Ruke Hue (Paused)** `[1]`
    - 📝 **Drafts** `[2]`
  - Product Cards Grid: Large 2-column cards showing:
    - Main photo with status dot.
    - Title in native script.
    - Selling price (`₹2,150`).
    - Stock remaining pill.
    - Action Menu icon (⋮).
  - Floating Action Button: ➕ *"Naya Product"*.
- **Actions:**
  - Tap Product Card: Opens `ART-SCR-27`.
  - Tap Filter Tab: Filters inventory list.
  - Tap Floating Button: Launches Camera (`ART-SCR-15`).
- **Navigation:** Routes to `ART-SCR-27` or `ART-SCR-15`.
- **Data:**
  - List of product summary objects: `[ { id, title, price, status, stock, thumbnail_url } ]`.
- **API Requirements:** `GET /api/v1/artisan/products/list`.
- **Loading State:** Grid skeleton cards with shimmering placeholders.
- **Empty State:** In selected tab: Illustration of an empty shelf with voice prompt: *"Is category mein koi product nahi hai."*
- **Error State:** Network error; loads cached catalog from local SQLite database.
- **Success State:** Displays organized product inventory with live counters.
- **Permissions:** None.
- **Accessibility Requirements:** Card actions accessible via both long-press and explicit 3-dot tap target (48dp).
- **Edge Cases:** Artisan has >100 listings; screen implements infinite scroll pagination (20 items per batch) to prevent memory crashes on 2GB RAM phones.

---

### `ART-SCR-27`: Product Edit & Stock Update Modal Screen
- **Screen Name:** Product Quick Edit & Inventory Control Modal
- **Role:** Artisan
- **Purpose:** Quick-adjust selling price, update available inventory count, pause listings, or delete products.
- **Entry Point:** `ART-SCR-26`.
- **Exit Points:** Return to `ART-SCR-26`.
- **UI Components:**
  - Bottom Sheet Modal displaying product thumbnail and title.
  - Stock Counter Widget: `[-]` Current Stock: `2` `[+]`.
  - Price Adjustment Field: Large bold numerals with `+₹50` / `-₹50` buttons.
  - Vacation Mode Toggle: Switch labelled *"Abhi bechna rokein (Pause Listing)"*.
  - Delete Product Button (Red outline with trash icon).
  - Voice Command Mic: *"Boliye kya badalna hai"*.
  - Save Changes Button (Emerald green).
- **Actions:**
  - Increase/decrease stock.
  - Adjust price.
  - Toggle pause.
  - Tap Save: Commits updates to server and local cache.
- **Navigation:** Closes bottom sheet modal upon save.
- **Data:**
  - Updated fields: `stock_quantity`, `price`, `is_paused`.
- **API Requirements:** `PATCH /api/v1/artisan/products/{id}`.
- **Loading State:** Save button shows spinner.
- **Empty State:** Not applicable.
- **Error State:** Attempting to delete product with active unfulfilled order; alert dialog blocks action and voice explains: *"Active order pura hone ke baad hi delete kar sakte hain."*
- **Success State:** Modal dismisses, toast confirms: *"Badlaav save ho gaye."*
- **Permissions:** `android.permission.RECORD_AUDIO` (if mic used).
- **Accessibility Requirements:** Announce updated numbers upon each increment/decrement tap.
- **Edge Cases:** Price changed while a buyer has item in checkout; system honors buyer's price if locked in active checkout session within 15-minute window.

---

### `ART-SCR-28`: Orders List & Status Filter Screen
- **Screen Name:** Artisan Orders Pipeline Screen
- **Role:** Artisan
- **Purpose:** Track all customer orders across lifecycle states (New Orders, In Production, Dispatched, Delivered, Returned).
- **Entry Point:** Bottom navigation tab *"Orders"* on `ART-SCR-10`.
- **Exit Points:** Route to `ART-SCR-29` (Order Detail).
- **UI Components:**
  - Top Horizontal Status Bar:
    - 🔔 **Naye (New Action Required)** `[1]` (Yellow badge)
    - 🔨 **Ban Rahe Hain (In Progress)** `[2]`
    - 🚚 **Bhej Diye (In Transit)** `[3]`
    - ✅ **Pahunch Gaye (Delivered)** `[18]`
  - Order Card List:
    - Customer City (e.g., *"Delhi"*).
    - Product thumbnail and title.
    - Amount to be received: *"Aapko milenge: ₹2,042"*.
    - Urgency Timer Badge: *"⏰ 18 ghante baaki hain accept karne ke liye"*.
    - Large Action Button: *"Order Kholein / View Order"*.
- **Actions:**
  - Tap Order Card: Navigates to `ART-SCR-29`.
  - Tap Status Pill: Filters list.
- **Navigation:** Routes to `ART-SCR-29`.
- **Data:**
  - List of order summaries: `[ { order_id, status, buyer_city, amount, time_remaining, product_thumb } ]`.
- **API Requirements:** `GET /api/v1/artisan/orders`.
- **Loading State:** Shimmering order cards.
- **Empty State:** No orders in tab: Illustration of a happy artisan with text *"Koi naya order nahi hai. Naye products jodne se orders badhte hain!"*.
- **Error State:** Network failure loads local cached orders from SQLite.
- **Success State:** List populated with clear color-coded status badges.
- **Permissions:** None.
- **Accessibility Requirements:** High-contrast urgency badges. Voice readback button reads total active orders.
- **Edge Cases:** Order cancelled by buyer while artisan is viewing screen; real-time socket event updates card to *"Cancelled by buyer"* and plays alert chime.

---

### `ART-SCR-29`: Order Detail & Voice Acceptance Screen
- **Screen Name:** Order Detail & Voice Acceptance Screen
- **Role:** Artisan
- **Purpose:** Detailed review of incoming order, buyer destination city, delivery deadlines, and voice-enabled Accept / Reject / Timeline Extension decisions.
- **Entry Point:** `ART-SCR-28` or Push Notification tap.
- **Exit Points:**
  - Route to `ART-SCR-30` (Packaging Guide) on Accept.
  - Return to `ART-SCR-28` on Reject.
- **UI Components:**
  - Prominent Countdown Timer at Top: *"Accept karne ke liye samay: 14 ghante 20 minute"*.
  - Product Card: Photo, Item Title, Quantity ordered, Total payout amount.
  - Delivery Destination Card: State and City (e.g., *"Bengaluru, Karnataka"* - street address masked).
  - Expected Dispatch Deadline: *"3 din ke andar bhejna hai"*.
  - Audio Player: Reads entire order summary aloud.
  - Decision Button Container (3 oversized options):
    - 🟢 **Accept Karein (Haan, Main Bhejungi)**
    - ⏱️ **Thoda Samay Chahiye (+2 Din Request)**
    - 🔴 **Reject Karein (Nahi Bhej Sakti)**
- **Actions:**
  - Tap Accept: Confirms order; status changes to `CONFIRMED`.
  - Tap Request Time: Sends +2 day extension request to buyer.
  - Tap Reject: Prompts voice reason for rejection and relists item.
  - Voice Command: Speak *"Order accept hai"* or *"Order reject karo"*.
- **Navigation:** Accepting routes to `ART-SCR-30`.
- **Data:**
  - Order entity with full fulfillment metadata.
- **API Requirements:**
  - `POST /api/v1/artisan/orders/{id}/accept`.
  - `POST /api/v1/artisan/orders/{id}/reject` (Payload: `{ "reason": "..." }`).
  - `POST /api/v1/artisan/orders/{id}/request-extension`.
- **Loading State:** Button shows progress spinner while committing acceptance.
- **Empty State:** Not applicable.
- **Error State:** Order already auto-cancelled due to 24h timeout; screen shows cancellation notice and auto-refund confirmation.
- **Success State:** Screen bursts with green checkmark; voice confirms: *"Order accept ho gaya hai! Packing shuru karein."*
- **Permissions:** `android.permission.RECORD_AUDIO`.
- **Accessibility Requirements:** All 3 decision buttons have 64dp minimum height and distinct vibration patterns.
- **Edge Cases:** Artisan accidentally taps Reject; modal displays 30-second undo countdown with voice prompt: *"Kya aap sach mein reject karna chahte hain?"*

---

### `ART-SCR-30`: Packaging & Dispatch Guidance Screen
- **Screen Name:** Packaging & Dispatch Voice Guide Screen
- **Role:** Artisan
- **Purpose:** Guide artisan step-by-step on how to pack delicate craft items safely using locally available materials and insert the Craft Passport QR card.
- **Entry Point:** `ART-SCR-29` (after order acceptance).
- **Exit Points:** Route to `ART-SCR-31` (Drop-off / Pickup Selection).
- **UI Components:**
  - Step-by-Step Illustrated Packing Cards with audio:
    - Step 1: 📦 *"Product ko sooti kapde ya bubble wrap mein surakshit lapetein."*
    - Step 2: 🖨️ *"Craft Passport QR card ko dabbe ke andar rakhein."*
    - Step 3: 🔒 *"Dabbe ko tape se mazbooti se band karein."*
  - Verification Checklist (Large tap checkboxes):
    - `[x] Saman surakshit pack hai`
    - `[x] QR card andar daal diya hai`
  - Primary CTA Button: *"Pack Ho Gaya — Dispatch Karein / Ready for Dispatch"*.
- **Actions:**
  - Check verification boxes.
  - Tap Ready for Dispatch: Unlocks shipping step.
- **Navigation:** Routes to `ART-SCR-31`.
- **Data:**
  - `order_id`, `packaging_checklist_confirmed: Boolean`.
- **API Requirements:** `PATCH /api/v1/artisan/orders/{id}/packed`.
- **Loading State:** Instant transition.
- **Empty State:** Not applicable.
- **Error State:** Checkboxes not checked; tapping button prompts voice: *"Kripya dono check box par tick karein."*
- **Success State:** Advances to logistics selection.
- **Permissions:** None.
- **Accessibility Requirements:** Audio plays each packaging step sequentially.
- **Edge Cases:** Fragile craft (pottery/glass); app emphasizes double-box packing and adds prominent *"FRAGILE / नाजुक सामान"* label to the printable sheet.

---

### `ART-SCR-31`: Postal Drop-Off / Courier Pickup Selection Screen
- **Screen Name:** Logistics Method Selection Screen
- **Role:** Artisan
- **Purpose:** Choose between doorstep courier pickup and dropping parcel at the nearest India Post village branch.
- **Entry Point:** `ART-SCR-30`.
- **Exit Points:** Route to `ART-SCR-32` (Barcode Display).
- **UI Components:**
  - Header: *"Parcel kaise bhejna chahte hain?"*.
  - Option Card 1: 📮 **Dak Ghar Drop (Drop at Village Post Office)**:
    - Displays nearest Branch Post Office name (e.g., *"Madhubani BPO - 800 meters"*).
    - Recommended badge for rural areas.
  - Option Card 2: 🚚 **Ghar se Pickup (Courier Pickup from Doorstep)**:
    - Displays estimated pickup date and courier partner name.
  - Primary CTA Button: *"Aage Badhein / Confirm Selection"*.
- **Actions:**
  - Tap Option Card: Selects dispatch mode.
  - Tap Confirm: Books shipment via logistics API.
- **Navigation:** Routes to `ART-SCR-32`.
- **Data:**
  - Input: `fulfillment_mode: 'POST_OFFICE_DROP' | 'DOORSTEP_PICKUP'`.
- **API Requirements:** `POST /api/v1/logistics/shipment/book` (Payload: `{ "order_id": "...", "mode": "..." }`).
- **Loading State:** *"Logistics partner se booking ho rahi hai..."*.
- **Empty State:** Not applicable.
- **Error State:** Doorstep pickup unserviceable for artisan's pincode; automatically selects India Post drop-off with clear explanation: *"Aapke kshetra mein Dak Ghar drop sabse tezi se kaam karta hai."*
- **Success State:** Shipment consignment number generated (`SP123456789IN`).
- **Permissions:** None.
- **Accessibility Requirements:** Audio readback of selected post office or pickup time.
- **Edge Cases:** Nearest post office closed due to holiday; system shows next nearest sub-post office on map with operating hours.

---

### `ART-SCR-32`: Dispatch Barcode & Shipping Label Display Screen
- **Screen Name:** Digital Dispatch Barcode & Consignment Screen
- **Role:** Artisan
- **Purpose:** Display high-contrast barcode and Speed Post tracking number for postal worker or courier agent to scan directly from phone screen.
- **Entry Point:** `ART-SCR-31`.
- **Exit Points:** Return to `ART-SCR-10` (Dashboard).
- **UI Components:**
  - Screen Brightness Auto-Boost to 100% for optical barcode scanner readability.
  - Large Clean Barcode Graphic (Code 128 / QR).
  - Consignment Number in large bold font: `SP 1234 5678 9 IN`.
  - Recipient Name and Destination City: *"Pooja Sharma — Delhi"*.
  - Audio prompt: *"Dak ghar mein yeh barcode dikhayein ya number likhwayein."*
  - Action Button 1: 🖨️ *"Print Label (PDF)"*.
  - Action Button 2: 🟢 *"Post Office Par De Diya (Handover Complete)"*.
- **Actions:**
  - Handover phone for scanning.
  - Tap Handover Complete: Shifts status to `IN_TRANSIT`.
- **Navigation:** Returns to Dashboard `ART-SCR-10`.
- **Data:**
  - `tracking_number`, `barcode_data_url`, `shipping_label_pdf_url`.
- **API Requirements:** `POST /api/v1/logistics/shipment/confirm-handover`.
- **Loading State:** Instant render.
- **Empty State:** Not applicable.
- **Error State:** Postal scanner fails to read screen; large numeric font allows postmaster to manually type the 13-character Speed Post ID into their system.
- **Success State:** Status moves to `IN_TRANSIT`; voice confirms: *"Parcel dispatch ho gaya hai! Delhi pahunchte hi paisa release hoga."*
- **Permissions:** None.
- **Accessibility Requirements:** High-contrast black on white box for barcode. Audio spells out tracking number phonetically.
- **Edge Cases:** Screen brightness fails to auto-boost due to Android OS power saver mode; app displays a manual brightness toggle slider on screen.

---

### `ART-SCR-33`: Earnings Dashboard & Digital Passbook (Khata) Screen
- **Screen Name:** Artisan Digital Passbook & Earnings Screen
- **Role:** Artisan
- **Purpose:** Provide a zero-confusion visual passbook displaying lifetime income, monthly earnings, pending escrow balances, and recent bank credits.
- **Entry Point:** Bottom navigation tab *"Mera Khata"* on `ART-SCR-10`.
- **Exit Points:**
  - Route to `ART-SCR-34` (Detailed Statements).
  - Route to `ART-SCR-13` (Bank Account Settings).
- **UI Components:**
  - Top Traditional Passbook Header (*"डिजिटल खाता / Digital Khata"*).
  - 3 Primary Stat Cards:
    - 💰 **Kul Kamai (Lifetime Earnings):** `₹24,800`
    - 📅 **Is Mahine:** `₹8,400`
    - ⏳ **Aane Wala Paisa (In Escrow):** `₹2,042` *(Delhi order delivery pending)*
  - Linked Bank Account Pill: Showing verified bank name (*"SBI ...4921"*) with green checkmark.
  - Recent Payouts Ledger List:
    - Green deposit card: `+ ₹2,090` (Date: 28 Aug) — Madhubani Saree Order `#9812`.
    - Green deposit card: `+ ₹1,800` (Date: 21 Aug) — Terracotta Vase Order `#9742`.
  - Speaker Button: Audio readback of full financial summary.
- **Actions:**
  - Tap Speaker: Speaks passbook status in native dialect.
  - Tap any Ledger Row: Opens order transaction breakdown.
- **Navigation:** Routes to `ART-SCR-34`.
- **Data:**
  - `lifetime_earnings`, `monthly_earnings`, `escrow_balance`, `transactions_list`.
- **API Requirements:** `GET /api/v1/artisan/earnings/passbook`.
- **Loading State:** Passbook entries shimmer with loading rows.
- **Empty State:** New artisan: Passbook shows `₹0` with encouraging message: *"Aapki pehli kamai yahan dikhegi."*
- **Error State:** Network offline; displays cached balances with offline watermark.
- **Success State:** Numbers render cleanly with currency symbols and green credit indicators.
- **Permissions:** None.
- **Accessibility Requirements:** All numbers voiced in Hindi / native language (e.g., *"Chobis hazaar aath sau rupaye"*).
- **Edge Cases:** Payout delayed by bank holiday; escrow card displays yellow notice: *"Bank chhutti ke karan paisa Somwar ko aayega."*

---

### `ART-SCR-34`: Payout Transaction History & Statement Screen
- **Screen Name:** Payout Statement & Transaction Detail Screen
- **Role:** Artisan
- **Purpose:** Detailed line-item breakdown of individual order payouts, showing deductions (5% platform fee) and bank reference UTR numbers.
- **Entry Point:** `ART-SCR-33`.
- **Exit Points:** Return to `ART-SCR-33`.
- **UI Components:**
  - Transaction Header: Gross Amount, Net Deposited, Bank UTR reference code (`UTR981240129`).
  - Itemized Receipt Table:
    - Customer Paid: `₹2,200`
    - Platform Service Fee (5%): `- ₹110`
    - Net Transferred to Bank: **`₹2,090`**
  - Download Statement PDF Button (for local CSC printout).
  - Help Button: *"Is payment mein koi dikkat hai? (Report Issue)"*.
- **Actions:**
  - Tap Report Issue: Routes to Support (`ART-SCR-39`).
  - Tap Download: Exports statement.
- **Navigation:** Returns to `ART-SCR-33`.
- **Data:**
  - Full transaction ledger metadata.
- **API Requirements:** `GET /api/v1/artisan/earnings/transactions/{txn_id}`.
- **Loading State:** Shimmering table rows.
- **Empty State:** Not applicable.
- **Error State:** Data unavailable; retry button provided.
- **Success State:** Detailed receipt displayed.
- **Permissions:** None.
- **Accessibility Requirements:** Audio readback of full fee breakdown.
- **Edge Cases:** Bank transfer reversed; status displays red badge *"Bank Reversal"* with direct call link to support.

---

### `ART-SCR-35`: B2B Market Opportunities & Cluster Invitations Screen
- **Screen Name:** B2B Bulk Orders & Cluster Opportunities Screen
- **Role:** Artisan
- **Purpose:** Discover corporate gifting orders, government bulk RFQs, and cluster production invitations tailored to the artisan's craft capacity.
- **Entry Point:** Tap *"Bada Bazaar"* tile on `ART-SCR-10`.
- **Exit Points:** Route to `ART-SCR-36` (Cluster Production Brief).
- **UI Components:**
  - Glowing Gold Banner: *"Bada Bazaar — Corporate & Bulk Orders"*.
  - Audio introduction: *"Bade orders mein hissa lein aur cluster ke saath milkar banayein."*
  - Active Opportunities Feed:
    - Card 1: 🤝 **Corporate Diwali Gift Order (500 Handloom Folders)**:
      - Total Order Value: `₹2,50,000`
      - Available Sub-Quota: `50 pieces`
      - Guaranteed Earning: `₹25,000`
      - Deadline: `20 Days`
      - Cluster Lead: `Sunita Cooperative Society`
    - Card 2: 🏛️ **Government Handloom Mela Bulk Display (100 Shawls)**.
  - Action Button on Card: *"Poora Order Dekhein / View Brief"*.
- **Actions:**
  - Tap Opportunity Card: Opens `ART-SCR-36`.
- **Navigation:** Routes to `ART-SCR-36`.
- **Data:**
  - List of active cluster RFQ objects: `[ { rfq_id, title, total_units, quota_available, payout_rate, days } ]`.
- **API Requirements:** `GET /api/v1/clusters/opportunities/available`.
- **Loading State:** Shimmering cards with gold borders.
- **Empty State:** No active bulk orders: Illustration of artisans collaborating with text: *"Naye corporate orders aane par hum aapko yahan inform karenge."*
- **Error State:** Network failure loads local cached invitations.
- **Success State:** Active opportunities listed.
- **Permissions:** None.
- **Accessibility Requirements:** Full audio description of bulk orders.
- **Edge Cases:** All cluster quotas filled while artisan is reading; card displays *"Quota Full"* badge and offers standby waitlist.

---

### `ART-SCR-36`: Cluster Production Brief & Quota Acceptance Screen
- **Screen Name:** Shared Cluster Production Brief & Commitment Screen
- **Role:** Artisan
- **Purpose:** Review exact specifications, material supply terms, unit pay, and lock in sub-quota commitment for a collective bulk order.
- **Entry Point:** `ART-SCR-35`.
- **Exit Points:**
  - Route to `ART-SCR-37` (Milestone Tracking) upon acceptance.
  - Return to `ART-SCR-35` upon decline.
- **UI Components:**
  - Brief Header: Client Name (e.g., *"Tech Mahindra Corporate Gifting"*), Product Name, Reference Sample Photo.
  - Specifications List: Exact dimensions (12x8 inches), base fabric (Tussar Silk), motifs allowed.
  - Your Assigned Share Card:
    - Quantity: `50 pieces`
    - Rate per piece: `₹500`
    - Total Guaranteed Earning: `₹25,000`
    - Material Advance (30% upfront): `₹7,500`
  - Audio Brief: Plays master artisan voice explanation of the technical standard.
  - Decision Buttons:
    - 🟢 **Haan, Main 50 Pieces Banaugi (Accept Full Quota)**
    - ⚪ **Thoda Kam (Accept 25 Pieces)**
    - 🔴 **Abhi Samay Nahi Hai (Decline)**
- **Actions:**
  - Select quota quantity.
  - Tap Accept: Signs digital cluster agreement and triggers upfront 30% material deposit.
- **Navigation:** Routes to `ART-SCR-37`.
- **Data:**
  - Cluster commitment payload: `{ cluster_id, artisan_id, allocated_quantity, advance_amount }`.
- **API Requirements:** `POST /api/v1/clusters/{id}/accept-quota`.
- **Loading State:** Committing agreement shows loading animation.
- **Empty State:** Not applicable.
- **Error State:** Quota allocation expired; returns to `ART-SCR-35`.
- **Success State:** Fireworks animation; voice confirms: *"Badhai ho! Aap Diwali Corporate Cluster ka hissa ban gaye hain. Advance payment ₹7,500 bheja ja raha hai."*
- **Permissions:** None.
- **Accessibility Requirements:** Audio readback of production brief terms.
- **Edge Cases:** Artisan already has maximum ongoing individual orders; system checks workload and suggests smaller 25-piece quota to prevent burn-out.

---

### `ART-SCR-37`: Cluster Milestone Tracking & Photo Submission Screen
- **Screen Name:** Cluster Production Milestone & QC Photo Screen
- **Role:** Artisan
- **Purpose:** Track bulk production progress, upload milestone verification photos (Raw Materials, 50% Complete, Final Dispatch), and unlock phased payments.
- **Entry Point:** `ART-SCR-36` or Dashboard banner.
- **Exit Points:** Return to `ART-SCR-10`.
- **UI Components:**
  - Cluster Progress Bar: Shows combined cluster pace (e.g., *"Cluster 68% Complete — On Track"*).
  - Your Personal Milestones Timeline:
    - Milestone 1: 🧵 Raw Material Sourced (✅ Verified — ₹7,500 released)
    - Milestone 2: 🎨 25 Pieces Hand-Painted (🟡 Submit Photo for Review)
    - Milestone 3: 📦 All 50 Finished & Ready for Hub Dispatch (⚪ Locked)
  - Photo Proof Submission Card: Large camera button to upload milestone photo.
  - SOS Button: ⚠️ *"Madad Chahiye / I am facing an issue"* (Alerts cluster lead).
- **Actions:**
  - Tap Camera: Captures proof of batch progress.
  - Tap SOS: Prompts voice reason to reallocate work if ill.
- **Navigation:** Photo submission triggers AI visual verification and updates status.
- **Data:**
  - `milestone_id`, `units_completed`, `proof_photo_urls`.
- **API Requirements:** `POST /api/v1/clusters/{id}/milestone/submit`.
- **Loading State:** Photo uploading progress indicator.
- **Empty State:** Not applicable.
- **Error State:** Photo rejected by AI QC (e.g., incorrect motif); shows reference sample comparison and prompts retake.
- **Success State:** Milestone approved; next phase advance payment released.
- **Permissions:** `android.permission.CAMERA`.
- **Accessibility Requirements:** Clear voice prompts at every milestone.
- **Edge Cases:** Artisan falls sick mid-way; SOS reallocates remaining unstarted units to neighboring cluster members automatically without penalties.

---

### `ART-SCR-38`: Voice-First Help & FAQ Screen
- **Screen Name:** Voice-First Help & Video Guide Screen
- **Role:** Artisan
- **Purpose:** Resolve top 20 common artisan questions using pre-recorded regional voice guides, animated videos, and zero-typing navigation.
- **Entry Point:** Help icon on any screen.
- **Exit Points:** Route to `ART-SCR-39` (Live Support).
- **UI Components:**
  - Search by Voice Mic Button: *"Apna sawal bolein"*.
  - 6 Top Question Visual Cards with Audio:
    - ❓ *"Photo achhi kaise kheechein? (How to take good photos)"*
    - ❓ *"Mera paisa kab aayega? (When will my money arrive)"*
    - ❓ *"Order kaise pack karein? (How to pack an order)"*
    - ❓ *"Product ka daam kaise badlein? (How to change price)"*
    - ❓ *"Bank account kaise badlein? (How to change bank)"*
    - ❓ *"Dak ghar mein kya bolna hai? (What to say at post office)"*
  - Bottom Emergency CTA: 📞 *"Sahayak ya Support Agent se Baat Karein"*.
- **Actions:**
  - Tap Question Card: Expands card, plays 30-second audio explanation and shows animated diagram.
  - Tap Live Support: Routes to `ART-SCR-39`.
- **Navigation:** Routes to `ART-SCR-39`.
- **Data:**
  - Bundled FAQ audio clips and transcript cards.
- **API Requirements:** None (Offline cached).
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** Voice question not matched; routes to live agent call.
- **Success State:** Audio explanation plays.
- **Permissions:** None.
- **Accessibility Requirements:** High-contrast icons; full audio narration.
- **Edge Cases:** Artisan is illiterate; UI contains zero unvoiced text.

---

### `ART-SCR-39`: Live Support Connect & Call Request Screen
- **Screen Name:** Live Human Support & Call-Back Request Screen
- **Role:** Artisan
- **Purpose:** Connect artisan directly with a local language human support representative or request an automated outbound telephone callback.
- **Entry Point:** `ART-SCR-38`.
- **Exit Points:** Return to Dashboard.
- **UI Components:**
  - Status Card: *"Hamare sahayak abhi online hain (Avg wait time: 2 min)"*.
  - Option 1 (Primary): 📞 *"Humein Call Karein (Toll-Free Number)"* — 1800-XXX-XXXX.
  - Option 2: 🔄 *"Mujhe Call Karein (Request Call Back)"* (Single tap callback booking).
  - Option 3: 🟢 *"WhatsApp Support Chat"*.
  - Display of Linked Facilitator's direct phone number with call button.
- **Actions:**
  - Tap Toll-Free: Launches Android dialer with number pre-filled.
  - Tap Request Call Back: Dispatches API request; IVR calls phone within 5 minutes.
- **Navigation:** Returns to calling screen.
- **Data:**
  - Callback payload: `{ artisan_id, phone, current_screen_context }`.
- **API Requirements:** `POST /api/v1/support/request-callback`.
- **Loading State:** Submitting callback request spinner.
- **Empty State:** Not applicable.
- **Error State:** Outside business hours (9 PM to 7 AM); screen explains: *"Support subah 8 baje shuru hoga. Hum subah pehle call karenge."*
- **Success State:** Toast alert: *"Aapko 5 minute mein call aayegi."*
- **Permissions:** `android.permission.CALL_PHONE` (Optional, defaults to launching OS dialer).
- **Accessibility Requirements:** Spoken confirmation of callback booking.
- **Edge Cases:** Phone line busy; system retries outbound call 3 times at 2-minute intervals.

---

### `ART-SCR-40`: Artisan Settings & App Preferences Screen
- **Screen Name:** Artisan App Settings & Preferences Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Configure app language, toggle audio auto-play, adjust notification quiet hours, check app version, and inspect data storage.
- **Entry Point:** `ART-SCR-11`.
- **Exit Points:** Return to `ART-SCR-11`.
- **UI Components:**
  - Setting Row 1: 🌐 **Bhasha (Language)** — Shows current language, tap opens `ART-SCR-02`.
  - Setting Row 2: 🔊 **Awaaz Auto-Play (Voice Prompts)** — Toggle switch (ON/OFF).
  - Setting Row 3: 🌙 **Raat ka Shant Samay (Quiet Hours 10 PM - 7 AM)** — Toggle switch.
  - Setting Row 4: 💾 **Phone Memory & Offline Sync** — Tap opens `ART-SCR-41`.
  - Setting Row 5: 📜 **Niyam aur Shartein (Terms of Service & Privacy Policy)**.
  - App Version Tag: *"Kalakar Setu v1.0.4 (Build 89)"*.
- **Actions:**
  - Toggle switches.
  - Change language.
- **Navigation:** Routes to sub-settings screens.
- **Data:**
  - Read/Write local `AppPreferences`.
- **API Requirements:** None (Local preferences).
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** None.
- **Success State:** Preferences saved to encrypted storage immediately.
- **Permissions:** None.
- **Accessibility Requirements:** Toggle switches have minimum 48dp touch bounds and clear audible click cues.
- **Edge Cases:** Voice auto-play turned off; visual UI elements automatically introduce persistent speaker icons so user can still listen on demand.

---

### `ART-SCR-41`: Offline Storage & Sync Queue Status Screen
- **Screen Name:** Offline Storage & Outbox Sync Queue Screen
- **Role:** Artisan / Facilitator
- **Purpose:** Inspect pending offline photo uploads, drafts, and order responses waiting to sync to the cloud.
- **Entry Point:** `ART-SCR-40`.
- **Exit Points:** Return to `ART-SCR-40`.
- **UI Components:**
  - Network Status Banner: Shows whether currently Online (Green) or Offline (Amber).
  - Outbox Sync Queue List:
    - Item 1: 📸 Madhubani Saree Photos (3 photos waiting for Wi-Fi) — `[Sync Now]` button.
    - Item 2: 📝 Price Update Draft — Status: Synced.
  - Storage Clean-Up Widget:
    - *"App ne 140 MB memory li hai."*
    - Button: 🗑️ *"Purani Chache Photos Saaf Karein (Free 80 MB)"*.
  - Manual Force Sync Button: 🔄 *"Abhi Sync Karein"*.
- **Actions:**
  - Tap Force Sync: Attempts immediate upload.
  - Tap Clean Up: Deletes cached thumbnails while preserving master files.
- **Navigation:** Returns to `ART-SCR-40`.
- **Data:**
  - Local SQLite Outbox table records.
- **API Requirements:** Batch sync API endpoint.
- **Loading State:** Sync progress bar with percentage.
- **Empty State:** Queue empty: *"Sabhi files internet par upload ho chuki hain (All Synced ✅)"*.
- **Error State:** Upload fails due to weak connection; items remain safely in SQLite outbox for automatic background retry.
- **Success State:** Queue empties, checkmark appears.
- **Permissions:** None.
- **Accessibility Requirements:** Audio readback of sync status.
- **Edge Cases:** Phone memory drops below 50MB; app auto-clears old cached buyer thumbnails to protect artisan listing assets.

---

### `ART-SCR-42`: Universal Error & Connection Recovery Screen
- **Screen Name:** Universal Error & Connection Recovery Screen
- **Role:** Artisan
- **Purpose:** Friendly, voice-supported recovery screen when unexpected exceptions, network drops, or moderation flags occur.
- **Entry Point:** System error handlers, crash catchers, or offline failures.
- **Exit Points:** Retry action or return to `ART-SCR-10`.
- **UI Components:**
  - Reassuring illustration of a craftsman repairing a broken clay pot with golden kintsugi seams.
  - Spoken audio message: *"Chinta na karein! Koi data gayab nahi hua hai. Internet aane par ya button dabane par dobara koshish karein."*
  - Error Explanation in Simple Dialect:
    - State A (Offline): *"Internet nahi chal raha hai. Aapka kaam phone mein safe hai."*
    - State B (Server Busy): *"Bazaar server par bheed hai. 1 minute baad koshish karein."*
  - Primary Green Button: 🔄 *"Dobara Koshish Karein / Retry Now"*.
  - Secondary Button: 🏠 *"Home Dashboard Par Jayein"*.
- **Actions:**
  - Tap Retry: Re-executes failed operation.
  - Tap Home: Restores safe state.
- **Navigation:** Routes back to safe flow.
- **Data:**
  - Error code, stack trace (logged internally, not shown to user).
- **API Requirements:** None.
- **Loading State:** Retry spinner.
- **Empty State:** Not applicable.
- **Error State:** Repeated retry failures offer direct call to human support (`ART-SCR-39`).
- **Success State:** Restores flow.
- **Permissions:** None.
- **Accessibility Requirements:** High-contrast text; full voice explanation.
- **Edge Cases:** App experiences unhandled runtime crash; crash recovery wrapper intercepts, writes state to SQLite, and relaunches straight to this recovery screen without silent death.

---

## Section B: Buyer Web & Mobile Experience Screens

---

### `BUY-SCR-01`: Storefront Splash & Welcome Screen
- **Screen Name:** Buyer Storefront Splash & Entry Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Instant brand immersion, currency localization, and frictionless entry into discovery without login gating.
- **Entry Point:** Web URL access (`kalakarsetu.in`) or Mobile App launch.
- **Exit Points:** Auto-transitions to `BUY-SCR-02` (Storefront Home).
- **UI Components:**
  - High-res animated artisan weaving motif with brand slogan: *"Every purchase has a face, a story, and a place."*
  - Instant location/currency badge: 🇮🇳 `INR (₹)` or 🌍 `USD ($)`.
- **Actions:** None (Auto-bootstrap <1 second).
- **Navigation:** Routes to `BUY-SCR-02`.
- **Data:**
  - IP geolocation lookup, user agent, cached cart tokens.
- **API Requirements:** `GET /api/v1/buyer/bootstrap-context`.
- **Loading State:** Seamless background preload.
- **Empty State:** Not applicable.
- **Error State:** IP lookup fails; defaults to India (`INR`).
- **Success State:** Fades into homepage.
- **Permissions:** None.
- **Accessibility Requirements:** ARIA landmark `main`. Alt text for cultural imagery.
- **Edge Cases:** Slow 2G cellular network; page renders critical CSS and inline SVG logo in <400ms.

---

### `BUY-SCR-02`: Buyer Home & Curated Collections Screen
- **Screen Name:** Buyer Storefront Marketplace Home
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Curated discovery of authentic Indian crafts, direct artisan stories, interactive craft maps, and seasonal gifting shops.
- **Entry Point:** `BUY-SCR-01` or top navigation logo.
- **Exit Points:**
  - Search: `BUY-SCR-03`.
  - Category: `BUY-SCR-06`.
  - Craft Map: `BUY-SCR-08`.
  - Product Detail: `BUY-SCR-09`.
  - Cart: `BUY-SCR-14`.
  - B2B Portal: `BUY-SCR-26`.
- **UI Components:**
  - Top Global Header: Brand Logo, Multimodal Search Bar, Language Switcher, Wishlist (`♡`), Cart (`🛒`), Sign In button.
  - Hero Campaign Carousel: Highlighting regional craft clusters (e.g., *"Mithila Art Festival"* with embedded video).
  - Interactive India Craft Map Teaser Widget: Tap any state to explore indigenous crafts.
  - "Explore by Craft Form" Horizontal Scroll: Handloom, Terracotta, Metalcraft, Woodwork, Paintings, Natural Fiber.
  - "Meet the Makers" Stories Reel: Artisan portraits with 10-second audio previews.
  - "GI Tagged Certified Treasures" Curated Grid: Verified Geographical Indication products.
  - "Ready to Ship (Dispatches in 48h)" Collection.
  - Footer: Trust badges (Handloom Mark, Silk Mark, 95% Artisan Payout Guarantee), Support links.
- **Actions:**
  - Tap any product/collection card.
  - Tap Search bar: Opens `BUY-SCR-03`.
  - Tap Map: Opens `BUY-SCR-08`.
- **Navigation:** Deep-links across catalog.
- **Data:**
  - Homepage CMS payload: Banners, curated product arrays, featured artisan profiles.
- **API Requirements:** `GET /api/v1/buyer/homepage-feed`.
- **Loading State:** Shimmer skeleton placeholders matching card grid layout.
- **Empty State:** Fallback to cached editorial curations.
- **Error State:** API down; renders static cached collections without broken UI.
- **Success State:** Smooth scrolling visual feed with lazy-loaded WebP images.
- **Permissions:** None.
- **Accessibility Requirements:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`). Full keyboard tab navigation.
- **Edge Cases:** Festival traffic surge (Diwali); static CDN edge caching absorbs 100K concurrent requests without database hitting.

---

### `BUY-SCR-03`: Multimodal Search & Auto-Suggestion Screen
- **Screen Name:** Buyer Multimodal Search Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Provide instant predictive search with support for text queries, voice search, and visual photo matching.
- **Entry Point:** Tapping search bar on any buyer screen.
- **Exit Points:**
  - Route to `BUY-SCR-06` (Search Results).
  - Route to `BUY-SCR-04` (Voice Search).
  - Route to `BUY-SCR-05` (Image Search).
- **UI Components:**
  - Prominent Search Header with back arrow, text input field, 🎤 mic button, 📷 camera button, and clear (`✕`) button.
  - Recent Searches Chips (e.g., `"madhubani saree"`, `"brass diya"`).
  - Trending Craft Searches List with rank numbers and flame icons.
  - Instant Auto-Complete Dropdown: Displays matching products, artisan names, and craft categories as user types.
- **Actions:**
  - Type query: Debounced (250ms) auto-complete fetch.
  - Tap Mic: Opens `BUY-SCR-04`.
  - Tap Camera: Opens `BUY-SCR-05`.
  - Tap Suggestion: Navigates to `BUY-SCR-06` or `BUY-SCR-09`.
- **Navigation:** Routes to search results.
- **Data:**
  - Query string, auto-complete suggestions array.
- **API Requirements:** `GET /api/v1/search/autocomplete?q={query}`.
- **Loading State:** Subtle search bar spinner while typing.
- **Empty State:** Displays recent search history and popular craft traditions.
- **Error State:** Network drop; allows offline search across cached recent items.
- **Success State:** Suggestions list opens with highlighted matched keywords.
- **Permissions:** None.
- **Accessibility Requirements:** `aria-autocomplete="list"`, `role="combobox"`. Focus management.
- **Edge Cases:** User enters spelling mistake (e.g., *"madhubni shari"*); fuzzy search corrects to `"Madhubani Saree"` with *"Showing results for..."* prompt.

---

### `BUY-SCR-04`: Voice Search Overlay Screen
- **Screen Name:** Buyer Voice Search Modal Screen
- **Role:** B2C Buyer
- **Purpose:** Allow buyers to search in English, Hindi, or regional languages by speaking natural descriptive queries.
- **Entry Point:** Mic icon on `BUY-SCR-03`.
- **Exit Points:** Route to `BUY-SCR-06` (Results) or dismiss overlay.
- **UI Components:**
  - Dark translucent modal overlay.
  - Central Animated Sound Waveform Orb.
  - Prompt: *"Listening... Speak something like 'Blue pottery vase' or 'सफेद सूती साड़ी'"*.
  - Language indicator pill with toggle (English / Hindi).
  - Close button (`✕`).
- **Actions:**
  - Speak query.
  - Tap Close: Dismisses overlay.
- **Navigation:** Routes to `BUY-SCR-06` with transcribed query.
- **Data:**
  - Speech stream, parsed text query.
- **API Requirements:** `POST /api/v1/ai/voice/transcribe-query`.
- **Loading State:** Waveform responds dynamically to audio volume.
- **Empty State:** Idle state prompts user to speak.
- **Error State:** No speech detected; displays *"Didn't catch that. Tap to try again."*
- **Success State:** Transcribed text appears on screen and transitions to `BUY-SCR-06`.
- **Permissions:** `android.permission.RECORD_AUDIO` (on mobile) or browser microphone prompt.
- **Accessibility Requirements:** Spoken audio cues and text transcript display.
- **Edge Cases:** Buyer speaks complex colloquial query (*"Diwali gifting items under 1000 rupees"*); NLU extracts category (`Gifts`), occasion (`Diwali`), and filter (`price <= 1000`).

---

### `BUY-SCR-05`: Visual Image Search Upload Screen
- **Screen Name:** Reverse Image Craft Search Screen
- **Role:** B2C Buyer
- **Purpose:** Enable buyers to upload a photo of a craft item and find visually identical or similar authentic artisan products.
- **Entry Point:** Camera icon on `BUY-SCR-03`.
- **Exit Points:** Route to `BUY-SCR-06` (Results) or dismiss.
- **UI Components:**
  - Photo Capture Viewfinder / File Upload Box:
    - Button 1: 📷 *"Take a Photo"*
    - Button 2: 🖼️ *"Upload from Gallery"*
  - Crop & Bounding Box Tool: Drag corner handles to isolate craft from background clutter.
  - Search Button: *"Find Matching Crafts"*.
- **Actions:**
  - Capture or upload photo.
  - Adjust crop bounds.
  - Tap Search: Uploads image embedding query.
- **Navigation:** Routes to `BUY-SCR-06`.
- **Data:**
  - Image vector embeddings.
- **API Requirements:** `POST /api/v1/search/visual` (Multipart image).
- **Loading State:** Pulse scan-line animation moving across uploaded image: *"Scanning craft texture, weave pattern, and motifs..."*.
- **Empty State:** File dropzone with placeholder illustrations.
- **Error State:** Non-craft image uploaded (e.g., automobile); warns: *"We couldn't recognize a craft item in this photo. Try another image."*
- **Success State:** Transitions to `BUY-SCR-06` with matching products.
- **Permissions:** Camera / Storage access.
- **Accessibility Requirements:** Alt text prompts and file upload keyboard support.
- **Edge Cases:** Low-resolution image; visual feature extractor uses super-resolution preprocessing before vector matching.

---

### `BUY-SCR-06`: Search Results & Product Listing Screen
- **Screen Name:** Search Results & Product Listing Page (PLP)
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Display matching products in a responsive grid with sorting, quick add, and active filter pill indicators.
- **Entry Point:** `BUY-SCR-03`, `BUY-SCR-04`, `BUY-SCR-05`, or category links.
- **Exit Points:**
  - Route to `BUY-SCR-07` (Filter Drawer).
  - Route to `BUY-SCR-09` (Product Detail).
- **UIComponents:**
  - Search Query & Results Count Header: e.g., *"Madhubani Painting — 48 authentic crafts found"*.
  - Sort Bar: Dropdown (Relevance, Price: Low to High, Price: High to Low, Artisan Rating, Newest).
  - Filter Drawer Trigger Button with active filter badge counter (`Filters [2]`).
  - Active Filter Chips (Removable tags e.g., `[GI Tagged ✕]`, `[Under ₹2,500 ✕]`).
  - Product Grid (2 columns on mobile, 4 columns on desktop):
    - Product Photo (with hover secondary angle flip).
    - Verified Artisan Badge.
    - Artisan Name & Village location (e.g., *"By Sunita Devi, Madhubani"*).
    - Title.
    - Price in bold (`₹2,150`).
    - Stock status: Ready Stock (Ships in 48h) or Made to Order.
    - Quick Wishlist Heart (`♡`).
- **Actions:**
  - Tap Card: Opens `BUY-SCR-09`.
  - Tap Heart: Toggles wishlist.
  - Tap Filter: Opens `BUY-SCR-07`.
  - Change Sort: Refetches sorted results.
- **Navigation:** Routes to PDP.
- **Data:**
  - Search results pagination object: `[ { id, title, price, artisan_name, images, gi_tagged, rating } ]`.
- **API Requirements:** `GET /api/v1/search/products?q={query}&sort={sort}&filters={filters}&page={page}`.
- **Loading State:** Skeleton card grid with shimmer effect.
- **Empty State:** Route to `BUY-SCR-29` (Empty Catalog) or in-line message: *"No crafts found matching your filters. Try clearing some filters."*
- **Error State:** Search engine timeout; displays cached popular listings with error banner.
- **Success State:** Grid loads with pagination / infinite scroll.
- **Permissions:** None.
- **Accessibility Requirements:** Product list wrapped in semantic `<ul>` / `<li>` structure. Screen reader announces updated item counts.
- **Edge Cases:** New artisan with zero sales in results; search algorithm allocates a 10% discovery quota on page 1 so new rural artisans get fair visibility.

---

### `BUY-SCR-07`: Search Filter & Facet Refinement Drawer Screen
- **Screen Name:** Search Faceted Filtering Drawer Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Deep filtering by craft traditions, GI certification, artisan state, price range, and delivery speed.
- **Entry Point:** Filter button on `BUY-SCR-06`.
- **Exit Points:** Return to `BUY-SCR-06` with applied filters.
- **UI Components:**
  - Sliding Drawer (Mobile bottom sheet / Desktop sidebar).
  - Filter Section 1: **Certifications & Authenticity**:
    - `[ ] GI Tagged Certified (Geographical Indication)`
    - `[ ] Handloom Mark Verified`
    - `[ ] Silk Mark Certified`
  - Filter Section 2: **Region / State of Origin**: Checkbox list (Rajasthan, Bihar, Odisha, West Bengal, Kashmir, etc.).
  - Filter Section 3: **Price Range**: Dual-thumb range slider (`₹200` to `₹25,000+`).
  - Filter Section 4: **Fulfillment Type**:
    - `[ ] Ready to Ship (Dispatches in 48 Hours)`
    - `[ ] Made to Order (Direct from Loom)`
  - Filter Section 5: **Material**: Cotton, Silk, Terracotta, Brass, Teak Wood, Jute, etc.
  - Bottom Sticky Bar:
    - Button 1: *"Clear All"*
    - Button 2: *"Apply Filters (Show 38 Crafts)"* (Updates dynamically).
- **Actions:**
  - Toggle checkboxes, slide price bar.
  - Tap Apply: Refreshes PLP.
- **Navigation:** Returns to `BUY-SCR-06`.
- **Data:**
  - Selected filter state dictionary.
- **API Requirements:** `GET /api/v1/search/facets` (Fetches dynamic counts per filter).
- **Loading State:** Item count on Apply button updates asynchronously.
- **Empty State:** Not applicable.
- **Error State:** None.
- **Success State:** Drawer slides closed; PLP updates smoothly.
- **Permissions:** None.
- **Accessibility Requirements:** Keyboard accessible sliders with `aria-valuemin`, `aria-valuemax`.
- **Edge Cases:** Selecting combination of filters yielding zero products; Apply button disables and shows: *"No products match this combination"*.

---

### `BUY-SCR-08`: Interactive India Craft Map Discovery Screen
- **Screen Name:** Interactive India Craft Map Discovery Screen
- **Role:** B2C Buyer
- **Purpose:** Visual, geographical exploration of India's indigenous crafts, allowing buyers to discover products by regional origin and cultural history.
- **Entry Point:** Map widget on `BUY-SCR-02` or navigation bar.
- **Exit Points:** Route to `BUY-SCR-06` (Filtered by State).
- **UI Components:**
  - Interactive SVG Vector Map of India with clickable states.
  - State Hover / Tap Card: Shows state name, craft emblem, and top craft traditions:
    - Example (Bihar): *"Mithila / Madhubani Painting, Sikki Grass Craft, Bhagalpur Tussar Silk"*.
    - Example (Rajasthan): *"Blue Pottery, Bagru Block Print, Kathputli Woodcraft"*.
  - State Craft Gallery Preview (Horizontal drawer at bottom): Shows 4 trending products from selected state with *"Explore all [State] Crafts"* button.
  - Search State Input Field (for fast lookup without panning map).
- **Actions:**
  - Tap / Click State on map.
  - Tap "Explore all Crafts": Routes to PLP filtered by state.
- **Navigation:** Routes to `BUY-SCR-06`.
- **Data:**
  - GeoJSON state polygons, state-to-craft mappings, state product counts.
- **API Requirements:** `GET /api/v1/geo/craft-map-data`.
- **Loading State:** Map vector renders smoothly with progressive polygon fill.
- **Empty State:** Not applicable.
- **Error State:** WebGL / SVG rendering failure; falls back to responsive alphabetical state list grid.
- **Success State:** State highlights in Ochre Gold with smooth zoom transition.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader accessible state list alternatives for users with visual impairments (`aria-hidden="true"` on raw SVG map).
- **Edge Cases:** Disputed boundary rendering; strictly adheres to Survey of India official map depiction guidelines.

---

### `BUY-SCR-09`: Product Detail Page (PDP) & Photo Gallery Screen
- **Screen Name:** Product Detail Page (PDP)
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Full immersion into product details, high-res texture zoom, artisan provenance, Craft Passport preview, voice story player, and purchase execution.
- **Entry Point:** `BUY-SCR-02`, `BUY-SCR-06`, or direct link.
- **Exit Points:**
  - Route to `BUY-SCR-10` (Voice Story Player).
  - Route to `BUY-SCR-11` (Full Craft Passport).
  - Route to `BUY-SCR-12` (Artisan Profile).
  - Route to `BUY-SCR-14` (Cart).
  - Route to `BUY-SCR-18` (Instant Buy Checkout).
- **UI Components:**
  - Image Gallery: Carousel with multi-angle studio photos, thumbnail strip, full-screen pinch/zoom modal (up to 4x).
  - Title: Large font with craft tradition subtitle (e.g., *"Handmade Madhubani Folk Art Painting on Handmade Paper"*).
  - Price Block: Bold numerals (`₹2,150`), tax inclusive note, optional expandable link *"See Fair Price Breakdown"*.
  - Stock & Delivery Badge:
    - 🟢 *"Ready Stock — Ships in 48 Hours"* or ⏱️ *"Made to Order — Dispatches in 7 Days"*.
  - Artisan Provenance Card:
    - Artisan photo, Name, Verified Badge, District/State tag.
    - Embedded Audio Player Button: 🎵 *"Hear Sunita Devi's Story (0:45 min)"* (Opens `BUY-SCR-10`).
    - Link: *"View all 14 creations by this artisan"*.
  - Digital Craft Passport Preview Card:
    - Mini QR Code badge, Material verification seal, GI Tag certificate number, Labor time (28 hours).
    - CTA: *"Inspect Full Digital Craft Passport"* (Opens `BUY-SCR-11`).
  - Specifications Accordion: Dimensions, Weight, Material Base, Botanical Dye Source, Care Instructions.
  - Verified Customer Reviews Section (`BUY-SCR-24`).
  - Fixed Bottom Bar (Mobile):
    - Heart Wishlist Button.
    - 🛒 **Add to Cart** (Emerald outline button).
    - ⚡ **Buy Now** (Deep Terracotta solid button).
- **Actions:**
  - Pinch-to-zoom photo.
  - Play voice story.
  - Expand accordions.
  - Tap Add to Cart: Adds item and animates cart badge counter.
  - Tap Buy Now: Bypasses cart directly to checkout (`BUY-SCR-18`).
- **Navigation:** Routes to Cart, Checkout, or Passport.
- **Data:**
  - Complete product details schema, inventory balance, delivery estimates, reviews aggregation.
- **API Requirements:** `GET /api/v1/buyer/products/{id}`.
- **Loading State:** Skeleton blocks for gallery and text.
- **Empty State:** Product deleted/inactive; renders *"This craft has been retired or sold"* with recommendations.
- **Error State:** Network error; shows retry button.
- **Success State:** Complete product page loaded with high-res images.
- **Permissions:** None.
- **Accessibility Requirements:** All accordion headers use `<button>` with `aria-expanded`. Image gallery announces: *"Image 1 of 4: Close up weave texture"*.
- **Edge Cases:** Single unique piece (inventory = 1); badge warns: *"Only 1 available — handcrafted original"*. If another user purchases during viewing, Add to Cart disables immediately via WebSocket inventory push.

---

### `BUY-SCR-10`: Artisan Voice Story Audio Player Overlay Screen
- **Screen Name:** Artisan Audio Voice Story Modal Screen
- **Role:** B2C Buyer
- **Purpose:** Play the artisan's personal voice story recorded during listing creation, accompanied by synchronized English/Hindi subtitles.
- **Entry Point:** Audio button on `BUY-SCR-09` or `BUY-SCR-11`.
- **Exit Points:** Dismiss overlay back to PDP.
- **UI Components:**
  - Modal Card with warm parchment textured background.
  - Artisan Profile Photo with circular progress ring indicating playback.
  - Artisan Name and Location: *"Sunita Devi — Madhubani, Bihar"*.
  - Native Voice Playback: Streaming audio of artisan speaking.
  - Scrolling Subtitle Window: Shows synchronized English translation of the spoken words:
    - *"I created this painting using handmade paper and natural dyes made from marigold flowers. In our village, the fish motif represents prosperity and fertility..."*
  - Audio Controls: Play/Pause, 15-second skip back, audio scrubber slider, volume toggle.
  - Close button (`✕`).
- **Actions:**
  - Play, pause, scrub audio.
  - Read synchronized subtitles.
- **Navigation:** Dismisses modal.
- **Data:**
  - Audio streaming URL (AAC/MP3), subtitle VTT file URL.
- **API Requirements:** `GET /api/v1/artisan/{id}/story-audio`.
- **Loading State:** Audio buffering spinner on play button.
- **Empty State:** Not applicable.
- **Error State:** Audio stream fails to load; modal displays full text transcript.
- **Success State:** Smooth audio playback with synchronized highlighting on subtitles.
- **Permissions:** None.
- **Accessibility Requirements:** Full text transcript provided for deaf or hard-of-hearing users. Subtitle font size adjustable.
- **Edge Cases:** Background music playing on buyer's device; system requests audio focus to pause background music during story playback.

---

### `BUY-SCR-11`: Digital Craft Passport Web Verification Screen (Public Scan)
- **Screen Name:** Digital Craft Passport Public Verification Page
- **Role:** B2C Buyer / Public Inspector
- **Purpose:** Publicly accessible web verification page rendered when any smartphone scans the physical QR code on the packaging card.
- **Entry Point:** Scanning QR on product packaging or link from `BUY-SCR-09`.
- **Exit Points:** Storefront navigation or artisan profile.
- **UI Components:**
  - Golden Official Verification Banner: *"✅ Authenticity Verified — Kalakar Setu Digital Craft Passport"*.
  - Unique Cryptographic Craft Identity Number: `IN-BR-MDB-2026-89421`.
  - First-Scan Timestamp Verification:
    - *"First scanned by verified buyer on 03 Sep 2026. This item is 100% genuine."*
  - Maker Profile Card:
    - Artisan Photo, Verified Badge, Craft Council Registration ID.
    - Village Map Pin: Shows district on map (fuzzed to village level for privacy).
  - Craft Heritage Seal: Geographical Indication (GI) registration details and historical origin brief.
  - Embedded Voice Story Player (`BUY-SCR-10` inline).
  - Material & Labor Verification Table:
    - Raw Material: 100% Organic Botanical Inks & Handmade Cotton Rag Paper.
    - Time Invested: 28 Hours of hand-painting.
    - Carbon Footprint: Low impact, zero machine electricity.
  - Buy More from this Maker CTA Button.
- **Actions:**
  - Play story.
  - Inspect certificates.
  - Browse artisan catalog.
- **Navigation:** Routes to `BUY-SCR-12` or storefront.
- **Data:**
  - Cryptographic verification payload signed by platform private key.
- **API Requirements:** `GET /api/v1/public/craft-passport/{passport_id}`.
- **Loading State:** Shield validation animation verifying cryptographic signature.
- **Empty State:** Invalid QR; displays red warning: *"This QR code does not match any registered Kalakar Setu craft. Beware of counterfeits."*
- **Error State:** Network error; prompts retry.
- **Success State:** Gold verified seal animates with checkmark.
- **Permissions:** None (Public web URL, no login required).
- **Accessibility Requirements:** High-contrast accessible web markup compliant with WCAG 2.1 AA.
- **Edge Cases:** QR code scanned multiple times across different devices (e.g., gifted item); page displays scan counter: *"Verified Genuine Craft — Scanned 3 times"*.

---

### `BUY-SCR-12`: Artisan Public Profile & Catalog Screen
- **Screen Name:** Artisan Public Storefront Profile Screen
- **Role:** B2C Buyer
- **Purpose:** Dedicated public storefront for an individual artisan displaying their bio, awards, village background, and full catalog of products.
- **Entry Point:** Tapping artisan name on `BUY-SCR-09` or `BUY-SCR-11`.
- **Exit Points:** Route to `BUY-SCR-09` (PDP).
- **UI Components:**
  - Artisan Cover Banner showing workshop/handloom in village.
  - Profile Lockup: Artisan Photo, Name, Verified Badge, State/District, Member Since.
  - Bio Story Card: *"Sunita Devi has been practicing Mithila folk art for over 22 years, carrying on the tradition taught by her grandmother..."*.
  - GI Tag & Handloom Mark Trust Badges.
  - Customer Feedback Summary: Star Rating (e.g., `⭐ 4.9 (42 reviews)`).
  - Full Product Grid: All active creations by this artisan.
  - "Share Artisan Story" Button.
- **Actions:**
  - Browse products.
  - Read bio.
  - Share profile link.
- **Navigation:** Tapping product opens `BUY-SCR-09`.
- **Data:**
  - Artisan public bio, certifications, product list array.
- **API Requirements:** `GET /api/v1/buyer/artisan/{id}`.
- **Loading State:** Shimmering profile header and product cards.
- **Empty State:** Artisan has zero active products; displays bio with message: *"Sunita Devi is currently crafting new pieces on her loom. Check back soon!"*
- **Error State:** Network error retry button.
- **Success State:** Profile rendered.
- **Permissions:** None.
- **Accessibility Requirements:** Semantic structure, alt text on artisan workshop imagery.
- **Edge Cases:** Artisan has won National Master Craftsperson Award; special gold banner displays Ministry of Textiles recognition citation.

---

### `BUY-SCR-13`: Buyer Wishlist Screen
- **Screen Name:** Buyer Saved Items / Wishlist Screen
- **Role:** B2C Buyer
- **Purpose:** View and manage saved craft items, monitor price drops, and move items into cart.
- **Entry Point:** Top navigation heart icon (`♡`).
- **Exit Points:** Route to `BUY-SCR-09` or `BUY-SCR-14`.
- **UI Components:**
  - Wishlist Item Grid:
    - Product Photo, Title, Price.
    - Artisan Name.
    - Stock Status Indicator (e.g., *"Only 1 left"* or *"Made to order"*).
    - Remove from Wishlist Button (Trash icon).
    - 🛒 **Move to Cart** (Emerald CTA button).
  - Empty Wishlist Callout (when empty): Illustration of an empty basket with *"Your wishlist is waiting for authentic handcrafted treasures"* + *"Explore Collections"* CTA.
- **Actions:**
  - Tap Move to Cart: Transits item from wishlist to cart.
  - Tap Remove: Deletes item from saved list.
- **Navigation:** Routes to Cart or PDP.
- **Data:**
  - Array of saved product IDs and current live pricing/stock.
- **API Requirements:**
  - `GET /api/v1/buyer/wishlist`.
  - `DELETE /api/v1/buyer/wishlist/{id}`.
  - `POST /api/v1/buyer/cart/move-from-wishlist`.
- **Loading State:** Shimmering cards.
- **Empty State:** Illustrated empty state with browse button.
- **Error State:** Network failure banner.
- **Success State:** List populated.
- **Permissions:** Requires authenticated buyer session (`BUY-SCR-15`).
- **Accessibility Requirements:** Accessible delete and move actions with voice confirmation.
- **Edge Cases:** Saved item goes out of stock; card dims and displays *"Sold Out — Similar crafts available"* with search link.

---

### `BUY-SCR-14`: Shopping Cart & Multi-Artisan Package Screen
- **Screen Name:** Shopping Cart & Split Package Management Screen
- **Role:** B2C Buyer
- **Purpose:** Review cart items, transparently inspect split package shipments originating from different rural artisan hubs, and initiate checkout.
- **Entry Point:** Cart icon in top navigation or "Add to Cart" CTA.
- **Exit Points:** Route to `BUY-SCR-16` (Address Selection) or `BUY-SCR-18` (Checkout).
- **UI Components:**
  - Split Package Grouping Cards:
    - **Package 1 of 2 (Ships from Madhubani, Bihar):**
      - Artisan: Sunita Devi.
      - Item: Madhubani Painting (`₹2,150`). Quantity: `1`.
      - Delivery estimate: 5–7 business days.
    - **Package 2 of 2 (Ships from Jaipur, Rajasthan):**
      - Artisan: Ram Das.
      - Item: Blue Pottery Mug (`₹850`). Quantity: `2` (`₹1,700`).
      - Delivery estimate: 4–6 business days.
  - Item Quantity Adjuster (`[-] 1 [+]`) and Remove (`✕`).
  - Price Summary Sticky Bottom Drawer:
    - Items Total: `₹3,850`
    - Estimated Shipping: `₹120`
    - Artisan Impact Note: *"100% of product price goes directly to the makers."*
    - **Total Payable:** **`₹3,970`**
  - Primary CTA Button: *"Proceed to Checkout / Check Out"* (Deep Terracotta).
- **Actions:**
  - Adjust item quantities.
  - Remove items.
  - Tap Proceed to Checkout: Initiates order pipeline.
- **Navigation:** Routes to `BUY-SCR-15` (if unauthenticated) or `BUY-SCR-16` (if logged in).
- **Data:**
  - Cart entity: Items array, sub-packages, shipping calculations, tax totals.
- **API Requirements:**
  - `GET /api/v1/buyer/cart`.
  - `PATCH /api/v1/buyer/cart/item/{id}`.
  - `DELETE /api/v1/buyer/cart/item/{id}`.
- **Loading State:** Price summary updates with loading spinner when quantity altered.
- **Empty State:** Empty Cart illustration with text: *"Your cart is empty. Explore authentic craft traditions"* + *"Start Shopping"* button.
- **Error State:** Item quantity exceeds artisan stock; alert warns: *"Only 1 piece available for this handcrafted item."*
- **Success State:** Cart totals calculated with transparent logistics.
- **Permissions:** None (Guest cart stored in browser LocalStorage / SQLite).
- **Accessibility Requirements:** Screen reader announces updated total on every item quantity change.
- **Edge Cases:** Cart contains items from 4 different artisans; system clearly displays 4 separate delivery dates without confusing the buyer.

---

### `BUY-SCR-15`: Buyer Auth / Phone OTP Login Screen
- **Screen Name:** Buyer Mobile & Social Authentication Screen
- **Role:** B2C Buyer
- **Purpose:** Frictionless buyer authentication via 10-digit mobile OTP or Google Single-Sign-On during checkout.
- **Entry Point:** Triggered when unauthenticated user proceeds from Cart (`BUY-SCR-14`) or taps "Sign In".
- **Exit Points:** Return to calling flow (Cart / Checkout) or Home.
- **UI Components:**
  - Modal Bottom Sheet / Dedicated Login Page.
  - Brand Heading: *"Sign In to Kalakar Setu — Support Rural Artisans Directly"*.
  - Option 1 (One-Tap): Google Sign-In Button (`"Continue with Google"`).
  - Divider: *"OR"*.
  - Option 2: 10-digit Indian Mobile Number Input (`+91`).
  - Primary Button: *"Get OTP"*.
  - Sub-View: 6-digit OTP entry field with resend countdown timer.
  - Terms and Privacy policy disclaimer links.
- **Actions:**
  - Enter mobile number and request OTP.
  - Enter OTP to verify.
  - Or tap Google button for OAuth2 authentication.
- **Navigation:** Returns to checkout flow with user profile hydrated.
- **Data:**
  - Input: `phone_number`, `otp_code` or `google_id_token`.
  - Output: `buyer_jwt_token`, `buyer_profile`.
- **API Requirements:**
  - `POST /api/v1/auth/buyer/send-otp`.
  - `POST /api/v1/auth/buyer/verify-otp`.
  - `POST /api/v1/auth/buyer/google-sso`.
- **Loading State:** Button spinner while verifying code.
- **Empty State:** Form ready.
- **Error State:** Invalid OTP entered; red border and error message: *"Invalid code. Please re-enter."*
- **Success State:** User profile restored; guest cart merged into user account.
- **Permissions:** None.
- **Accessibility Requirements:** Accessible input labels and automated focus shift to OTP boxes.
- **Edge Cases:** Guest cart had 2 items and previously saved account cart had 1 item; system merges cart items into a unified cart without dropping any products.

---

### `BUY-SCR-16`: Shipping Address Selection & Entry Screen
- **Screen Name:** Shipping Address Management Screen
- **Role:** B2C Buyer
- **Purpose:** Select existing delivery address or add new verified address with automatic postal code validation.
- **Entry Point:** `BUY-SCR-14` or `BUY-SCR-18`.
- **Exit Points:** Route to `BUY-SCR-18` (Checkout Summary).
- **UI Components:**
  - Saved Address Card Radio Group (Home, Work, Other) with recipient name, street, phone number, and default tag.
  - Add New Address Accordion / Button:
    - Full Recipient Name.
    - 10-digit Contact Mobile Number.
    - Pincode (6 digits - triggers instant auto-fill of City and State).
    - Flat / House No / Building Name.
    - Street / Colony / Locality.
    - Landmark (Optional).
    - Address Type Pills: `[ Home ]`, `[ Work ]`.
  - Deliver to this Address Button (Emerald green).
- **Actions:**
  - Select radio button address.
  - Type new address with auto-complete.
  - Tap Deliver: Validates and proceeds.
- **Navigation:** Routes to `BUY-SCR-18`.
- **Data:**
  - Address Object: `{ id, recipient_name, phone, street, city, state, pincode, type }`.
- **API Requirements:**
  - `GET /api/v1/buyer/addresses`.
  - `POST /api/v1/buyer/addresses`.
  - `GET /api/v1/geo/pincode/{pincode}` (Auto-resolves district and state).
- **Loading State:** Shimmer over saved addresses.
- **Empty State:** No saved address; form opens expanded automatically.
- **Error State:** Pincode invalid; red alert: *"Please enter a valid 6-digit Indian postal pincode."*
- **Success State:** Address selected and checked.
- **Permissions:** None.
- **Accessibility Requirements:** Standard HTML form autocomplete attributes (`autocomplete="shipping postal-code"`).
- **Edge Cases:** Pincode is in a remote village; system confirms coverage via India Post Speed Post network.

---

### `BUY-SCR-17`: Pincode Serviceability & Delivery Estimate Modal Screen
- **Screen Name:** Pincode Deliverability Check Modal
- **Role:** B2C Buyer
- **Purpose:** Quick-check delivery timeline and courier availability for a destination pincode directly from the product page.
- **Entry Point:** Tapping "Check Delivery" on `BUY-SCR-09`.
- **Exit Points:** Dismiss modal back to PDP.
- **UI Components:**
  - Pincode Input Box (6 digits) with *"Check"* button.
  - Delivery Result Card:
    - 🚚 Estimated Delivery: *"5 to 7 Business Days"*.
    - Courier Network: *"Serviceable by India Post Speed Post & Blue Dart"*.
    - Cash on Delivery Availability: *"COD Available ✅"*.
- **Actions:**
  - Enter 6 digits and tap Check.
- **Navigation:** Dismisses modal and updates delivery pill on PDP.
- **Data:**
  - `pincode`, `is_serviceable: Boolean`, `estimated_days_min`, `estimated_days_max`, `cod_available: Boolean`.
- **API Requirements:** `GET /api/v1/logistics/serviceability?pincode={pincode}&origin_district={district}`.
- **Loading State:** Checking serviceability spinner.
- **Empty State:** Input field focused.
- **Error State:** Pincode not serviceable by private couriers; system automatically falls back to India Post and confirms delivery availability.
- **Success State:** Green delivery badge displayed with arrival date.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader announces delivery estimate on check completion.
- **Edge Cases:** Buyer enters military APO/FPO pincode; system confirms dispatch via Army Postal Service (APS) through India Post.

---

### `BUY-SCR-18`: Order Checkout & Summary Review Screen
- **Screen Name:** Order Checkout & Summary Review Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Final comprehensive review of shipping address, package breakdown, tax invoice details, and pricing before payment authorization.
- **Entry Point:** `BUY-SCR-16` or Buy Now from `BUY-SCR-09`.
- **Exit Points:** Route to `BUY-SCR-19` (Payment Selection).
- **UI Components:**
  - Delivery Address Card (with "Change" link).
  - Package Review Cards (Displays artisan name, dispatch district, and items).
  - B2B GSTIN Invoice Checkbox (Optional):
    - *"Add Business GSTIN for Input Tax Credit"*.
    - Form field for Company Name and 15-character GSTIN.
  - Price Summary Card:
    - Items Subtotal: `₹3,850`
    - Delivery / Courier Charge: `₹120`
    - Estimated Taxes (GST inclusive): Included
    - **Total Payable Amount:** **`₹3,970`**
  - Security & Trust Guarantee:
    - *"🔒 100% Escrow Protection: Your money is held safely until you receive your craft."*
  - Primary CTA Button: *"Proceed to Payment / Pay ₹3,970"* (Deep Terracotta).
- **Actions:**
  - Toggle GSTIN input.
  - Tap Change Address.
  - Tap Proceed to Payment: Locks order draft and advances to payment.
- **Navigation:** Routes to `BUY-SCR-19`.
- **Data:**
  - Final checkout draft payload.
- **API Requirements:** `POST /api/v1/buyer/orders/initiate-checkout`.
- **Loading State:** Generating checkout session spinner.
- **Empty State:** Not applicable.
- **Error State:** Price of an item changed while in checkout; modal displays updated price and asks confirmation before proceeding.
- **Success State:** Session initialized; transitions to `BUY-SCR-19`.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader announces total payable amount before advancing.
- **Edge Cases:** B2B buyer enters invalid GSTIN; inline regex and GST validation API flags invalid code before allowing payment.

---

### `BUY-SCR-19`: Payment Method Selection Screen (UPI / Cards / NetBanking / COD)
- **Screen Name:** Multi-Option Payment Gateway Selector Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Select and initiate secure payment via UPI, Credit/Debit Cards, NetBanking, or Cash on Delivery with full platform Escrow protection.
- **Entry Point:** `BUY-SCR-18`.
- **Exit Points:**
  - Route to `BUY-SCR-20` (Payment Processing).
  - Cancel back to `BUY-SCR-18`.
- **UI Components:**
  - Amount Payable Header: `₹3,970`.
  - Payment Options Accordion:
    - **Option 1: UPI (Recommended - Zero Extra Fees):**
      - One-Touch App Deep Links: Google Pay, PhonePe, Paytm, CRED UPI.
      - Or Enter Virtual Payment Address (VPA / UPI ID): `user@okhdfcbank`.
    - **Option 2: Credit / Debit Cards:**
      - Visa, Mastercard, RuPay, Maestro.
      - Card Number, Expiry Date (MM/YY), CVV (Tokenized entry, PCI-DSS compliant).
    - **Option 3: NetBanking:**
      - Top Indian Banks (SBI, HDFC, ICICI, Axis, PNB) + Dropdown for 50+ banks.
    - **Option 4: Cash on Delivery (COD):**
      - Radio button (Available for orders < ₹10,000).
  - Security Footer: Razorpay / Cashfree PCI-DSS Level 1 Encrypted Gateway Seal.
  - Primary Pay Button: *"Pay ₹3,970"*.
- **Actions:**
  - Select payment mode.
  - Input card details or select UPI app.
  - Tap Pay: Launches bank authorization or UPI Intent.
- **Navigation:** Routes to `BUY-SCR-20`.
- **Data:**
  - `payment_method`, `gateway_session_id`, `amount`.
- **API Requirements:** `POST /api/v1/payments/create-order-session`.
- **Loading State:** Loading payment gateway SDK scripts securely.
- **Empty State:** Not applicable.
- **Error State:** Gateway service unavailable; automatically falls back to secondary payment gateway provider.
- **Success State:** Launches bank OTP or UPI app.
- **Permissions:** None.
- **Accessibility Requirements:** Keyboard focus management; masked secure input fields.
- **Edge Cases:** International card used; 3D Secure 2.0 multi-currency conversion flow triggers with estimated USD equivalent.

---

### `BUY-SCR-20`: Payment Processing & Bank Redirect Screen
- **Screen Name:** Payment Transaction Processing & Polling Screen
- **Role:** B2C Buyer
- **Purpose:** Display secure processing status, handle 3D Secure bank OTP redirects, and poll webhook confirmation without user dropping off.
- **Entry Point:** `BUY-SCR-19`.
- **Exit Points:**
  - Route to `BUY-SCR-21` (Order Success).
  - Failure return to `BUY-SCR-19`.
- **UI Components:**
  - Animated Padlock & Bank Transfer Visual.
  - Status Message: *"Authorizing payment with your bank... Please do not refresh or press back."*.
  - Polling Timer (30-second progress ring).
  - Bank Logo and Order Reference ID.
- **Actions:** None (Automatic async polling).
- **Navigation:**
  - On `PAYMENT_SUCCESS`: Routes to `BUY-SCR-21`.
  - On `PAYMENT_FAILED`: Returns to `BUY-SCR-19` with error reason.
- **Data:**
  - `transaction_id`, `payment_status`.
- **API Requirements:** `GET /api/v1/payments/status/{txn_id}` (Polled every 2 seconds).
- **Loading State:** Active polling animation.
- **Empty State:** Not applicable.
- **Error State:** Card declined / Insufficient funds; returns to `BUY-SCR-19` with notice: *"Payment declined by your bank. Please try another card or UPI."*
- **Success State:** Sound chime and transition to `BUY-SCR-21`.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader status live region (`aria-live="polite"`).
- **Edge Cases:** Buyer's internet disconnects during bank OTP redirect; system's backend webhook listens for bank callback, marks order as paid in escrow, and dispatches confirmation SMS immediately upon reconnection.

---

### `BUY-SCR-21`: Order Success & Receipt Confirmation Screen
- **Screen Name:** Order Confirmation & Maker Notification Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Celebrate successful purchase, present order reference, display invoice download, and illustrate how the artisan was notified.
- **Entry Point:** `BUY-SCR-20`.
- **Exit Points:**
  - Route to `BUY-SCR-23` (Tracking).
  - Continue Shopping back to `BUY-SCR-02`.
- **UI Components:**
  - Joyous Animated Green Checkmark with sitar celebratory chime.
  - Headline: *"Thank You! Your Order has been Placed Directly with the Artisan."*.
  - Order Reference Number: `#KS-2026-98124`.
  - Artisan Impact Visual:
    - Portrait of Sunita Devi with text: *"Sunita Devi in Madhubani, Bihar has been notified to prepare your authentic craft."*
  - Estimated Delivery Card: *"Expected Arrival: 08–10 September"*.
  - Action Button 1: 📦 *"Track Your Order"* (Routes to `BUY-SCR-23`).
  - Action Button 2: 📄 *"Download Tax Invoice (PDF)"*.
  - Action Button 3: 🏠 *"Continue Exploring Crafts"*.
- **Actions:**
  - Tap Track: Opens tracking.
  - Tap Download: Exports invoice.
- **Navigation:** Routes to `BUY-SCR-23` or `BUY-SCR-02`.
- **Data:**
  - Confirmed order details entity.
- **API Requirements:** `GET /api/v1/buyer/orders/{id}/confirmation`.
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** None.
- **Success State:** Celebration screen active.
- **Permissions:** None.
- **Accessibility Requirements:** Auto-announcement of order reference and delivery arrival window.
- **Edge Cases:** Order placed as guest; screen offers 1-tap button to *"Set a password or pin to track order easily"* without requiring full registration forms.

---

### `BUY-SCR-22`: Buyer Orders List Screen
- **Screen Name:** Buyer My Orders History Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** View active and past orders, monitor multi-artisan shipments, and initiate returns or reviews.
- **Entry Point:** Account menu navigation tab *"My Orders"*.
- **Exit Points:** Route to `BUY-SCR-23` (Tracking) or `BUY-SCR-24` (Review).
- **UI Components:**
  - Filter Tabs: `[ All Orders ]`, `[ In Progress ]`, `[ Delivered ]`, `[ Cancelled ]`.
  - Order Card List:
    - Order Reference ID: `#KS-2026-98124`.
    - Placed Date and Total Amount.
    - Product Thumbnails with Artisan Name.
    - Status Badge: 🟢 `Dispatched via India Post` or ✅ `Delivered`.
    - Action Buttons on Card:
      - 📦 **Track Package**
      - ⭐ **Leave a Review** (If delivered)
      - 📄 **View Invoice**
- **Actions:**
  - Tap Track Package: Opens `BUY-SCR-23`.
  - Tap Review: Opens `BUY-SCR-24`.
- **Navigation:** Deep-links to tracking or review.
- **Data:**
  - Orders history array with delivery statuses.
- **API Requirements:** `GET /api/v1/buyer/orders`.
- **Loading State:** Shimmering order cards.
- **Empty State:** No orders placed yet; illustration with *"You haven't ordered any handcrafted items yet"* + *"Explore Marketplace"* CTA.
- **Error State:** Network failure banner.
- **Success State:** Orders list rendered.
- **Permissions:** None.
- **Accessibility Requirements:** Semantic order list with accessible status labels.
- **Edge Cases:** Multi-package order; card displays multi-line tracking status for each individual artisan package.

---

### `BUY-SCR-23`: Order Tracking & Postal Telemetry Timeline Screen
- **Screen Name:** Real-Time Postal Telemetry Tracking Screen
- **Role:** B2C Buyer
- **Purpose:** Transparent multi-leg shipment tracking from rural artisan workshop, through India Post / courier hubs, to buyer doorstep.
- **Entry Point:** `BUY-SCR-21`, `BUY-SCR-22`, or SMS tracking link.
- **Exit Points:** Return to `BUY-SCR-22`.
- **UI Components:**
  - Order Header: Product Name, Artisan Name, Consignment Tracking Number (`SP123456789IN`).
  - Active Courier Partner Badge: India Post Speed Post / Blue Dart.
  - Interactive Vertical Stepper Timeline:
    - 🟢 **Order Placed & Confirmed** (Date/Time)
    - 🟢 **Handcrafted & Packed by Artisan** (Craft Passport QR attached)
    - 🟢 **Handed over at Madhubani Branch Post Office**
    - 🟡 **In Transit — Patna National Sorting Hub** (Latest telemetry)
    - ⚪ **Out for Delivery**
    - ⚪ **Delivered**
  - Live Map Route Preview (Shows transit path from Bihar to Delhi).
  - Estimated Arrival Date Banner: *"Arriving Thursday by 8:00 PM"*.
  - Need Help with this Shipment Button (`BUY-SCR-28`).
- **Actions:**
  - Tap Refresh: Pulls real-time postal tracking API update.
  - Copy Tracking Number.
- **Navigation:** Returns to orders list.
- **Data:**
  - Real-time tracking events array: `[ { status, location, timestamp, notes } ]`.
- **API Requirements:** `GET /api/v1/logistics/track/{tracking_number}`.
- **Loading State:** Timeline shimmers while querying logistics gateway.
- **Empty State:** New order: Shows step 1 active: *"Artisan is preparing your craft"*.
- **Error State:** Postal telemetry down; shows last known checkpoint and explains: *"Tracking updates may take up to 4 hours to refresh from postal hubs."*
- **Success State:** Full milestone timeline active.
- **Permissions:** None.
- **Accessibility Requirements:** Screen reader announces current active milestone.
- **Edge Cases:** Severe weather delay in transit hub; system adds informative alert notice: *"Flooding in Patna region may delay arrival by 24 hours. Your package is safe."*

---

### `BUY-SCR-24`: Verified Purchase Rating & Review Submission Screen
- **Screen Name:** Verified Buyer Review & Photo Upload Screen
- **Role:** B2C Buyer
- **Purpose:** Submit 5-star rating, living room photo, and written appreciation for the artisan with automatic cross-lingual translation.
- **Entry Point:** Tapping "Review" on `BUY-SCR-22` or push notification after delivery.
- **Exit Points:** Return to `BUY-SCR-22`.
- **UI Components:**
  - Product Card Header: Thumbnail, Title, Artisan Name.
  - Star Rating Selector: 5 large interactive gold stars (⭐ ⭐ ⭐ ⭐ ⭐).
  - Photo Upload Box: *"Show how this craft looks in your home (+)"* (Upload up to 3 photos).
  - Written Review Text Area: Placeholder: *"What did you love about the craft? Write a personal message to the artisan..."*.
  - Language Notice: *"Your review will be automatically translated into the artisan's native language."*
  - Submit Review Button (Emerald green).
- **Actions:**
  - Tap stars to rate (1 to 5).
  - Upload living room photo.
  - Type review text.
  - Tap Submit.
- **Navigation:** Returns to order history.
- **Data:**
  - Review payload: `{ order_id, product_id, rating: 5, comment: "...", photos: [...] }`.
- **API Requirements:** `POST /api/v1/buyer/reviews/submit`.
- **Loading State:** Submitting review and uploading photos progress bar.
- **Empty State:** Clean review form.
- **Error State:** Empty star rating; shakes stars and warns: *"Please select a star rating."*
- **Success State:** Toast notification: *"Thank you! Your review has been shared directly with Sunita Devi."*
- **Permissions:** Camera / Photo access.
- **Accessibility Requirements:** Star rating accessible via keyboard arrow keys with live announcement (`"5 stars selected"`).
- **Edge Cases:** Review text contains profanity; AI filter flags text before submission and asks user to revise.

---

### `BUY-SCR-25`: Dispute & Return Request Screen (Photo Proof Upload)
- **Screen Name:** Buyer Conditional Return & Transit Damage Claim Screen
- **Role:** B2C Buyer
- **Purpose:** File a return request for damaged, defective, or incorrect craft items within the 48-hour return window with mandatory photo evidence.
- **Entry Point:** Order Detail on `BUY-SCR-22`.
- **Exit Points:** Return to `BUY-SCR-22`.
- **UI Components:**
  - Return Policy Reminder: *"Handcrafted items are unique. Returns are accepted for transit damage, manufacturing defects, or wrong items within 48 hours of delivery."*
  - Reason Radio Group:
    - `( ) Damaged during transit`
    - `( ) Defective craft / Broken parts`
    - `( ) Wrong item delivered`
    - `( ) Not as described`
  - Mandatory Photo Evidence Uploader:
    - Box 1: Outer packaging photo.
    - Box 2: Damaged craft photo.
  - Description Text Area: *"Please describe the issue..."*.
  - Preferred Resolution:
    - `( ) Replacement from artisan`
    - `( ) Full Refund to original payment method`
  - Submit Claim Button (Deep Terracotta).
- **Actions:**
  - Select reason, upload photos, submit claim.
- **Navigation:** Returns to orders list with status `RETURN_REQUESTED`.
- **Data:**
  - Dispute payload: `{ order_id, reason, description, photo_urls, requested_resolution }`.
- **API Requirements:** `POST /api/v1/buyer/disputes/create`.
- **Loading State:** Uploading evidence files spinner.
- **Empty State:** Form ready.
- **Error State:** Missing photos; submission blocked: *"Photo proof of damage is required to process return claims."*
- **Success State:** Confirmation screen: *"Return claim submitted. Our team will review within 24 hours. Your payment remains locked safely in escrow."*
- **Permissions:** Camera / Storage.
- **Accessibility Requirements:** Accessible form validation with clear field error announcements.
- **Edge Cases:** 48-hour return window elapsed; button is disabled with explanation: *"Return window closed 2 days after delivery. For support, contact help center."*

---

### `BUY-SCR-26`: B2B Wholesale Portal & Bulk RFQ Submission Screen
- **Screen Name:** Institutional B2B Bulk Order & RFQ Screen
- **Role:** B2B Buyer (Corporate, Exporter, Government)
- **Purpose:** Submit custom Request for Quote (RFQ) for corporate gifts, hotel decor, or bulk export orders fulfilled by AI artisan clusters.
- **Entry Point:** Header link *"Corporate & Bulk Orders"* on `BUY-SCR-02`.
- **Exit Points:** Return to storefront or B2B dashboard.
- **UI Components:**
  - B2B Verified Banner: *"Direct Rural Sourcing — Scale without Exploitation"*.
  - Bulk RFQ Form:
    - Craft Discipline Selector (Handloom, Pottery, Paintings, Jute Bags, etc.).
    - Quantity Required Field (50 to 10,000+ units).
    - Target Delivery Date Picker.
    - Target Budget per Unit (e.g., `₹500`).
    - Customization Requirements (e.g., *"Custom corporate logo embossing on jute laptop bags"*).
    - Reference Sample Attachment Uploader.
    - Company GSTIN and Contact Person Phone/Email.
  - Submit RFQ Button: *"Request Cluster Proposal (Free 24h Turnaround)"*.
- **Actions:**
  - Fill RFQ parameters and submit.
- **Navigation:** Routes to confirmation screen.
- **Data:**
  - RFQ entity: `{ company_name, gstin, craft_category, quantity, target_date, budget_unit, specs }`.
- **API Requirements:** `POST /api/v1/b2b/rfq/submit`.
- **Loading State:** Processing RFQ submission spinner.
- **Empty State:** Form clean.
- **Error State:** Quantity < 50; warns: *"For orders under 50 units, please use our standard marketplace shopping cart."*
- **Success State:** Screen displays: *"RFQ Received! Our AI is matching artisan clusters in West Bengal and Bihar. You will receive a formal commercial quote within 24 hours."*
- **Permissions:** Requires B2B verified session.
- **Accessibility Requirements:** Standard accessible form controls.
- **Edge Cases:** Buyer requests 10,000 units with impossible 3-day deadline; form displays AI capacity warning: *"Producing 10,000 handwoven pieces requires a minimum of 25 days across 40 artisan clusters. Please adjust timeline."*

---

### `BUY-SCR-27`: Buyer Account Settings & Notification Preferences Screen
- **Screen Name:** Buyer Account Settings & Privacy Screen
- **Role:** B2C Buyer / B2B Buyer
- **Purpose:** Manage delivery addresses, email/SMS notification preferences, WhatsApp alerts, and DPDP Act data deletion rights.
- **Entry Point:** User menu *"Settings"*.
- **Exit Points:** Return to Home.
- **UI Components:**
  - Profile Card: Display Name, Email, Mobile Number, Verified Badge.
  - Notification Channels Preferences:
    - WhatsApp Order Updates (Toggle ON/OFF).
    - SMS Dispatch Alerts (Toggle ON/OFF).
    - Email Receipts & Stories (Toggle ON/OFF).
  - Saved Addresses Management link (`BUY-SCR-16`).
  - Privacy & DPDP Act Compliance Section:
    - Button: *"Download All My Personal Data (Data Portability)"*.
    - Button: 🗑️ *"Delete My Account & Personal Data (Right to Erasure)"*.
  - Log Out Button.
- **Actions:**
  - Toggle notification preferences.
  - Request data download.
  - Request account deletion.
- **Navigation:** Executes preference update.
- **Data:**
  - Buyer settings dictionary.
- **API Requirements:**
  - `GET /api/v1/buyer/settings`.
  - `PATCH /api/v1/buyer/settings`.
  - `POST /api/v1/privacy/request-erasure`.
- **Loading State:** Instant.
- **Empty State:** Not applicable.
- **Error State:** None.
- **Success State:** Toast alert: *"Settings updated."*
- **Permissions:** None.
- **Accessibility Requirements:** Semantic switches with audible state changes.
- **Edge Cases:** User initiates Right to Erasure while having an active order in transit; system explains: *"Account deletion will execute automatically after active orders are delivered and settled."*

---

## Section C: Admin Web Operations Portal Screens

---

### `ADM-SCR-01`: Admin Login & Multi-Factor TOTP Screen
- **Screen Name:** Staff Authentication & Multi-Factor Login Screen
- **Role:** Admin Staff (Operations, Finance, Moderation, Super Admin)
- **Purpose:** Enforce secure credential entry and 6-digit Time-Based One-Time Password (TOTP) for platform operators.
- **Entry Point:** Browser access to `admin.kalakarsetu.in`.
- **Exit Points:** Route to `ADM-SCR-02` (Operations Command Center).
- **UI Components:**
  - Centered Secure Staff Portal Card.
  - Username / Corporate Email Field.
  - Password Field (with masked toggle).
  - Multi-Factor TOTP Authenticator Code Field (6 digits).
  - Primary Button: *"Sign In to Operations Portal"*.
- **Actions:**
  - Enter credentials and TOTP token.
  - Tap Sign In.
- **Navigation:** Routes to `ADM-SCR-02`.
- **Data:**
  - Staff credentials, TOTP token, IP address.
- **API Requirements:** `POST /api/v1/admin/auth/login`.
- **Loading State:** Button shows spinner.
- **Empty State:** Form ready.
- **Error State:** Invalid TOTP code or unauthorized IP; red alert: *"Access denied. Invalid credentials or unauthorized network."*
- **Success State:** Issues 8-hour secure HTTP-only JWT and redirects.
- **Permissions:** Staff credentials with IP whitelisting.
- **Accessibility Requirements:** Standard web accessible form markup.
- **Edge Cases:** 3 consecutive failed login attempts; locks staff account for 30 minutes and notifies Super Admin security webhook.

---

### `ADM-SCR-02`: Operations Command Center & Executive Dashboard Screen
- **Screen Name:** Admin Executive Operations Dashboard Screen
- **Role:** Admin Staff
- **Purpose:** Real-time mission control showing Gross Merchandise Value (GMV), active artisan counts, pending moderation queues, and urgent fulfillment escalations.
- **Entry Point:** `ADM-SCR-01`.
- **Exit Points:** Navigation to any administrative module (`ADM-SCR-03` to `ADM-SCR-18`).
- **UI Components:**
  - Global Admin Header: Kalakar Setu Ops Emblem, Staff Name, Role Badge (`SUPER_ADMIN`), Active Notifications Bell, Logout.
  - Left Sidebar Navigation Menu: Dashboard, Users, Artisans, Catalog, Orders, B2B Clusters, Escrow & Finance, Moderation, Analytics, Settings.
  - Top Metric Cards (Real-time updates):
    - 💵 **GMV Today:** `₹4,82,900` across 318 orders (↑ 18%).
    - 👩‍🎨 **Artisans Active Online:** `4,120` across 18 states.
    - 🛡️ **Moderation Backlog:** `7 listings flagged` (Urgent).
    - ⚠️ **Delivery Escalations:** `2 parcels delayed >48h`.
    - 🤝 **Active B2B Clusters:** `14 ongoing (98% on-time)`.
  - Live Interactive Map of India: Real-time order dispatch animations showing lines from rural artisan districts to buyer metro cities.
  - Action Alert Tables: Quick links to pending KYC reviews and flagged listings.
- **Actions:**
  - Click any metric card to deep-link to corresponding management screen.
- **Navigation:** Routes across admin portal.
- **Data:**
  - Real-time platform KPI telemetry payload.
- **API Requirements:** `GET /api/v1/admin/dashboard/telemetry` (WebSocket live stream).
- **Loading State:** Shimmer grid.
- **Empty State:** Not applicable.
- **Error State:** Telemetry disconnect; shows reconnecting banner at top right.
- **Success State:** Real-time data streaming.
- **Permissions:** Role-based access control (RBAC).
- **Accessibility Requirements:** Desktop keyboard navigable dashboard with high-contrast data charts.
- **Edge Cases:** Sudden surge in orders (>500 orders/minute during national campaign); dashboard automatically throttles chart animations to maintain sub-100ms UI responsiveness.

---

### `ADM-SCR-03`: User & Facilitator Management Screen
- **Screen Name:** User & Field Facilitator Management Screen
- **Role:** Admin Staff
- **Purpose:** Inspect registered buyers, field facilitators, and NGO partner accounts, audit linked artisans, and enforce account actions.
- **Entry Point:** Admin sidebar navigation *"Users"*.
- **Exit Points:** Route to `ADM-SCR-04` (Facilitator Accreditation).
- **UI Components:**
  - Search & Filter Bar: Filter by Role (`Buyer`, `Facilitator`, `NGO Coordinator`), Status (`Active`, `Pending`, `Suspended`), District.
  - User Data Table:
    - User ID, Name, Phone, Role, Date Registered, Linked Artisans Count, Total GMV Generated, Actions.
  - Action Menu: View Full Profile, Delink Artisan, Suspend Account, Reset Access.
- **Actions:**
  - Search users, filter table, click facilitator to review credentials.
- **Navigation:** Routes to `ADM-SCR-04`.
- **Data:**
  - Paginated user list array.
- **API Requirements:** `GET /api/v1/admin/users?role={role}&page={page}`.
- **Loading State:** Table skeleton rows.
- **Empty State:** No users match query filters.
- **Error State:** Server error banner.
- **Success State:** Table rendered with pagination controls.
- **Permissions:** `SUPER_ADMIN`, `OPS_MODERATOR`.
- **Accessibility Requirements:** Proper table headers (`<th>`) with sorting indicators (`aria-sort`).
- **Edge Cases:** Facilitator account flagged for suspicious commission skimming; admin executes 1-click temporary freeze on facilitator while keeping all underlying artisan accounts active and safe.

---

### `ADM-SCR-04`: Facilitator Accreditation & Document Verification Screen
- **Screen Name:** Facilitator Accreditation & Verification Screen
- **Role:** Admin Staff
- **Purpose:** Review and approve field facilitator applications from NGO workers, SHG leaders, and CSC operators.
- **Entry Point:** `ADM-SCR-03` or pending queue notification.
- **Exit Points:** Return to `ADM-SCR-03`.
- **UI Components:**
  - Applicant Dossier:
    - Full Name, Phone Number, Operating District/State, Organization Name (e.g., *"Pradan NGO"*).
    - Claimed Artisan Network Size (e.g., *"45 weavers"*).
  - Document Viewer: Side-by-side inspection of uploaded NGO ID Card, Aadhaar copy, and official recommendation letter.
  - Decision Bar:
    - Button 1: 🟢 **Approve Facilitator & Issue Official QR Link Code**
    - Button 2: 🟡 **Request Additional Documents**
    - Button 3: 🔴 **Reject Application** (Mandatory rejection reason field).
- **Actions:**
  - Inspect documents (zoom/rotate).
  - Approve or reject application.
- **Navigation:** Returns to facilitator list.
- **Data:**
  - Facilitator application entity and document asset URLs.
- **API Requirements:** `POST /api/v1/admin/facilitators/{id}/adjudicate`.
- **Loading State:** Processing decision spinner.
- **Empty State:** No pending facilitator applications.
- **Error State:** Network failure banner.
- **Success State:** Approved; system generates unique facilitator QR link code and sends congratulatory SMS to facilitator phone.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Accessible document viewer controls.
- **Edge Cases:** Application has expired NGO registration; admin uses "Request Additional Documents" button, which sends automated WhatsApp request to applicant.

---

### `ADM-SCR-05`: Artisan KYC & Workshop Audit Verification Screen
- **Screen Name:** Artisan Manual KYC & Workshop Verification Screen
- **Role:** Admin Staff
- **Purpose:** Review manual artisan identity verification requests, workshop loom photos, and assign the verified artisan trust badge.
- **Entry Point:** Admin dashboard alert or sidebar *"Artisan KYC"*.
- **Exit Points:** Return to Artisan List (`ADM-SCR-06`).
- **UI Components:**
  - Artisan Profile Summary: Name, Phone, District, Craft Discipline (e.g., *"Bhagalpur Tussar Silk"*).
  - Evidence Gallery:
    - Photo 1: Artisan at loom/workshop.
    - Photo 2: Physical ID proof (Voter ID / PAN card).
    - Photo 3: Close-up craft sample.
  - Cross-Check Checklist:
    - `[x] Identity verified against government records`
    - `[x] Workshop photos show authentic handloom tools (no factory machines)`
    - `[x] Craft discipline matches declared district tradition`
  - Action Buttons:
    - 🟢 **Approve & Grant Verified Artisan Badge (✅)**
    - 🔴 **Reject Verification** (Voice feedback message sent to artisan).
- **Actions:**
  - Audit proof, check boxes, approve/reject.
- **Navigation:** Returns to queue.
- **Data:**
  - Artisan verification dossier payload.
- **API Requirements:** `POST /api/v1/admin/artisans/{id}/verify-kyc`.
- **Loading State:** Verification decision committing.
- **Empty State:** KYC queue clear (`0 pending`).
- **Error State:** Server error banner.
- **Success State:** Verified badge granted; artisan's listings receive search ranking boost.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** High-contrast review controls.
- **Edge Cases:** Machine-made powerloom fabric detected in workshop photo; admin rejects with reason *"Powerloom detected — Kalakar Setu exclusively supports 100% authentic handloom artisans"*.

---

### `ADM-SCR-06`: Artisan Health Scores & Performance Monitoring Screen
- **Screen Name:** Artisan Health Scores & Welfare Monitoring Screen
- **Role:** Admin Staff
- **Purpose:** Monitor artisan operational health (order acceptance rates, dispatch times, earnings velocity) and proactively assign field assistance to struggling artisans.
- **Entry Point:** Admin sidebar navigation *"Artisans"*.
- **Exit Points:** Route to `ADM-SCR-05`.
- **UI Components:**
  - Health Score Index Filter:
    - 🟢 Excellent (Score 80–100)
    - 🟡 Needs Attention (Score 50–79)
    - 🔴 Critical / At Risk (Score < 50)
  - Artisan Performance Table:
    - Artisan Name, District, Acceptance Rate (%), On-Time Dispatch (%), Rating (Stars), Monthly Income (₹), Health Score (0–100).
  - Quick Action: **"Assign Local Facilitator to Visit"** (For artisans scoring < 50).
- **Actions:**
  - Filter table, inspect underperforming artisan, dispatch field agent.
- **Navigation:** Opens artisan dossier.
- **Data:**
  - Aggregated performance metrics array.
- **API Requirements:** `GET /api/v1/admin/artisans/health-index`.
- **Loading State:** Shimmer table.
- **Empty State:** No artisans in selected filter.
- **Error State:** None.
- **Success State:** Health scores rendered with color-coded progress meters.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Semantic table headers with descriptive aria-labels.
- **Edge Cases:** Artisan has zero sales for 45 days; system automatically assigns a marketing specialist to re-enhance photos and feature their craft in a curated collection.

---

### `ADM-SCR-07`: Product Catalog Governance & Quality Audit Screen
- **Screen Name:** Catalog Governance & Craft Quality Audit Screen
- **Role:** Admin Staff
- **Purpose:** Audit published listings across categories, verify Geographical Indication (GI) claims, and correct taxonomy errors.
- **Entry Point:** Admin sidebar navigation *"Catalog"*.
- **Exit Points:** Route to `ADM-SCR-08` (Moderation Queue).
- **UI Components:**
  - Category Filter Tree: Craft Form → Sub-Category → State.
  - Product Catalog Table:
    - Thumbnail, Title in 3 languages, Artisan Name, Category, Price, GI Tag Status (`Verified` / `Pending`), Date Published.
  - Inline Audit Tool:
    - Edit Category / Tags.
    - Toggle GI Tag Verified Badge.
    - Delist Product (with reason).
- **Actions:**
  - Search products, edit metadata, certify GI status.
- **Navigation:** Returns to catalog table.
- **Data:**
  - Catalog listing records.
- **API Requirements:** `PATCH /api/v1/admin/catalog/products/{id}`.
- **Loading State:** Shimmer rows.
- **Empty State:** No products match category.
- **Error State:** Server error banner.
- **Success State:** Metadata updated across search index.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Table markup standards.
- **Edge Cases:** Listing uses protected GI Tag term *"Kullu Shawl"* but artisan is based in another state; admin audits provenance and reclassifies craft correctly to prevent legal non-compliance.

---

### `ADM-SCR-08`: AI Content Moderation Queue & Flagged Items Screen
- **Screen Name:** AI Content Moderation Queue Screen
- **Role:** Admin Staff (Moderator)
- **Purpose:** Triage listings flagged by automated AI safety models (copyright matches, inappropriate content, counterfeit claims, unrealistic pricing).
- **Entry Point:** Admin dashboard alert banner or sidebar *"Moderation"*.
- **Exit Points:** Return to `ADM-SCR-02`.
- **UI Components:**
  - Flagged Queue Counter: *"7 Items Pending Human Triage"*.
  - Flagged Item Review Card:
    - Product Photo with flagged region highlighted in red bounding box.
    - AI Flag Reason: e.g., *"Confidence 0.88: Potential trademark violation / factory logo match"*.
    - Artisan Name and Listing Title.
    - Side-by-Side Comparison with reference database.
  - Decision Action Bar:
    - 🟢 **Approve Listing (False Positive - Release to Live Market)**
    - 🟡 **Request Artisan to Retake Photo** (Voice prompt generated)
    - 🔴 **Reject & Delete Listing** (Violation confirmed).
- **Actions:**
  - Inspect flag evidence, click decision button.
- **Navigation:** Advances automatically to next item in queue.
- **Data:**
  - Moderation queue item payload with AI confidence scores.
- **API Requirements:** `POST /api/v1/admin/moderation/{id}/adjudicate`.
- **Loading State:** Card transitions to next item with slide animation.
- **Empty State:** Queue empty: *"Inbox Zero! All flagged listings have been resolved."*
- **Error State:** Server error banner.
- **Success State:** Item processed; search index updated instantly.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Hotkey navigation (Key `A` for Approve, Key `R` for Reject) for rapid accessible triage.
- **Edge Cases:** Artisan uploads a photo containing their young child sitting beside the loom; vision model flags face; moderator inspects, confirms innocent family context, and approves listing.

---

### `ADM-SCR-09`: Order Monitoring & Delayed Shipment Radar Screen
- **Screen Name:** Order Supervision & Delayed Dispatch Radar Screen
- **Role:** Admin Staff
- **Purpose:** Real-time monitoring of all active orders across India with automated radar alerts for orders stuck in dispatch (>48h) or delayed in transit.
- **Entry Point:** Admin sidebar navigation *"Orders"*.
- **Exit Points:** Route to `ADM-SCR-10` (Disputes).
- **UIComponents:**
  - Delayed Orders Radar Alert Box: Highlighting shipments exceeding SLA thresholds.
  - Order Master Table:
    - Order ID, Buyer Name, Artisan Name & District, Status, Courier Partner, Days in Transit, SLA Status (`On Track` / `At Risk` / `Delayed`).
  - Rapid Intervention Action Drawer:
    - Button 1: 📱 *"Send Priority WhatsApp Reminder to Artisan"*
    - Button 2: 📮 *"Escalate with India Post Postal Nodal Officer"*
    - Button 3: 💬 *"Send Apology & Updated ETA to Buyer"*
- **Actions:**
  - Filter by delay status, trigger automated postal intervention.
- **Navigation:** Deep-links to full order telemetry.
- **Data:**
  - Orders monitoring data stream.
- **API Requirements:** `GET /api/v1/admin/orders/supervision`.
- **Loading State:** Live table updates.
- **Empty State:** No delayed orders: *"All 318 shipments currently on schedule."*
- **Error State:** Network error banner.
- **Success State:** Intervention dispatched.
- **Permissions:** `OPS_MODERATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Accessible status indicators with text equivalents.
- **Edge Cases:** Flood in Assam stops postal movement; admin triggers batch notification to all 42 affected buyers with 1 click, preventing panic return requests.

---

### `ADM-SCR-10`: Return Dispute Adjudication & Insurance Claims Screen
- **Screen Name:** Return Dispute Adjudication & Insurance Claims Screen
- **Role:** Admin Staff
- **Purpose:** Review buyer return claims for damaged craft goods, inspect photo evidence, determine financial liability, and execute transit insurance payouts.
- **Entry Point:** Admin dashboard dispute alert or sidebar *"Disputes"*.
- **Exit Points:** Return to `ADM-SCR-09`.
- **UI Components:**
  - Dispute Dossier:
    - Order ID, Product Title, Total Price (`₹2,150`), Escrow Hold Status (`FROZEN`).
    - Buyer Claim: *"Arrived shattered in pieces"* (with 2 uploaded photos of damaged parcel).
    - Artisan Original Dispatch Photo comparison.
  - Liability Adjudication Panel:
    - `( ) Transit Damage (Logistics Insurance Covers 100% - Buyer Refunded, Artisan Paid Full)`
    - `( ) Artisan Defect (Artisan at fault - Buyer Refunded, Deducted from future payout)`
    - `( ) Frivolous / False Claim (Buyer at fault - Return Denied, Escrow Released to Artisan)`
  - Decision CTA Button: *"Execute Adjudication & Settle Escrow"*.
- **Actions:**
  - Review damage photos, select liability verdict, settle escrow.
- **Navigation:** Returns to dispute queue.
- **Data:**
  - Dispute evidence package and insurance claim parameters.
- **API Requirements:** `POST /api/v1/admin/disputes/{id}/settle`.
- **Loading State:** Settle transaction in progress.
- **Empty State:** Dispute queue clear (`0 active disputes`).
- **Error State:** Financial ledger lock error; prompts supervisor review.
- **Success State:** Escrow resolved; refund initiated to buyer; artisan protected by platform transit insurance.
- **Permissions:** `FINANCE_CONTROLLER`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Accessible review interface.
- **Edge Cases:** Broken terracotta craft; claim approved under transit insurance; buyer is instructed not to ship broken shards back to avoid unnecessary return shipping costs.

---

### `ADM-SCR-11`: B2B RFQ Review & Cluster Formation Orchestrator Screen
- **Screen Name:** B2B Bulk RFQ & Cluster Formation Orchestrator Screen
- **Role:** Admin Staff (B2B Facilitator)
- **Purpose:** Review incoming corporate/government bulk RFQs, inspect AI-recommended artisan clusters, fine-tune quota allocations, and issue formal B2B proposals.
- **Entry Point:** Admin sidebar navigation *"B2B Clusters"*.
- **Exit Points:** Route to `ADM-SCR-12` (Active Clusters).
- **UI Components:**
  - RFQ Details Card:
    - Client: *"Tata Consultancy Services (Diwali Gifting)"*.
    - Product: Jute & Khadi Laptop Sleeves.
    - Quantity: `2,000 units`. Target Date: `25 Days`. Budget: `₹400/unit` (`₹8,00,000 total`).
  - AI Cluster Formation Proposal Panel:
    - Recommended Cluster: 12 Artisans in Murshidabad Cluster, West Bengal.
    - Collective Capacity: `120 units/day`.
    - Reliability Score: `96%`.
    - Recommended Lead Artisan / SHG Coordinator: *"Amina Bibi (Murshidabad Mahila Samiti)"*.
  - Interactive Artisan Quota Allocation Table:
    - Artisan Name, Current Active Load, Proposed Quota (e.g., `150 units`), Unit Rate (`₹360`), Total Pay (`₹54,000`).
  - Action Bar:
    - Button 1: 🟢 **Approve & Broadcast Production Brief to 12 Artisans**
    - Button 2: ✏️ **Rebalance Quotas**
    - Button 3: 📄 **Generate Commercial GST Quotation (PDF)**
- **Actions:**
  - Adjust quotas, assign cluster lead, broadcast brief.
- **Navigation:** Advances to `ADM-SCR-12`.
- **Data:**
  - B2B RFQ entity, AI cluster candidate matching matrix.
- **API Requirements:**
  - `POST /api/v1/admin/b2b/rfq/{id}/generate-cluster`.
  - `POST /api/v1/admin/b2b/rfq/{id}/broadcast`.
- **Loading State:** Cluster optimization algorithm running.
- **Empty State:** No new RFQs pending.
- **Error State:** Insufficient artisan capacity in single district; system suggests federated multi-cluster across 2 neighboring districts.
- **Success State:** Production brief dispatched to all 12 artisan mobile apps simultaneously.
- **Permissions:** `B2B_FACILITATOR`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Keyboard accessible quota adjustment inputs.
- **Edge Cases:** Corporate buyer requires strict ISO quality compliance; admin attaches specialized visual QC inspection checklist to the digital production brief.

---

### `ADM-SCR-12`: Active Cluster Progress & Quality Checkpoint Screen
- **Screen Name:** Active Artisan Cluster Production & QC Monitoring Screen
- **Role:** Admin Staff
- **Purpose:** Track real-time milestone photo submissions across multi-artisan clusters, monitor quality checkpoints, and approve consolidated bulk dispatches.
- **Entry Point:** `ADM-SCR-11` or sidebar *"B2B Clusters"*.
- **Exit Points:** Return to `ADM-SCR-11`.
- **UI Components:**
  - Active Cluster Master Card:
    - Order: `#CLUST-2026-DIWALI-04` (2,000 units).
    - Overall Progress Meter: `64% Completed (1,280 / 2,000 units)`.
    - Days Remaining: `11 Days (Pace: +2 days ahead of schedule)`.
  - Artisan Progress Matrix Table:
    - 12 rows showing individual artisan photo submissions, completion %, and QC review status.
  - Quality Photo Inspection Gallery: Zoom in on submitted batch proof photos.
  - Phased Escrow Milestone Release Button:
    - *"Release 50% Milestone Payment (₹2,40,000 across 12 artisans)"*.
- **Actions:**
  - Inspect milestone photos, approve QC, release tranche payments.
- **Navigation:** Returns to cluster list.
- **Data:**
  - Cluster production tracking stream.
- **API Requirements:** `POST /api/v1/admin/clusters/{id}/milestone-approve`.
- **Loading State:** Approval processing spinner.
- **Empty State:** Not applicable.
- **Error State:** 1 artisan in cluster lagging behind schedule; admin clicks *"Reallocate 30 units to Standby Artisan"* to protect overall delivery deadline.
- **Success State:** Tranche payout deposited to artisans.
- **Permissions:** `B2B_FACILITATOR`, `FINANCE_CONTROLLER`.
- **Accessibility Requirements:** Table standards and photo alt tags.
- **Edge Cases:** Corporate buyer requests mid-production video inspection; admin streams live video conference with village cluster lead directly through portal.

---

### `ADM-SCR-13`: Escrow Account Reconciliation & Financial Ledger Screen
- **Screen Name:** Nodal Escrow Reconciliation & Financial Ledger Screen
- **Role:** Admin Staff (Finance Controller)
- **Purpose:** Audit platform nodal escrow account balances, monitor 5% commission revenue accrual, and reconcile bank deposits against delivered orders.
- **Entry Point:** Admin sidebar navigation *"Escrow & Finance"*.
- **Exit Points:** Route to `ADM-SCR-14` (Batch Payouts).
- **UI Components:**
  - Escrow Health KPI Cards:
    - 🏦 **Nodal Escrow Bank Balance:** `₹48,20,400`
    - 🔒 **Total Funds Locked (Orders in transit):** `₹32,10,000`
    - 🟢 **Funds Cleared for Payout Today:** `₹14,10,400`
    - 💼 **Platform Commission Retained (5%):** `₹2,00,000`
    - ⚖️ **Reconciliation Variance:** **`₹0.00 (100% Balanced)`**
  - Daily Inflow vs. Outflow Reconciliation Table.
  - Discrepancy Alerts Box (Renders if any payment gateway webhook is missing).
  - Primary CTA: *"Proceed to Batch IMPS Payout Sign-Off"* (`ADM-SCR-14`).
- **Actions:**
  - Review ledger, export financial CSV reports, advance to payout sign-off.
- **Navigation:** Routes to `ADM-SCR-14`.
- **Data:**
  - Banking reconciliation ledger payload.
- **API Requirements:** `GET /api/v1/admin/finance/escrow-reconciliation`.
- **Loading State:** Banking ledger querying progress.
- **Empty State:** Not applicable.
- **Error State:** Gateway variance detected; system highlights specific order ID and prevents batch payout sign-off until discrepancy is resolved.
- **Success State:** Ledger verified and balanced.
- **Permissions:** `FINANCE_CONTROLLER`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Full financial table accessibility.
- **Edge Cases:** Bank maintenance window at midnight; system schedules automated batch execution for 06:00 AM IST.

---

### `ADM-SCR-14`: Batch IMPS Payout Sign-Off Screen
- **Screen Name:** Daily Artisan Batch Payout Authorization Screen
- **Role:** Admin Staff (Finance Controller)
- **Purpose:** Authorized dual-control sign-off to disburse accumulated funds from platform escrow directly to verified artisan bank accounts via IMPS.
- **Entry Point:** `ADM-SCR-13`.
- **Exit Points:** Return to `ADM-SCR-13`.
- **UI Components:**
  - Batch Summary Card:
    - Date: `03 September 2026`.
    - Total Artisans Receiving Payout: `184 Artisans`.
    - Total Disbursal Amount: `₹14,10,400`.
    - Average Payout per Artisan: `₹7,665`.
  - Batch Recipient Table: Artisan Name, Bank Name, Masked Account, Net Amount, Delivered Order IDs.
  - Dual-Authorization Security Challenge:
    - Finance Controller Digital Signature / TOTP Code.
  - Final CTA Button: 💰 *"Authorize Instant IMPS Batch Disbursement"*.
- **Actions:**
  - Inspect batch recipients, input security token, authorize release.
- **Navigation:** Returns to `ADM-SCR-13` with confirmation report.
- **Data:**
  - Batch disbursement payload.
- **API Requirements:** `POST /api/v1/admin/finance/payouts/execute-batch`.
- **Loading State:** Processing IMPS transfers through banking API gateway.
- **Empty State:** No cleared payouts ready today.
- **Error State:** Banking API failure; partial batch execution handled idempotently with detailed failed transaction report.
- **Success State:** Transfers completed; 184 artisan phones trigger coin-drop celebration sound simultaneously.
- **Permissions:** Dual-authorization required: `FINANCE_CONTROLLER` + `SUPER_ADMIN`.
- **Accessibility Requirements:** High-contrast confirmation modal.
- **Edge Cases:** An individual artisan's bank account was closed yesterday; bank returns error code `R03`; batch succeeds for remaining 183 artisans, and failed ₹2,000 is safely retained in escrow reserve while alert is dispatched to artisan's app.

---

### `ADM-SCR-15`: Marketing Content Management System (CMS) & Curations Screen
- **Screen Name:** Marketing CMS & Homepage Curations Screen
- **Role:** Admin Staff (Content Manager)
- **Purpose:** Curate homepage hero banners, organize seasonal festival shops, feature artisan stories, and manage localized editorial collections.
- **Entry Point:** Admin sidebar navigation *"CMS & Marketing"*.
- **Exit Points:** Return to `ADM-SCR-02`.
- **UI Components:**
  - Homepage Layout Builder (Drag-and-drop section reordering):
    - Hero Carousel Section.
    - Festival Shop (e.g., *"Diwali Handcrafted Decor"*).
    - Featured Craft Tradition Spotlight.
    - Artisan of the Week Story.
  - Banner Uploader: Image, Heading (in 8 languages), Target Deeplink URL.
  - Curated Collection Product Picker: Search and add specific product IDs to curated shelves.
  - Publish Changes Button.
- **Actions:**
  - Drag sections, upload banners, add products, publish to CDN.
- **Navigation:** Returns to dashboard.
- **Data:**
  - Homepage layout JSON schema.
- **API Requirements:** `PUT /api/v1/admin/cms/homepage-layout`.
- **Loading State:** Saving layout and purging CDN cache progress bar.
- **Empty State:** Clean layout template.
- **Error State:** Broken link in banner; validation blocks publish.
- **Success State:** Changes live across all buyer web and mobile apps in <5 seconds.
- **Permissions:** `CONTENT_ADMIN`, `SUPER_ADMIN`.
- **Accessibility Requirements:** Mandatory alt-text input fields for every marketing image uploaded.
- **Edge Cases:** Multilingual translation missing for hero banner; CMS automatically invokes translation API to generate missing Hindi and regional banners before publishing.

---

### `ADM-SCR-16`: Platform Analytics, Heatmaps & Policy Export Screen
- **Screen Name:** Platform Analytics, Cluster Heatmaps & Policy Reports Screen
- **Role:** Admin Staff / Ministry Stakeholder
- **Purpose:** View macro-economic impact metrics, artisan income uplift graphs, district-level craft cluster heatmaps, and export official reports for Ministry of Textiles and ONDC.
- **Entry Point:** Admin sidebar navigation *"Analytics"*.
- **Exit Points:** Return to `ADM-SCR-02`.
- **UI Components:**
  - Economic Impact KPI Cards:
    - 📈 **Average Artisan Monthly Income Increase:** `+84%` vs. pre-platform baseline.
    - 👩‍🎨 **Female Artisan Representation:** `68%` of active sellers.
    - 💰 **Total Wealth Transferred to Rural Makers:** `₹4.2 Crores`.
  - Geographic Craft Density Heatmap of India: Shaded choropleth map showing artisan density, order volumes, and fulfillment speeds across 700+ districts.
  - Craft Discipline Growth Charts: Bar charts comparing handloom vs. pottery vs. painting sales volumes over time.
  - Policy Report Export Box:
    - Button 1: 📄 *"Export Ministry of Textiles Quarterly Impact Report (PDF)"*
    - Button 2: 📊 *"Export ONDC Network Participation Data (CSV)"*
- **Actions:**
  - Filter date ranges, toggle map layers, export reports.
- **Navigation:** Downloads generated reports.
- **Data:**
  - Macro analytics warehouse aggregated metrics.
- **API Requirements:** `GET /api/v1/admin/analytics/impact-report`.
- **Loading State:** Rendering data visualization charts.
- **Empty State:** Not applicable.
- **Error State:** Query timeout on 5-year historical view; prompts user to select 1-year window.
- **Success State:** Charts and maps interactive.
- **Permissions:** `SUPER_ADMIN`, `MINISTRY_AUDITOR`.
- **Accessibility Requirements:** All charts accompanied by accessible data tables (`role="table"`).
- **Edge Cases:** Ministry auditor needs air-gapped data; export function generates cryptographically signed PDF with tamper-proof SHA-256 hash.

---

### `ADM-SCR-17`: Platform Settings & System Configuration Screen
- **Screen Name:** Platform System Configuration & Policy Rules Screen
- **Role:** Super Admin
- **Purpose:** Configure global business rules: commission percentage (default 5%), minimum fair wage hourly multipliers, auto-cancel timers, and gateway configurations.
- **Entry Point:** Admin sidebar navigation *"Settings"*.
- **Exit Points:** Return to `ADM-SCR-02`.
- **UI Components:**
  - Policy Rule Form:
    - Platform Commission Rate (%): `5.0%`.
    - Order Acceptance Auto-Cancel Window: `24 Hours`.
    - Buyer Return Window: `48 Hours post-delivery`.
    - Minimum Labor Wage Index Multiplier per State (Table of state rates).
    - ONDC Network Integration: Toggle `[ ENABLED as Seller App (SNP) ]`.
    - SMS & WhatsApp Gateway API Credentials & Quotas.
  - Save System Configuration Button (Requires Super Admin Password).
- **Actions:**
  - Modify parameters and commit.
- **Navigation:** Returns to dashboard.
- **Data:**
  - Global system config key-value dictionary.
- **API Requirements:** `PUT /api/v1/admin/system/config`.
- **Loading State:** Saving config and restarting worker queues.
- **Empty State:** Not applicable.
- **Error State:** Commission set below 0% or above 15%; validation blocks save.
- **Success State:** Toast alert: *"Global platform rules updated successfully."*
- **Permissions:** Restricted strictly to `SUPER_ADMIN`.
- **Accessibility Requirements:** Standard form accessibility.
- **Edge Cases:** Commission rate changed; rule is non-retroactive and applies strictly to orders initiated after the timestamp of change.

---

### `ADM-SCR-18`: Admin Audit Logs & Staff Security Screen
- **Screen Name:** Staff Activity Audit Trail & Security Logs Screen
- **Role:** Super Admin
- **Purpose:** Immutable audit log tracking every administrative action (KYC approvals, catalog deletions, payout sign-offs, config changes) for compliance and governance.
- **Entry Point:** Admin sidebar navigation *"Audit Logs"*.
- **Exit Points:** Return to `ADM-SCR-02`.
- **UI Components:**
  - Search & Filter Controls: Filter by Staff Member, Action Type (`PAYOUT_AUTHORIZATION`, `KYC_APPROVAL`, `LISTING_DELETE`), Date Range, IP Address.
  - Immutable Audit Log Table:
    - Timestamp (UTC + IST), Staff Email, Role, Action Performed, Target Entity ID, IP Address, Cryptographic Hash.
  - Export Audit Trail Button (CSV/JSON).
- **Actions:**
  - Inspect audit records, search actions.
- **Navigation:** Returns to dashboard.
- **Data:**
  - Append-only audit log stream.
- **API Requirements:** `GET /api/v1/admin/security/audit-logs`.
- **Loading State:** Log table loading.
- **Empty State:** No logs match query.
- **Error State:** Log service unreachable; raises high-severity security alert.
- **Success State:** Logs displayed.
- **Permissions:** Strictly restricted to `SUPER_ADMIN`.
- **Accessibility Requirements:** Accessible data table.
- **Edge Cases:** Attempt to alter audit log database; system uses write-once-read-many (WORM) cloud storage and triggers immediate intrusion alert if row hashes do not match.

---

*End of Complete Screen Specification — Kalakar Setu Platform*
