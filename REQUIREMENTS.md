# Kalakar Setu — Functional Requirements Specification
## कला से बाज़ार तक | From Craft to Market

> **Document Type:** Functional Requirements Specification (FRS)  
> **Version:** 1.0  
> **Date:** 2026-09-03  
> **Status:** 🟡 Awaiting Product Owner Review  
> **Source:** [PRODUCT_DISCOVERY.md](file:///C:/Users/rauts/.gemini/antigravity-ide/brain/7f047ae3-caea-4c32-ad4a-20d6faf750da/PRODUCT_DISCOVERY.md) — All 21 decisions approved with recommended options  

---

## Approved Decisions Summary

All requirements below are written against the following locked decisions:

| Decision | Approved Option |
|---|---|
| D1 Facilitator role | Formal role, dedicated mode in artisan app |
| D2 Cluster Lead | Auto-assign + voluntary opt-in |
| D3 Aadhaar verification | Tiered (list without, verify for payout + badge) |
| D4 Order model | Hybrid (ready stock + made to order) |
| D5 Buyer platform | Android app for artisans; responsive web + mobile app for buyers |
| D6 Admin platform | Web dashboard only |
| D7 B2B pricing | AI-suggested bulk price + artisan confirm |
| D8 Cluster QC | Layered (self-report + facilitator QC > ₹50K + buyer sample > ₹2L) |
| D9 Catalog review | Auto-publish + AI moderation flags |
| D10 Lifestyle images | Phase 2 (clean backgrounds only for MVP) |
| D11 STT engine | Bhashini primary + Google Cloud STT fallback |
| D12 Launch languages | Hindi + English + 2 regional (TBD pilot regions) |
| D13 Commission | 5% hybrid + optional premium features |
| D14 WhatsApp API | P1 (not in MVP launch) |
| D15 Multi-artisan shipping | Separate shipments (MVP); buyer chooses (Phase 2) |
| D16 Payment gateway | Razorpay or Cashfree (final TBD on pricing) |
| D17 Logistics | Aggregator (Shiprocket) + India Post integration |
| D18 Return policy | Conditional (defects/damage/wrong item only) |
| D19 ONDC | Yes, as Seller Network Participant (Phase 2) |
| D20 Multi-profile | Yes, PIN/voice switching on single device |
| D21 Offline strategy | Moderate for MVP; heavy (on-device AI) for Phase 2 |

---

## Priority Definitions

| Priority | Meaning | MVP? |
|---|---|---|
| **P0** | Absolutely required for the product to function. Without these, the product cannot launch. | ✅ Yes |
| **P1** | Important for a complete experience. Missing these makes the product feel incomplete but it can still function. | ⚠️ Strongly recommended |
| **P2** | Enhancement. Adds delight or efficiency but is not blocking. | ❌ Phase 2+ |

---

## Table of Contents

1. [Onboarding & Authentication](#1-onboarding--authentication)
2. [AI Catalog Creation](#2-ai-catalog-creation)
3. [AI Image Enhancement](#3-ai-image-enhancement)
4. [Voice Interaction System](#4-voice-interaction-system)
5. [Dynamic Pricing Engine](#5-dynamic-pricing-engine)
6. [Product Publishing & Digital Craft Passport](#6-product-publishing--digital-craft-passport)
7. [Product Discovery & Search](#7-product-discovery--search)
8. [Order Management](#8-order-management)
9. [Payments & Payouts](#9-payments--payouts)
10. [Delivery & Logistics](#10-delivery--logistics)
11. [Returns, Refunds & Disputes](#11-returns-refunds--disputes)
12. [Reviews, Trust & Ratings](#12-reviews-trust--ratings)
13. [Notifications](#13-notifications)
14. [Analytics & Insights](#14-analytics--insights)
15. [Support](#15-support)
16. [Multilingual Support](#16-multilingual-support)
17. [Offline & Sync](#17-offline--sync)
18. [Security & Privacy](#18-security--privacy)
19. [Accessibility & Low-Literacy UX](#19-accessibility--low-literacy-ux)
20. [Admin Platform](#20-admin-platform)
21. [Cross-Reference Matrix](#21-cross-reference-matrix)

---

## 1. Onboarding & Authentication

---

### REQ-1.1: Artisan Onboarding 🟢 P0

**Purpose:** Enable an artisan with low/no digital literacy to create an account and set up their seller profile using voice and taps — no typing required.

**User:** Artisan

**Preconditions:**
- Android device (9+) with working camera and microphone
- Active phone number capable of receiving SMS OTP
- App installed from Play Store or sideloaded

**User Actions:**
1. Opens app for the first time
2. Selects preferred language from a visual grid (flag + script name + voice label auto-playing on hover)
3. Enters phone number via numpad
4. Receives and enters OTP (auto-read if permission granted)
5. Speaks their name when prompted ("Apna naam bataiye")
6. Confirms auto-detected location on map, or adjusts by voice/pin-drop
7. Selects craft type(s) from an icon grid (e.g., 🧵 Handloom, 🏺 Pottery, 🎨 Painting)
8. Optionally takes a selfie for profile
9. Optionally states years of experience by voice
10. Optionally links to a facilitator via scan-code or phone number
11. Views 3-screen animated tutorial (auto-playing voice narration, swipeable)
12. Taps "List My First Product" button — camera opens

**System Behavior:**
- Language selection triggers UI localization + sets default voice I/O language
- OTP auto-read via SMS Retriever API (Android)
- Name captured via STT, displayed for visual confirmation
- Location detected via GPS with district-level fallback if GPS is imprecise
- Craft type selection pre-loads relevant AI models and follow-up question sets
- Profile created with "Unverified" status
- Tutorial screens are skippable but auto-play voice for each
- On completion, artisan lands on empty home screen with prominent "Add Product" CTA

**Success State:**
- Artisan profile created and persisted (cloud + local cache)
- Home screen displayed with "Add your first product" prompt (voice + visual)
- Artisan can immediately begin creating a listing

**Loading State:**
- OTP verification shows a spinner with "Verifying…" in local language
- Profile creation shows progress animation: "Setting up your shop…"

**Empty State:**
- Home screen with zero products: illustration of a market stall with "Your shop is empty — let's add your first product!" voice message + large camera button

**Error States:**
| Error | Handling |
|---|---|
| OTP not received | "Didn't get the code? Try again" button; after 3 failures, offer voice-call OTP |
| GPS unavailable | Fall back to manual district/state selection via voice or dropdown |
| STT fails for name | Show keyboard input as fallback; accept typed name |
| Network down during registration | Save partial profile locally; complete registration when online |
| Duplicate phone number | "This number is already registered. Want to log in instead?" |

**Edge Cases:**
- Shared phone: After onboarding, prompt "Is anyone else using this phone to sell?" → multi-profile setup
- Minor (under 18): If stated age < 18, prompt for guardian phone number for verification linkage
- No SIM (WiFi-only): Allow registration but warn that SMS notifications won't work; suggest adding a number later

**Data Required:**
- Phone number (mandatory)
- Name (mandatory, via voice)
- Language preference (mandatory)
- Location — lat/long + district + state + pincode (mandatory, auto-detected or manual)
- Craft type(s) (mandatory, from predefined list)
- Profile photo (optional)
- Years of experience (optional)
- Facilitator link code (optional)
- SHG / cooperative name (optional)

**Dependencies:**
- SMS OTP service (Firebase Auth or custom)
- STT engine (Bhashini / Google Cloud)
- GPS / location services
- Craft type taxonomy (predefined data)

---

### REQ-1.2: Artisan Aadhaar Verification (Tiered) 🟡 P1

**Purpose:** Verify artisan identity via Aadhaar to unlock payouts and "Verified Artisan" trust badge. Not required at onboarding — triggered when artisan attempts first withdrawal or opts in.

**User:** Artisan (existing, unverified)

**Preconditions:**
- Artisan has a completed profile (REQ-1.1)
- Artisan has an Aadhaar number
- Network connectivity available

**User Actions:**
1. Triggered automatically at first payout attempt, or manually from Profile → "Get Verified" badge
2. Enters 12-digit Aadhaar number via numpad
3. Receives OTP on Aadhaar-linked mobile
4. Enters OTP
5. (Optional) Takes a live selfie for face-match

**System Behavior:**
- Aadhaar verification via UIDAI DigiLocker API or e-KYC API
- Face-match (if selfie provided) via AI comparison with Aadhaar photo
- On success: artisan status changes to "Verified", badge displayed on profile and all listings
- Aadhaar number is NOT stored — only a verification token and verified status
- Verified artisans get +15% boost in search ranking (configurable)

**Success State:**
- "Verified Artisan ✅" badge appears on profile
- Payouts unlocked
- Voice confirmation: "Aapki pehchaan verify ho gayi! Ab aap payment le sakte hain"

**Loading State:**
- "Verifying your identity… please wait" with progress animation

**Error States:**
| Error | Handling |
|---|---|
| Aadhaar OTP not received | Retry with voice-call OTP option |
| Aadhaar number mismatch | "The details don't match. Please check your Aadhaar number" |
| UIDAI service down | Queue verification; notify artisan when complete |
| Face match fails | Route to manual admin review queue |

**Edge Cases:**
- Artisan doesn't have Aadhaar: Allow alternative ID (Voter ID, PAN) with manual admin verification — longer processing time
- Artisan's Aadhaar mobile is different from app phone number: Still works (OTP goes to Aadhaar-linked number)

**Data Required:**
- Aadhaar number (processed, not stored)
- Aadhaar-linked OTP
- Selfie (optional, for face match)
- Verification token (stored)

**Dependencies:**
- UIDAI DigiLocker / e-KYC API
- Face recognition model
- Admin review queue (for failures)

---

### REQ-1.3: B2C Buyer Onboarding 🟢 P0

**Purpose:** Enable consumers to create accounts and start browsing/buying with minimal friction.

**User:** B2C Buyer (web + mobile)

**Preconditions:**
- Access to web browser or mobile app
- Phone number or email address

**User Actions:**
1. Opens app/website
2. Can browse without account (guest browsing)
3. To purchase: taps "Sign In" → enters phone number or email
4. Receives OTP → enters it
5. Optionally sets display name and delivery address
6. Lands on home page with personalized recommendations

**System Behavior:**
- Guest browsing allowed for discovery (no account required)
- Account required only at checkout
- Social login options: Google (web + mobile)
- Profile auto-fills from Google account if social login used
- Delivery address saved for future orders
- Language auto-detected from device settings, changeable in settings

**Success State:**
- Buyer account created
- Can add items to cart, wishlist, and place orders
- Delivery address saved

**Loading State:**
- Standard OTP verification spinner

**Empty State:**
- Not applicable (home page always shows curated content)

**Error States:**
| Error | Handling |
|---|---|
| OTP failure | Retry + voice-call fallback |
| Network error during signup | Retry prompt |
| Duplicate account | Auto-login to existing account |

**Edge Cases:**
- International buyer: Accept international phone numbers; show pricing in INR with estimated USD/GBP equivalent
- Guest adds items to cart then signs up: Cart items preserved post-authentication

**Data Required:**
- Phone number or email (mandatory)
- Display name (optional)
- Delivery address(es) (optional at signup, required at checkout)

**Dependencies:**
- OTP service
- Google OAuth (optional)

---

### REQ-1.4: B2B Buyer Onboarding 🟡 P1

**Purpose:** Register and verify institutional buyers who need bulk ordering, RFQ, cluster ordering, and GST invoicing capabilities.

**User:** B2B Buyer (corporate, exporter, retailer, government)

**Preconditions:**
- Valid business entity with GSTIN
- Web browser access (desktop-first experience)

**User Actions:**
1. Navigates to "B2B / Bulk Orders" section on web
2. Fills registration form:
   - Company name
   - GSTIN
   - Contact person name, email, phone
   - Business type (dropdown: Corporate, Exporter, Retailer, Government, NGO, Other)
   - Estimated monthly volume
   - Craft categories of interest
3. Submits registration
4. Waits for verification (1–2 business days)
5. On approval, receives access to B2B dashboard

**System Behavior:**
- GSTIN auto-validated via GST API (company name, address auto-filled)
- Business verification: cross-check MCA (Ministry of Corporate Affairs) records
- Admin notified for manual approval of first-time B2B registrations
- On approval: B2B buyer sees bulk pricing, RFQ form, cluster ordering, and order tracking dashboard
- Rejected applications receive reason + option to resubmit

**Success State:**
- B2B account approved and active
- Buyer can create RFQs, place bulk orders, view bulk pricing
- GST-compliant invoicing enabled

**Loading State:**
- "Your application is being reviewed" status page with estimated timeline

**Empty State:**
- Dashboard with "Create your first RFQ" prompt

**Error States:**
| Error | Handling |
|---|---|
| Invalid GSTIN | "We couldn't verify this GSTIN. Please check and try again" |
| MCA data mismatch | Route to manual review |
| Application rejected | Reason provided + resubmit option |

**Edge Cases:**
- Government buyer without GSTIN: Accept DUNS number or other government ID; manual verification
- Exporter needing specific compliance documents: Flag at registration; admin follows up
- B2B buyer wants to test with a small order first: Allow single-item purchase at B2C prices before full B2B onboarding

**Data Required:**
- Company name, GSTIN, address (mandatory)
- Contact person details (mandatory)
- Business type (mandatory)
- Volume estimate (mandatory)
- Craft interests (optional)

**Dependencies:**
- GST verification API
- MCA records API (or manual verification)
- Admin approval workflow (REQ-20.x)

---

### REQ-1.5: Facilitator Onboarding 🟡 P1

**Purpose:** Enable NGO workers, SHG leaders, and CSC operators to register as facilitators who can onboard and manage multiple artisans.

**User:** Facilitator / Field Agent

**Preconditions:**
- Smartphone with app installed
- Affiliated with a recognized organization (NGO, SHG, CSC, government body)

**User Actions:**
1. Downloads artisan app
2. On language/role selection screen, selects "I am a Facilitator / सहायक"
3. Enters phone number + OTP
4. Provides: name, organization name, designation, location, number of artisans they work with
5. Provides organization verification (ID card photo, reference letter, or admin-issued invite code)
6. Waits for admin verification (24–48 hours)
7. On approval: sees Facilitator Dashboard with "Add Artisan" button

**System Behavior:**
- If invite code provided, auto-approved (admin pre-generated the code)
- Otherwise, admin review required
- Facilitator dashboard shows: linked artisans list, onboarding progress, order status for linked artisans, aggregate earnings
- Facilitator can create artisan accounts, assist with listings, and view (but not modify) artisan payouts
- Facilitators CANNOT receive artisan payments or modify artisan bank details

**Success State:**
- Facilitator profile active
- Can onboard artisans using their device
- Dashboard shows linked artisan metrics

**Loading State:**
- "Verification in progress" screen with estimated time

**Empty State:**
- "No artisans linked yet — tap 'Add Artisan' to start onboarding" with tutorial

**Error States:**
| Error | Handling |
|---|---|
| Invalid invite code | "This code is expired or invalid. Contact your administrator" |
| Verification rejected | Reason + option to reapply |

**Edge Cases:**
- Facilitator loses phone: New device login with OTP; all data synced from cloud
- Facilitator leaves organization: Admin can delink facilitator; artisans remain independent
- One artisan linked to multiple facilitators: Allowed (SHG leader + NGO worker can both assist)

**Data Required:**
- Phone number, name (mandatory)
- Organization name, designation (mandatory)
- Organization verification (invite code or document)
- Location (mandatory)

**Dependencies:**
- Admin approval workflow
- Invite code generation system
- Artisan-Facilitator linking system

---

### REQ-1.6: Multi-Profile Device Support 🟡 P1

**Purpose:** Allow multiple artisan profiles on a single device for shared-phone households and facilitator-assisted onboarding.

**User:** Artisan (shared phone), Facilitator

**Preconditions:**
- App installed with at least one profile created
- Second artisan's phone number available for OTP

**User Actions:**
1. From profile screen, taps "Switch Profile" or "Add Another Artisan"
2. New artisan authenticates with their own phone number + OTP
3. Sets a 4-digit PIN for quick profile switching
4. Or uses voice passphrase for authentication

**System Behavior:**
- Each profile is fully isolated: own listings, orders, payouts, analytics
- Profile switcher on lock screen shows profile photos/names
- Inactive profiles auto-lock after 5 minutes
- Maximum 10 profiles per device
- Each profile's data is encrypted separately on-device
- Facilitator profile can switch to any linked artisan without OTP (PIN only)

**Success State:**
- Multiple artisan profiles accessible via quick switch
- Each profile shows only its own data

**Loading State:**
- "Switching to [Name]'s profile…" with brief transition animation

**Error States:**
| Error | Handling |
|---|---|
| Wrong PIN | 3 attempts, then require OTP re-verification |
| Too many profiles | "Maximum 10 profiles reached. Please remove one to add another" |

**Edge Cases:**
- Artisan forgets PIN: OTP-based reset
- Facilitator's device is lost: All profiles accessible via OTP on new device; facilitator cannot access artisan data without artisan's OTP

**Data Required:**
- Per-profile: phone number, PIN, profile data
- Device-level: profile index, active profile ID

**Dependencies:**
- Encrypted per-profile local storage
- OTP service (per-profile)

---

## 2. AI Catalog Creation

---

### REQ-2.1: Product Photo Capture 🟢 P0

**Purpose:** Enable artisans to take product photos with voice-guided assistance to maximize image quality from entry-level phone cameras.

**User:** Artisan

**Preconditions:**
- Artisan has a completed profile
- Device camera functional
- Product available to photograph

**User Actions:**
1. Taps large camera icon (➕) or central FAB on home screen
2. Camera opens with voice guidance: "Apne product ko seedhi jagah rakhein, achchi roshni mein"
3. On-screen overlay shows product placement guide (centered rectangle)
4. AI real-time feedback:
   - "Thoda aur roshni chahiye — khidki ke paas le jaiye" (too dark)
   - "Phone sthir rakhein… 3, 2, 1" (stabilization countdown)
   - "Bahut achcha!" (good capture)
5. After first photo, prompt: "Ek aur photo side se lena chahenge?" (suggest additional angle)
6. Artisan can take 1–5 photos per product
7. Photos appear as thumbnails; artisan can delete/retake

**System Behavior:**
- Camera launches in product-optimized mode: auto-focus, auto-exposure
- Real-time AI analysis (on-device, lightweight model):
  - Brightness check (threshold: avg pixel value > 80)
  - Blur detection (Laplacian variance > threshold)
  - Object presence detection (is there a product in frame?)
  - Orientation check (landscape vs portrait suggestion based on product shape)
- Voice feedback generated on-device (pre-recorded phrases, no network needed)
- Photos saved at maximum device resolution, EXIF data preserved
- Photos stored locally until AI enhancement (REQ-3.1)

**Success State:**
- 1–5 product photos captured and saved locally
- Quality score per photo (green/yellow/red indicator)
- Transitions to voice description screen (REQ-2.2)

**Loading State:**
- Brief shutter animation after each capture
- Photo quality analysis: "Checking photo quality…" (< 1 second)

**Empty State:**
- Camera screen with placement guide overlay and voice prompt

**Error States:**
| Error | Handling |
|---|---|
| Camera permission denied | Voice: "Photo lene ke liye camera ki permission chahiye" + settings deeplink |
| Storage full | "Phone ki memory bhar gayi hai. Kuch purani photos delete karein" |
| All photos are low quality | "Yeh photos thodi dhundhli hain. Koshish karein roshni badhayen" — allow continuation with warning |

**Edge Cases:**
- Artisan uploads from gallery instead of camera: Allowed; same quality check applied
- Very small product (jewelry): Suggest macro/close-up framing; lower brightness threshold
- Artisan photographs multiple products: Warn "Ek photo mein ek hi product rakhein" if AI detects multiple objects
- Dark environment (no natural light): Lower thresholds; suggest flash; accept with enhancement flag

**Data Required:**
- Raw photo files (JPEG, max resolution)
- EXIF metadata (location, timestamp, device model)
- Quality scores (brightness, sharpness, object-detected)

**Dependencies:**
- On-device camera API
- On-device lightweight CV model (blur + brightness + object detection)
- Pre-recorded voice prompts (per language)

---

### REQ-2.2: Voice Product Description 🟢 P0

**Purpose:** Capture the artisan's product description in their mother tongue through natural speech, then use AI to extract structured product information.

**User:** Artisan

**Preconditions:**
- At least 1 product photo captured (REQ-2.1)
- Microphone permission granted
- Language preference set in profile

**User Actions:**
1. After photo capture, screen transitions to voice description
2. Large microphone button displayed with prompt: "Apne product ke baare mein bataiye — yeh kya hai, kis cheez se bana hai, kya khaas hai"
3. Artisan presses and holds mic button (or toggle mode: tap once to start, tap again to stop)
4. Speaks freely in their language for 10–120 seconds
5. Visual waveform shows that audio is being captured
6. On release/stop, system confirms: "Bahut achcha! Main samajh raha hoon…"

**System Behavior:**
- Audio captured at 16kHz mono WAV, stored locally
- If online: immediate STT processing via Bhashini API
  - Fallback: Google Cloud Speech-to-Text if Bhashini unavailable/low confidence
- If offline: audio stored locally, queued for STT processing when online
- STT result displayed as text in artisan's script (for literate artisans to verify)
- Voice readback of transcription: "Aapne yeh kaha: [transcription]. Kya yeh sahi hai?"
- NLU pipeline extracts:
  - Product type / category
  - Material(s)
  - Color(s)
  - Size / dimensions (if mentioned)
  - Technique / craft style
  - Special features
  - Quantity available
  - Time to produce

**Success State:**
- Voice description captured and transcribed
- Key entities extracted and displayed as editable chips/tags
- Transitions to AI follow-up questions (REQ-2.3)

**Loading State:**
- After recording: "Samajh raha hoon…" with animated waveform → text appearing

**Error States:**
| Error | Handling |
|---|---|
| Microphone permission denied | Voice prompt + settings deeplink |
| Too much background noise | "Thoda shant jagah mein bolein — awaaz saaf nahi aa rahi" |
| Recording too short (< 3 sec) | "Thoda aur bataiye — kya cheez hai, kis se bana hai?" |
| STT confidence < 60% | "Main samajh nahi paaya. Ek baar phir bataiye?" |
| Network unavailable for STT | Store audio; show "Will process when online" message |

**Edge Cases:**
- Artisan speaks mixed language (Hindi + regional): STT should handle code-switching; NLU extracts entities from both
- Artisan gives very brief description ("Yeh saree hai"): AI follow-up questions (REQ-2.3) fill the gaps
- Artisan gives very long description (5+ minutes): Gracefully truncate; extract key entities from first 2 minutes; inform artisan

**Data Required:**
- Audio file (WAV, stored locally until synced)
- STT transcription (original language)
- Extracted entities (JSON structure)
- Confidence scores per entity

**Dependencies:**
- Bhashini STT API (primary)
- Google Cloud Speech-to-Text (fallback)
- NLU entity extraction model
- On-device audio recording

---

### REQ-2.3: AI Follow-Up Questions 🟢 P0

**Purpose:** Ask contextual, conversational follow-up questions by voice to fill gaps in the product information — mimicking a friendly interviewer, not a form.

**User:** Artisan

**Preconditions:**
- Voice description captured (REQ-2.2)
- AI has analyzed photo(s) and voice transcription
- Entity extraction completed with identified gaps

**User Actions:**
1. AI speaks a follow-up question in artisan's language
2. Artisan responds by voice
3. AI confirms understanding and asks next question (or proceeds)
4. Repeat for 2–5 questions maximum
5. Artisan can say "Bas" / "Enough" / "Aage badho" to skip remaining questions

**System Behavior:**
- Question selection algorithm:
  1. Identify missing required fields (material, time, technique)
  2. Cross-reference with craft-type-specific question bank
  3. Skip questions answerable from photo analysis (e.g., color, approximate size)
  4. Prioritize: material → time → technique → quantity → special features
- Questions are phrased conversationally:
  - NOT: "Enter material type"
  - YES: "Yeh kis dhaage se buna hai — cotton, silk, ya kuch aur?"
- AI acknowledges each answer: "Achcha, cotton ka hai. Aur kitne din lagey isay banane mein?"
- "I don't know" is a valid answer — AI fills reasonable defaults or marks as "Not specified"
- Maximum 5 questions per listing session (to avoid fatigue)

**Success State:**
- All critical fields populated (material, time, category at minimum)
- Transitions to AI-generated listing review (REQ-2.4)

**Loading State:**
- Brief pause between questions: "Ek minute…" while processing response

**Error States:**
| Error | Handling |
|---|---|
| AI misunderstands answer | "Kya aapne [X] kaha? Agar nahi toh dobara bataiye" |
| Artisan gets frustrated | After 2 "I don't know" responses, skip remaining questions with defaults |
| Network drops mid-conversation | Cache questions locally; continue with pre-loaded question set |

**Edge Cases:**
- Artisan volunteers information not asked: NLU extracts it and skips relevant questions
- Craft type not in taxonomy: AI creates "Custom" category; admin review flags it for taxonomy update
- Artisan contradicts photo (says "silk" but photo analysis suggests "cotton"): Trust artisan's voice input; flag discrepancy for optional review

**Data Required:**
- Craft-type-specific question bank (per language)
- Entity gap analysis from REQ-2.2 extraction
- Follow-up audio recordings (stored)
- Updated entity map after Q&A

**Dependencies:**
- REQ-2.2 (voice description + entity extraction)
- Craft-type question bank (content asset)
- TTS engine for question delivery
- STT engine for answer capture

---

### REQ-2.4: AI Listing Generation 🟢 P0

**Purpose:** Automatically generate a complete, professional product listing in multiple languages from the photo, voice description, and follow-up Q&A data.

**User:** Artisan (consumer of output); System (generator)

**Preconditions:**
- Photos captured (REQ-2.1)
- Voice description transcribed (REQ-2.2)
- Follow-up Q&A completed (REQ-2.3)
- Network available (or queued for processing)

**User Actions:**
1. None — system generates automatically
2. Artisan waits briefly while AI composes the listing
3. Generated listing presented for review (REQ-2.5)

**System Behavior:**
- AI Catalog Engine (LLM-powered) receives:
  - Structured entities from voice + Q&A
  - Image analysis results (object classification, color, material inference)
  - Craft type context
- Generates:
  - **Title**: Concise, searchable, in 3 languages (artisan's language, Hindi, English)
    - Example: "Handwoven Cotton Madhubani Saree — Red & Black Floral Design"
  - **Description**: 100–200 word rich description in 3 languages, including:
    - What the product is
    - Materials and technique
    - Artisan's story snippet
    - Ideal use/occasion
    - Care instructions (inferred)
  - **Category + Subcategory**: Auto-mapped to platform taxonomy
  - **Tags**: 5–15 searchable tags (craft name, material, color, region, technique, occasion)
  - **Attributes**: Material, dimensions (estimated from image), weight (estimated), color
  - **Care instructions**: Inferred from material type
- Translation via LLM (Gemini / GPT-4) with craft-domain-specific fine-tuning
- If offline: queued; artisan notified when ready ("Aapki listing tayyar hai!")

**Success State:**
- Complete listing generated in 3 languages
- All fields populated (some with "estimated" tags)
- Listing presented to artisan for review

**Loading State:**
- "Creating your product listing… ek minute" with animated craft-wheel spinner
- If queued (offline): "Aapka listing ban raha hai. Jaise hi internet aayega, ready hoga"

**Error States:**
| Error | Handling |
|---|---|
| AI generates nonsensical content | Fallback to template-based generation for that craft type |
| Translation fails for a language | Show listing in available languages; queue failed translation for retry |
| API timeout | Retry once; if still fails, use cached/template approach |

**Edge Cases:**
- Very unusual product (not in training data): Generate generic listing; flag for admin review to improve taxonomy
- AI-generated title is culturally insensitive: Content filter checks before presenting to artisan
- Multiple products in one listing: AI detects and warns "Ek listing mein ek product rakhein — doosre ke liye naya listing banayein"

**Data Required:**
- All extracted entities from REQ-2.2 and REQ-2.3
- Image analysis results from REQ-2.1 and REQ-3.1
- Craft taxonomy mapping
- Translation models/APIs

**Dependencies:**
- LLM API (Gemini / GPT-4)
- Translation API
- Craft taxonomy (content asset)
- Image analysis pipeline (REQ-3.1)

---

### REQ-2.5: Artisan Listing Review 🟢 P0

**Purpose:** Present the AI-generated listing to the artisan for review and approval, using voice readback since many artisans cannot read.

**User:** Artisan

**Preconditions:**
- AI listing generated (REQ-2.4)
- AI price suggestion generated (REQ-5.1)

**User Actions:**
1. Sees listing preview: enhanced photo(s), title, description, price
2. AI reads the complete listing aloud in artisan's language:
   - "Aapke product ka naam hai: [Title]. Description mein likha hai: [Description]. Price ₹[X] suggest kiya hai."
3. Can say "Sahi hai" to approve, or:
   - "Title badlo" → AI asks for correction
   - "Price badha do" / "Price kam karo" → price adjustment screen
   - "Description mein yeh add karo: [something]" → AI appends
   - "Photo hata do" → delete a photo
4. Can save as draft or publish immediately

**System Behavior:**
- Full TTS readback of listing in artisan's language
- Pause/resume readback with tap
- Edit commands processed via voice (REQ-4.x)
- Visual highlighting of the section being read aloud
- "Draft" saves locally + cloud; "Publish" triggers REQ-6.1

**Success State:**
- Artisan approves listing
- Listing moves to publishing pipeline (REQ-6.1)
- Confirmation animation + voice: "Badhai ho! Aapka product list ho gaya!"

**Loading State:**
- Voice readback in progress — waveform animation

**Error States:**
| Error | Handling |
|---|---|
| TTS fails | Show text; offer "retry voice" button |
| Artisan wants to start over | "Kya aap naya listing shuru karna chahte hain?" confirmation |

**Edge Cases:**
- Artisan cannot read but wants to verify: Voice readback is the primary verification method — design must not require reading
- Artisan wants to edit something not supported by voice: Simple touch-based edit mode for advanced users

**Data Required:**
- Complete listing data from REQ-2.4
- Price suggestion from REQ-5.1
- TTS audio

**Dependencies:**
- REQ-2.4 (listing generation)
- REQ-5.1 (pricing)
- TTS engine
- Publishing pipeline (REQ-6.1)

---

## 3. AI Image Enhancement

---

### REQ-3.1: Automatic Image Enhancement 🟢 P0

**Purpose:** Transform artisan's raw phone photos into e-commerce-quality product images with clean backgrounds, corrected colors, and professional presentation.

**User:** System (automatic); Artisan (consumer of output)

**Preconditions:**
- Raw product photos captured (REQ-2.1)
- For advanced enhancement: network connectivity available

**User Actions:**
- None — enhancement is automatic
- Artisan sees before/after comparison after enhancement
- Can reject enhancement and use original: "Pehle wali photo rakhein"

**System Behavior:**

**On-Device (P0, offline-capable):**
1. Auto white-balance and exposure correction
2. Basic sharpening (unsharp mask)
3. Rotation/orientation correction (EXIF-based)

**Cloud-Based (P0, requires network):**
4. Background removal (SAM / U²-Net segmentation → white background)
5. Advanced color correction (material-aware: don't over-saturate silk)
6. Natural shadow generation (directional shadow for depth)
7. Perspective correction (straighten tilted shots)
8. Resolution upscaling (Real-ESRGAN, up to 2x)

**Processing rules:**
- On-device processing first → show intermediate result immediately
- Cloud processing in background → update when complete
- If cloud unavailable: on-device result used; cloud enhancement queued
- Multiple photos: process all, select best as primary
- Before/after toggle available in listing preview
- Output: 1200×1200 px, JPEG, ≤ 500 KB (primary); 600×600 px thumbnail

**Success State:**
- All photos enhanced (at least on-device level)
- Primary photo selected (highest quality score)
- Before/after comparison visible in listing preview

**Loading State:**
- On-device: "Enhancing photo…" (< 5 seconds)
- Cloud: "Making your photo look professional…" (< 30 seconds)
- Progress shown as percentage or step-by-step icons

**Error States:**
| Error | Handling |
|---|---|
| Background removal fails (complex background) | Fall back to vignette/blur background instead of removal |
| Upscaling produces artifacts | Use original resolution with on-device corrections only |
| Cloud processing timeout | Use on-device result; retry cloud in background |

**Edge Cases:**
- Product IS the background (e.g., carpet, wall hanging): Detect full-frame product; skip background removal
- Multiple products in image: Enhance without background removal; suggest separate photos
- Transparent/reflective product (glass bangle): Specialized segmentation model; may need manual flag

**Data Required:**
- Raw photos (input)
- Enhanced photos (output)
- Enhancement metadata (steps applied, before/after hash)

**Dependencies:**
- On-device TFLite models (white balance, sharpening, orientation)
- Cloud ML pipeline (segmentation, shadow gen, upscaling)
- Image storage (local + cloud CDN)

---

## 4. Voice Interaction System

---

### REQ-4.1: Voice Navigation 🟡 P1

**Purpose:** Allow artisans to navigate the app entirely by voice commands without needing to find and tap specific UI elements.

**User:** Artisan

**Preconditions:**
- Microphone permission granted
- Language set in profile

**User Actions:**
1. Taps floating mic button (🎤) available on all screens, or long-presses home button
2. Speaks a command in their language:
   - "Meri orders dikhao" → Orders screen
   - "Naya product daalo" → Camera / listing flow
   - "Kitna paisa aaya" → Earnings screen
   - "Profile dikhao" → Profile screen
   - "Help chahiye" → Support
3. App navigates to the requested screen

**System Behavior:**
- Always-listening mode NOT used (privacy concern + battery drain)
- Activated via explicit mic button press
- On-device intent classifier for navigation commands (no network needed for common commands)
- Command vocabulary: ~30 commands mapped to app screens/actions
- Fuzzy matching: "paisa", "kamai", "earnings", "kitna mila" all → Earnings screen
- If command not understood: "Kya aapne [X] kaha? Ya phir [Y]?" with options
- Voice feedback confirms navigation: "Aapki orders dikha raha hoon"

**Success State:**
- App navigates to correct screen
- Voice confirmation played

**Loading State:**
- "Samajh raha hoon…" (< 1 second for on-device commands)

**Error States:**
| Error | Handling |
|---|---|
| Command not recognized | "Yeh samajh nahi aaya. Kya aap [options] mein se kuch chahte hain?" |
| Mic button accidentally pressed | 3-second timeout with no speech → auto-dismiss |

**Edge Cases:**
- Artisan uses regional dialect for commands: Maintain dialect-to-intent mappings per language
- Artisan gives compound command ("Meri orders dikhao aur kitna paisa aaya"): Execute first command; prompt for second

**Data Required:**
- Command vocabulary per language (content asset)
- Intent-to-screen mapping
- On-device intent classifier model

**Dependencies:**
- On-device STT for command recognition
- Command vocabulary (content asset, per language)

---

### REQ-4.2: Voice-Activated Listing Edits 🟡 P1

**Purpose:** Allow artisans to modify existing listings using voice commands instead of navigating edit forms.

**User:** Artisan

**Preconditions:**
- Artisan has at least one published listing
- Mic button accessible

**User Actions:**
1. Views a listing → taps mic button
2. Speaks edit command:
   - "Price badha ke ₹1,500 karo" → Price updated
   - "Description mein likho ki yeh silk hai, cotton nahi" → Description updated
   - "Yeh product ab available nahi hai" → Listing paused
   - "Photo hata do doosri wali" → Second photo removed
   - "Quantity 5 karo" → Stock updated
3. AI confirms change: "Price ₹1,500 kar diya. Aur kuch badalna hai?"

**System Behavior:**
- Edit commands processed via NLU: extract intent + target field + new value
- Change applied immediately to draft; auto-saves
- Translation re-triggered for modified text fields
- If change affects pricing (material change): "Price bhi update karein? AI suggest karta hai ₹[X]"

**Success State:**
- Listing updated with voiced changes
- Voice confirmation of each change
- Updated listing synced to cloud

**Error States:**
| Error | Handling |
|---|---|
| Ambiguous edit | "Kya aap price badha rahe hain ya description?" |
| Invalid value | "₹50,000 bahut zyada lag raha hai. Kya aap sure hain?" |

**Data Required:**
- Edit intent mappings
- Current listing data for context

**Dependencies:**
- REQ-4.1 (voice navigation)
- REQ-2.4 (listing generation for re-translation)
- NLU edit-intent model

---

## 5. Dynamic Pricing Engine

---

### REQ-5.1: AI Fair Price Suggestion 🟢 P0

**Purpose:** Suggest a fair selling price for each product based on material cost, labour, complexity, packaging, and market demand — and explain the breakdown transparently to the artisan so they are never underpaid.

**User:** Artisan (consumer); System (generator)

**Preconditions:**
- Product listing data available (REQ-2.4)
- At least: material type, craft type, and labour time

**User Actions:**
1. After listing generation, sees price suggestion screen
2. Visual breakdown displayed with icons:
   - 🧵 Material: ₹X
   - ⏱️ Labour: ₹Y
   - 🎨 Complexity: ₹Z
   - 📦 Packaging: ₹A
   - 📈 Market demand: ₹B
   - = Total suggested: ₹(X+Y+Z+A+B)
3. Voice readback of each component
4. Slider or +/- buttons to adjust final price
5. If price is < 50% of suggestion: gentle warning voice
6. If price is > 200% of suggestion: informational note
7. Artisan confirms final price

**System Behavior:**
- Pricing model inputs:
  - **Material cost**: Mapped from material type + weight/size estimate. Data source: commodity price indices + platform historical data
  - **Labour cost**: Hours × regional minimum wage multiplier (₹50–₹150/hour depending on state). Input: artisan-stated production time
  - **Complexity score**: AI-assessed from image (pattern density, number of colors, technique difficulty). Scale: 1.0–2.0 multiplier
  - **Packaging cost**: Fixed estimate by size category (₹30–₹100)
  - **Market demand**: Based on similar products' sell-through rate on platform + comparable marketplace data
  - **Regional index**: State-wise cost-of-living adjustment
- Price floor: Always ≥ (minimum wage × stated hours) + material cost
- Platform commission shown: "You keep: ₹[price × 0.95]"
- If insufficient data for accurate pricing: show wider range ("₹800–₹1,200") with lower confidence indicator

**Success State:**
- Artisan sees and understands price suggestion
- Artisan confirms a final price (may differ from suggestion)
- Price saved to listing

**Loading State:**
- "Calculating fair price…" with animated scale/balance icon

**Error States:**
| Error | Handling |
|---|---|
| Insufficient data for pricing | Show range instead of exact price; flag for more follow-up questions |
| Market data unavailable | Use material + labour only; note "Market data not available" |
| Artisan sets ₹0 | "Price ₹0 nahi ho sakta. Kam se kam ₹[floor] rakhein" |

**Edge Cases:**
- Luxury/artisanal item far above commodity pricing: Allow higher prices without excessive warnings; note "Premium handcraft items can command higher prices"
- Mass-produced item type listed as handmade: Pricing engine flags unusually low labour time vs. item complexity
- Artisan consistently prices below suggestion: After 3 listings, proactive prompt: "Aap apni mehnat ka sahi daam le rahe hain? AI ke hisaab se thoda zyada le sakte hain"

**Data Required:**
- Material type → cost lookup table
- Regional wage indices
- Craft complexity scoring model
- Platform historical price data
- External marketplace price data (crawled/API)

**Dependencies:**
- REQ-2.4 (listing data)
- Commodity price data service
- Complexity scoring ML model
- Regional wage data

---

## 6. Product Publishing & Digital Craft Passport

---

### REQ-6.1: Product Publishing Pipeline 🟢 P0

**Purpose:** Publish an artisan-approved listing to the marketplace with AI moderation, search indexing, and notification to relevant buyers.

**User:** Artisan (trigger); System (execution)

**Preconditions:**
- Listing approved by artisan (REQ-2.5)
- Price set (REQ-5.1)
- At least 1 enhanced photo (REQ-3.1)

**User Actions:**
1. Artisan taps "Publish" button (large, green, with ✅ icon)
2. Confirmation: "Aapka product publish karna hai?" → "Haan" (voice or tap)

**System Behavior:**
1. **AI Moderation Check** (automated, < 5 seconds):
   - NSFW detection on images → auto-reject
   - Prohibited items check → auto-reject
   - Copyright/trademark detection → flag for admin
   - Quality score check (image + listing completeness) → warn but allow
   - Counterfeit indicators → flag for admin
2. **If passed**: Publish immediately, listing goes live
3. **If flagged**: Show "Under review" status; admin notified (REQ-20.x)
4. **If rejected**: Voice explanation + guidance to fix
5. **Post-publish**:
   - Search index updated (Elasticsearch/Algolia)
   - Category and collection pages updated
   - QR code and Craft Passport generated (REQ-6.2)
   - Notification sent to buyers matching product category preferences
   - Product appears in "New Arrivals" feed
6. **If offline**: Listing queued locally with "Pending publish" badge; auto-publishes when online

**Success State:**
- Listing visible on marketplace
- "Published" badge on artisan's listing view
- Voice celebration: "Badhai ho! Aapka product ab sabko dikh raha hai!"
- Confetti animation (first listing only)

**Loading State:**
- "Publishing…" with checkmark animation for each step (moderation ✓, indexing ✓, passport ✓)

**Error States:**
| Error | Handling |
|---|---|
| Moderation auto-reject | Voice: "Is product mein ek issue hai: [reason]. Please fix karein" |
| Flagged for review | "Aapka product review mein hai. 24 ghante mein update milega" |
| Network error during publish | Queue locally; "Jaise hi internet aayega, publish ho jayega" |

**Edge Cases:**
- Artisan re-publishes a previously rejected listing without changes: Show original rejection reason; require change before re-submission
- Listing published while in flight (intermittent network): Idempotent publish — if partial data sent, resume from last checkpoint

**Data Required:**
- Complete listing data
- Moderation results (pass/flag/reject + reasons)
- QR code URL
- Search index document

**Dependencies:**
- AI moderation models (NSFW, copyright, quality)
- Search indexing service
- QR code generation
- Push notification service
- REQ-6.2 (Craft Passport)

---

### REQ-6.2: Digital Craft Passport 🟢 P0

**Purpose:** Generate a unique, QR-code-linked digital provenance certificate for each product — scannable by buyers to verify authenticity and hear the artisan's story.

**User:** Buyer (scanner/reader); Artisan (creator/owner)

**Preconditions:**
- Product published (REQ-6.1)
- Artisan profile exists with at least name + location

**User Actions (Buyer):**
1. Scans QR code on physical product card (included in package) using phone camera or any QR app
2. OR taps "View Craft Passport" on product detail page in app/web
3. Sees Craft Passport page:
   - Artisan photo + name
   - Location on interactive map (district-level)
   - Craft tradition name + brief history
   - Making process description
   - Materials used
   - Time to create
   - 🎵 Play artisan's voice story (original recording from listing)
   - Certifications (GI tag, Handloom Mark if applicable)
   - "Buy more from this artisan" button
   - "Share this story" button

**System Behavior:**
- QR code generated with unique product ID → resolves to web URL
- Web URL works without app (responsive web page)
- Artisan's voice story is the original recording from listing creation (with artisan's consent)
- If buyer's language differs from artisan's, subtitles shown in buyer's language
- First scan by buyer is recorded; subsequent scans show "Previously verified" with original scan date
- Passport page is publicly accessible (no login required to view)
- Physical QR card: platform-branded card template with artisan name, product name, QR code
  - Digital PDF generated for artisan to print, or platform includes in shipment packaging

**Success State:**
- QR code generated and linked to product
- Craft Passport page accessible via URL
- Physical card template available for printing/packaging

**Loading State:**
- QR code generation: < 2 seconds (async, non-blocking for publish)

**Error States:**
| Error | Handling |
|---|---|
| QR code scan leads to deleted product | "This product is no longer available" with artisan profile link |
| Voice recording consent not given | Passport displays without voice; text description only |
| Invalid/tampered QR | "This QR code could not be verified" warning |

**Edge Cases:**
- Artisan updates listing after passport created: Passport auto-updates (same QR, dynamic content)
- Artisan deletes listing: Passport shows "This product is no longer listed" but artisan profile still accessible
- Multiple identical products: Each unit can get the same Craft Passport (linked to listing, not individual unit) — unless batch numbering requested (Phase 2)

**Data Required:**
- Product ID (unique, permanent)
- QR code image (SVG/PNG)
- Passport web page URL
- Artisan voice recording (with consent flag)
- All listing data for passport display
- Scan history (first scan timestamp, scanner metadata)

**Dependencies:**
- QR code generation library
- Web hosting for passport pages
- Audio streaming for voice playback
- Consent management system
- REQ-6.1 (published listing data)

---

## 7. Product Discovery & Search

---

### REQ-7.1: Home Page & Curated Collections 🟢 P0

**Purpose:** Provide buyers with an engaging, visually rich home page showcasing curated collections that highlight India's craft diversity and make browsing delightful.

**User:** B2C Buyer

**Preconditions:**
- Buyer has opened app or website
- No login required for browsing

**User Actions:**
1. Views home page with:
   - Hero banner (featured collection / campaign / festival)
   - "Explore by Craft" horizontal scroll (icon cards: Handloom, Pottery, Paintings…)
   - "Explore by Region" horizontal scroll (map-based or state icons)
   - "New Arrivals" product grid
   - "Trending Now" product grid
   - "Artisan Stories" carousel (featured artisans with photos)
   - "Gifts for [Occasion]" seasonal section
2. Taps any section to drill down
3. Pulls to refresh for latest content

**System Behavior:**
- Home page content mix: 60% algorithmically personalized (if logged in), 40% editorially curated
- For new/guest users: 100% curated + trending
- Collections managed via admin CMS (REQ-20.x)
- Lazy loading of images below fold
- Cached for offline viewing (last loaded version)
- Regional personalization: show crafts from buyer's state first (via IP geolocation)

**Success State:**
- Visually rich home page loads in < 3 seconds
- Buyer can browse without friction
- Clicking any item leads to product detail or collection page

**Loading State:**
- Skeleton screens with placeholder cards during load
- Hero banner placeholder with subtle shimmer

**Empty State:**
- Never truly empty — always show curated content even with zero personalization data

**Error States:**
| Error | Handling |
|---|---|
| Network error | Show cached version with "Last updated [time]" banner |
| API timeout | Graceful degradation: show static/cached collections |

**Data Required:**
- Curated collections (admin-managed)
- Product listings for grids
- Artisan profiles for stories
- Festival/occasion calendar
- User browsing history (for personalization, if logged in)

**Dependencies:**
- Admin CMS for collections
- Product catalog API
- Recommendation engine (P1)
- CDN for images

---

### REQ-7.2: Product Search 🟢 P0

**Purpose:** Enable buyers to find products through text search, with relevance-ranked results across all languages.

**User:** B2C Buyer, B2B Buyer

**Preconditions:**
- Products exist in catalog

**User Actions:**
1. Taps search bar (top of screen, always visible)
2. Types search query in any supported language
3. Sees auto-suggestions as they type (product names, categories, artisan names)
4. Hits search → results page with grid of matching products
5. Can apply filters: Craft type, Region, Price range, Material, Rating, Delivery time

**System Behavior:**
- Search across: product titles, descriptions, tags, artisan names, category names — in ALL languages
- Ranking algorithm (from PRODUCT_DISCOVERY.md Section 11.2):
  - Text relevance: 30%
  - Product quality score: 20%
  - Artisan trust score: 15%
  - Recency: 10%
  - Price competitiveness: 10%
  - Conversion rate: 10%
  - Geographic relevance: 5%
- New artisan discovery quota: ≥10% of first-page results are from artisans with < 5 sales
- Search in one language returns results with listings in any language (cross-lingual search)
- Auto-correct common misspellings
- "Did you mean?" suggestions for low-result queries

**Success State:**
- Relevant search results displayed within 1 second
- Filters applied in real-time
- Zero-result page shows "Try [related terms]" suggestions

**Loading State:**
- Skeleton product cards during search

**Empty State:**
- "No results for '[query]'. Try: [related suggestions]" + browse categories CTA

**Error States:**
| Error | Handling |
|---|---|
| Search service down | Show cached popular products + "Search is temporarily unavailable" |
| Very broad query (e.g., "product") | Show curated results + suggest narrowing |

**Data Required:**
- Search index (Elasticsearch/Algolia)
- Product metadata in all languages
- Filter taxonomies
- User location (for geographic relevance)

**Dependencies:**
- Search indexing service
- Product catalog
- Filter taxonomy data

---

### REQ-7.3: Voice Search 🟡 P1

**Purpose:** Let buyers search by speaking in any supported language — critical for artisan-side search and useful for buyer convenience.

**User:** B2C Buyer, Artisan (searching own products)

**Preconditions:**
- Mic permission granted

**User Actions:**
1. Taps mic icon in search bar
2. Speaks query: "Red silk saree" or "लाल रेशमी साड़ी"
3. STT converts to text → search results displayed

**System Behavior:**
- Same STT pipeline as artisan voice (REQ-2.2): Bhashini primary, Google fallback
- Search query processed identically to text search (REQ-7.2)
- Visual feedback: waveform during speech, transcribed text shown in search bar

**Success State:**
- Voice query converted to text and search results shown
- Query text editable in search bar after voice input

**Error States:**
| Error | Handling |
|---|---|
| STT fails | "Couldn't understand. Try typing instead?" |
| Poor audio quality | Show partial transcription; let user edit |

**Data Required:**
- Same as REQ-7.2 + STT pipeline

**Dependencies:**
- REQ-7.2 (search)
- STT engine

---

### REQ-7.4: Image Search 🟡 P2

**Purpose:** Allow buyers to upload or take a photo of a craft item to find similar products on the platform.

**User:** B2C Buyer

**Preconditions:**
- Camera or gallery access

**User Actions:**
1. Taps camera icon in search bar
2. Takes a photo or selects from gallery
3. AI finds visually similar products
4. Results shown as "Products like this"

**System Behavior:**
- Image embedding via vision model (CLIP or similar)
- K-nearest-neighbor search in product embedding space
- Results ranked by visual similarity + availability
- Show confidence score: "Very similar" / "Somewhat similar"

**Success State:**
- 5–20 visually similar products displayed
- Buyer can tap to view any result

**Loading State:**
- "Finding similar products…" with image processing animation

**Error States:**
| Error | Handling |
|---|---|
| No similar products found | "We couldn't find similar products. Try browsing by category" |
| Image not a product | "This doesn't look like a product. Try a different photo" |

**Data Required:**
- Product image embeddings (pre-computed)
- Vision embedding model
- Vector similarity search index

**Dependencies:**
- REQ-7.2 (search infrastructure)
- Vision embedding model
- Vector database (Pinecone/Weaviate/pgvector)

---

### REQ-7.5: Product Detail Page 🟢 P0

**Purpose:** Display complete product information, artisan story, trust signals, and purchase options in an engaging, conversion-optimized layout.

**User:** B2C Buyer, B2B Buyer

**Preconditions:**
- Product is published and active

**User Actions:**
1. Taps a product from search/browse/collection
2. Views:
   - Photo gallery (swipeable, zoomable)
   - Product title
   - Price (with optional "See price breakdown" expanding section)
   - Artisan mini-profile: photo, name, location, rating, "Verified" badge
   - Description (in buyer's language, with "See original" toggle)
   - Product attributes (material, dimensions, weight, color)
   - Craft Passport preview card (tap to expand — REQ-6.2)
   - 🎵 "Hear the artisan's story" audio player
   - Delivery estimate
   - "Ready Stock" or "Made to Order (X days)" badge
   - Reviews section (REQ-12.x)
   - "You may also like" recommendations
3. Actions: "Add to Cart", "Buy Now", "Wishlist ♡", "Share"

**System Behavior:**
- Content served in buyer's preferred language (auto-detected or set)
- "See original" shows artisan's language version
- Artisan voice story auto-plays on first visit (with mute option) — or tap-to-play
- "Delivery estimate" calculated from artisan location + buyer location + stock type
- B2B buyers see additional "Request Bulk Quote" button
- Product views counted for analytics (artisan and admin)
- Recently viewed products tracked for recommendations

**Success State:**
- Complete product information displayed
- Buyer can add to cart, buy, wishlist, or share
- Craft Passport accessible

**Loading State:**
- Skeleton layout → photos load first → text details → reviews

**Empty State:**
- Product not found / deleted: "This product is no longer available" + related products

**Error States:**
| Error | Handling |
|---|---|
| Image CDN failure | Show placeholder with "Photo loading…" |
| Artisan voice recording unavailable | Hide audio player section |

**Data Required:**
- Full listing data (all languages)
- Enhanced photos (CDN URLs)
- Artisan profile summary
- Reviews summary
- Delivery estimate calculation inputs
- Recommendation engine output

**Dependencies:**
- Product catalog API
- CDN for images/audio
- Delivery estimation service
- Review aggregation (REQ-12.x)
- Recommendation engine

---

## 8. Order Management

---

### REQ-8.1: B2C Order Placement 🟢 P0

**Purpose:** Enable buyers to purchase products with a streamlined checkout flow.

**User:** B2C Buyer

**Preconditions:**
- Buyer is authenticated (REQ-1.3)
- At least 1 item in cart
- Valid delivery address

**User Actions:**
1. Reviews cart: product photo, name, quantity, price, artisan name per item
2. Enters/selects delivery address
3. Selects payment method (REQ-9.1)
4. Reviews order summary: items + shipping cost + total
5. Confirms order → payment processed
6. Sees order confirmation page with estimated delivery date

**System Behavior:**
- Cart can have items from multiple artisans → creates separate sub-orders per artisan
- Shipping cost calculated per sub-order (artisan location → buyer location)
- Total = sum of (item prices + shipping costs) — platform commission NOT visible to buyer
- On payment success:
  - Order created with status "Placed"
  - Payment held in escrow
  - Artisan notified (push + WhatsApp voice — REQ-13.x)
  - Buyer receives order confirmation (email/push)
  - Timer starts: artisan has 24h to accept (for accept/reject items) or auto-accept (for ready stock)
- Ready stock items: auto-accepted, status → "Confirmed" → "Ready to Ship"
- Made-to-order items: status stays "Placed" until artisan accepts

**Success State:**
- Order confirmed with unique order ID
- Estimated delivery date shown
- Artisan notified within 30 seconds
- Buyer can track order from "My Orders"

**Loading State:**
- Payment processing spinner: "Processing payment…"
- Order creation: "Placing your order…"

**Error States:**
| Error | Handling |
|---|---|
| Payment fails | "Payment failed. Try again or use a different method" |
| Product out of stock (race condition) | "Sorry, this product was just sold. [See similar products]" |
| Artisan account suspended | Remove from cart, notify buyer, suggest alternatives |

**Edge Cases:**
- Multi-artisan cart: each artisan's items ship separately; buyer sees per-shipment tracking
- Buyer changes address after order: allowed if status is "Placed" (before artisan ships)
- Buyer cancels after payment: if "Placed" (not yet accepted), instant refund; if "Confirmed" or later, cancellation policy applies

**Data Required:**
- Cart items (product ID, quantity, price)
- Delivery address
- Payment details (via gateway)
- Shipping cost per sub-order
- Order IDs (unique per sub-order)

**Dependencies:**
- Payment gateway (REQ-9.1)
- Shipping cost calculator
- Artisan notification system (REQ-13.x)
- Inventory management

---

### REQ-8.2: Artisan Order Acceptance 🟢 P0

**Purpose:** Notify artisans of new orders and let them accept, reject, or negotiate — via voice interaction.

**User:** Artisan

**Preconditions:**
- Artisan has a published listing
- An order is placed for their product

**User Actions:**
1. Receives order notification (push + voice alert + WhatsApp):
   "Nayi order! [Buyer City] se ₹1,200 ka [Product Name] order aaya hai"
2. Taps notification → order detail screen
3. AI reads order details:
   - Product name + photo
   - Quantity
   - Price
   - Buyer city (not full address, for privacy)
   - Delivery timeline expected
4. Three options (large buttons with icons):
   - ✅ Accept: "Haan, bhej dungi" → status moves to Confirmed
   - ❌ Reject: "Nahi bhej sakti" → asked for reason (voice) → product relisted, buyer refunded
   - 🔄 Negotiate: "Price/time mein change chahiye" → counter-offer flow

**System Behavior:**
- Auto-accept for "Ready Stock" items (configurable per artisan — default: auto-accept ON)
- For "Made to Order": artisan must manually accept and provide estimated completion date
- 24-hour acceptance window; after that, auto-cancel + buyer refund
- Reminders sent at 12h and 20h if not responded
- Rejection reason captured via voice for analytics
- Negotiation: artisan can propose different price or timeline → buyer notified to accept/reject counter-offer

**Success State:**
- Order accepted: status → "Confirmed" (or "In Production" for made-to-order)
- Artisan sees order in "My Orders" with timeline
- Voice confirmation: "Order accept ho gaya! [X din mein] tayyar karein"

**Loading State:**
- After acceptance: "Order confirm ho raha hai…" (< 2 seconds)

**Error States:**
| Error | Handling |
|---|---|
| Network down when accepting | Action queued locally; synced when online |
| Artisan accidentally rejects | "Kya aap sure hain?" confirmation with undo window (30 seconds) |

**Edge Cases:**
- Artisan is on vacation mode: orders not routed; listing paused
- Artisan never responds to orders: after 3 auto-cancellations, warning; after 5, reduced visibility
- Multiple orders for same product (limited stock): First order gets priority; subsequent orders queued or rejected based on stock

**Data Required:**
- Order details (product, quantity, price, buyer city)
- Artisan response (accept/reject/negotiate)
- Rejection reason (voice + text)
- Counter-offer details (if negotiated)
- Response timestamp

**Dependencies:**
- Notification system (REQ-13.x)
- Order state machine
- Voice I/O (REQ-4.x)

---

### REQ-8.3: B2B Bulk Order & Cluster Formation 🟡 P1

**Purpose:** Enable B2B buyers to place bulk orders that are automatically distributed across AI-formed artisan clusters based on skill, capacity, location, and reliability.

**User:** B2B Buyer (requester); System (cluster formation); Artisans (fulfillers)

**Preconditions:**
- B2B buyer account verified (REQ-1.4)
- Product type exists in platform catalog

**User Actions (B2B Buyer):**
1. Creates RFQ (Request for Quote):
   - Product type / reference product from catalog
   - Quantity required
   - Quality specifications (text + reference images)
   - Timeline (delivery deadline)
   - Budget range (per unit)
   - Customization needs (color, size, branding)
2. Submits RFQ
3. Within 24–48 hours, receives cluster proposal:
   - Proposed cluster composition (number of artisans, location, individual capacity)
   - Combined capacity: total units per week
   - AI-suggested per-unit price + total price
   - Proposed delivery timeline
   - Quality assurance plan (per D8 decision)
4. B2B buyer approves, requests changes, or declines

**System Behavior — Cluster Formation:**
1. AI identifies candidate artisans matching:
   - Skill: craft type + product category match (30% weight)
   - Geography: within 100km radius preferred (20% weight)
   - Capacity: current order load vs. stated weekly output (20% weight)
   - Reliability: on-time delivery %, acceptance rate, ratings (20% weight)
   - Past cluster performance (10% weight)
2. Proposes optimal cluster size: total_quantity / avg_capacity_per_artisan × 1.2 buffer
3. Generates shared production brief (translated to each artisan's language):
   - Product specifications
   - Quality standards with visual reference
   - Per-artisan quantity allocation
   - Timeline with milestones
   - Payment terms
4. Sends invitation to each proposed artisan (voice notification):
   "Ek bada order aaya hai — kya aap 50 mein se 10 saree bana sakte hain? ₹[X] per piece milega"
5. Artisans accept/decline individually
6. If enough artisans accept: cluster confirmed
7. If not enough: AI proposes replacement artisans or adjusts quantity/timeline
8. Cluster Lead auto-assigned: highest reliability score artisan who opted in

**System Behavior — Production Tracking:**
- Each artisan reports progress at milestones (photo + voice):
  - Material sourced
  - 25% complete
  - 50% complete
  - 75% complete
  - Ready for dispatch
- B2B buyer sees consolidated dashboard: total progress %, per-artisan progress, projected completion date
- QC checkpoints: 
  - Photo self-reporting at each milestone (all orders)
  - Facilitator physical QC for orders > ₹50,000
  - Buyer sample approval for orders > ₹2,00,000

**Success State:**
- Cluster formed and confirmed
- Production brief distributed
- All artisans begin production
- Buyer has real-time consolidated tracking dashboard
- On completion: shipments dispatched (individual or consolidated), GST-compliant bulk invoice generated

**Loading State:**
- "Finding the best artisans for your order…" (cluster formation: may take up to 4 hours for complex orders)
- Real-time status: "8 of 10 artisans have responded so far"

**Empty State:**
- No matching artisans found: "We don't have enough artisans for this craft type yet. Would you like us to notify you when we do?"

**Error States:**
| Error | Handling |
|---|---|
| Not enough artisans accept | Propose smaller cluster + longer timeline, or notify buyer |
| Artisan drops out mid-production | Reassign quota to remaining artisans or find replacement |
| Quality fails at checkpoint | Artisan asked to redo; if persistent, replaced in cluster |
| Timeline at risk | Early warning to buyer + cluster-wide notification |

**Edge Cases:**
- All artisans in a cluster are from same SHG: Flag as potential single-point-of-failure; suggest geographic diversification
- B2B buyer wants to interact directly with artisans: Platform facilitates communication (translated) but maintains commercial terms
- Repeat order with same cluster: Fast-track — pre-formed cluster, reduced setup time
- Very large order (10,000+ units): May require multiple clusters; federated tracking

**Data Required:**
- RFQ details (product, quantity, specs, timeline, budget)
- Artisan capability profiles (craft type, capacity, location, reliability score)
- Cluster composition (artisan IDs, assigned quantities)
- Production brief document
- Milestone tracking data (photos, completion %)
- QC results per milestone
- GST invoice data

**Dependencies:**
- Cluster formation algorithm (ML model)
- Artisan capability database
- Production tracking system
- QC workflow
- GST invoicing service
- Notification system (REQ-13.x)

---

## 9. Payments & Payouts

---

### REQ-9.1: Buyer Payment Processing 🟢 P0

**Purpose:** Process buyer payments securely through multiple payment methods with escrow protection.

**User:** B2C Buyer, B2B Buyer

**Preconditions:**
- Order confirmed in cart
- Network connectivity

**User Actions:**
1. Selects payment method: UPI / Card / Net Banking / COD
2. For UPI: enters UPI ID or selects app (GPay, PhonePe) → completes payment in UPI app
3. For Card: enters card details (tokenized, not stored) → OTP verification
4. For Net Banking: redirected to bank → completes payment → returned to app
5. For COD: no payment now; amount collected at delivery

**System Behavior:**
- Payment processed via Razorpay/Cashfree (decision D16, final TBD)
- On success: payment held in escrow (platform's nodal account)
- Escrow rules:
  - Released to artisan 48 hours after delivery confirmation (if no dispute)
  - Held if buyer raises return/dispute within 48 hours
  - Auto-released if buyer takes no action within 48 hours
- For multi-artisan orders: split payment via gateway API (amount allocated per artisan)
- Platform commission (5%) deducted at payout time, not at payment time
- COD: artisan paid by platform after COD collected by logistics partner (delayed payout: 7–10 days)

**Success State:**
- Payment confirmed
- Escrow hold activated
- Order status updated to "Paid"
- Buyer receives payment confirmation

**Loading State:**
- "Processing payment…" spinner (gateway-dependent, typically 5–15 seconds)
- UPI redirect: "Complete payment in [UPI App]"

**Error States:**
| Error | Handling |
|---|---|
| Payment declined | "Payment failed. Try again or use a different method" |
| Gateway timeout | Retry once automatically; then manual retry button |
| UPI app not installed | Offer alternative UPI entry (ID/QR) or other payment methods |
| COD not available for pincode | "Cash on Delivery is not available for your area. Please pay online" |

**Edge Cases:**
- Partial payment (EMI for high-value items): Phase 2 feature
- International payment: Phase 2 (international cards + currency conversion)
- Payment succeeded but order creation fails: auto-refund within 24 hours + apology notification

**Data Required:**
- Payment method selected
- Transaction ID from gateway
- Escrow transaction record
- Payment amount breakdown (items + shipping + taxes)

**Dependencies:**
- Payment gateway (Razorpay/Cashfree)
- Escrow account management
- Order creation service
- COD eligibility rules

---

### REQ-9.2: Artisan Payout 🟢 P0

**Purpose:** Transfer earnings to artisan's bank account after delivery confirmation, with transparent deductions and voice notification.

**User:** Artisan

**Preconditions:**
- Artisan is Aadhaar-verified (REQ-1.2)
- Bank account details added and validated
- Order delivered and escrow release conditions met

**User Actions:**
1. Delivery confirmed by logistics → 48-hour hold begins
2. If no dispute: payout automatically initiated
3. Artisan receives voice notification: "₹[amount] aapke bank account mein bhej diye gaye hain. 1–2 din mein aa jayega"
4. Can view payout history in "My Earnings" screen (voice-enabled)

**System Behavior:**
- Payout = order amount − platform commission (5%)
- Payout via NEFT/IMPS to artisan's registered bank account
- Minimum payout: ₹100 (smaller amounts accumulated)
- Payout schedule: within 3 business days of escrow release
- For made-to-order: milestone-based payouts possible (50% on production start, 50% on delivery)
- Payout dashboard shows:
  - Total earned (lifetime)
  - This month earnings
  - Pending payouts
  - Deductions (commission, returns)
  - Payout history (date, amount, order reference)

**Success State:**
- Payout initiated and confirmed
- Artisan can see transaction in bank account within 1–2 business days
- Voice summary available

**Loading State:**
- "Processing your payment…" during payout initiation

**Error States:**
| Error | Handling |
|---|---|
| Invalid bank details | "Bank details mein kuch galat hai. Please check karein" — link to update |
| Bank transfer fails | Retry automatically; if persistent, flag for admin + notify artisan |
| Payout below minimum | "₹[X] accumulate ho raha hai. ₹100 se zyada hone par bhej denge" |

**Edge Cases:**
- Artisan changes bank account: new account verified (micro-deposit) before payout routed to it
- Artisan's bank account is in a different person's name (spouse/relative): Allowed if Aadhaar name matches OR joint account
- RBI regulations change: payout system must be configurable for compliance updates

**Data Required:**
- Bank account details (IFSC, account number, holder name)
- Payout records (amount, date, order ID, commission deducted)
- Transaction reference IDs

**Dependencies:**
- Payment gateway payout API (Razorpay/Cashfree)
- Bank account validation service
- Escrow release trigger
- Notification system

---

## 10. Delivery & Logistics

---

### REQ-10.1: Shipping & Logistics 🟢 P0

**Purpose:** Manage end-to-end shipping from artisan's location to buyer's doorstep, with support for both rural pickup and urban courier.

**User:** Artisan (shipper), Buyer (receiver), System (coordinator)

**Preconditions:**
- Order accepted by artisan
- Product ready to ship (or production complete for made-to-order)

**User Actions (Artisan):**
1. Marks product as "Ready to Ship" (large button + voice confirmation)
2. App shows packaging guidelines (voice + visual): "Product ko kapde mein lapet ke, dibbe mein rakhein"
3. Chooses: "Pickup from my location" or "I'll drop at post office/courier"
4. For pickup: selects date/time slot → logistics partner assigns pickup
5. For drop-off: nearest post office / courier point shown on map
6. Receives shipping label (prints if possible, or hand-writes reference number)
7. Hands over package → tracking activated

**System Behavior:**
- Shipping orchestrated via logistics aggregator (Shiprocket/iThink) with India Post integration
- Carrier auto-selected based on:
  - Artisan location (rural → India Post preferred)
  - Buyer location (urban → private courier for speed)
  - Package weight/size (estimate from listing)
  - Cost optimization
- Tracking number generated and shared with buyer
- Shipping cost calculated at order time (included in buyer's total)
- Estimated delivery: 3–5 days (urban-urban), 5–10 days (rural-urban)

**Success State:**
- Package picked up / dropped off
- Tracking active for buyer and artisan
- Estimated delivery date shown to both parties

**Loading State:**
- "Scheduling pickup…" while logistics API responds

**Error States:**
| Error | Handling |
|---|---|
| No pickup available in artisan's area | Suggest nearest drop-off point on map |
| Courier cancels pickup | Reschedule automatically; notify artisan |
| Package lost in transit | Initiate insurance claim; refund buyer; compensate artisan |
| Delivery address unreachable | Logistics partner contacts buyer; if unresolvable, return to artisan |

**Edge Cases:**
- Very remote artisan (no courier service at all): India Post is fallback; if even post office is far, facilitator helps with logistics
- Fragile items (pottery, glass): Special packaging guidance + "fragile" flag on shipment
- Large/heavy items (furniture, large textiles): Special logistics pricing; buyer notified of higher shipping cost
- International shipping: Phase 2 (requires customs documentation)

**Data Required:**
- Artisan location (GPS + address)
- Buyer delivery address
- Package weight/dimensions (estimated from listing)
- Carrier selection data
- Tracking number
- Shipping cost
- Delivery timestamp

**Dependencies:**
- Logistics aggregator API (Shiprocket/iThink)
- India Post API
- Shipping cost calculator
- Tracking service

---

## 11. Returns, Refunds & Disputes

---

### REQ-11.1: Conditional Return Processing 🟢 P0

**Purpose:** Handle returns for defective, damaged, or wrong items while protecting artisans from frivolous returns of handmade products.

**User:** B2C Buyer, Artisan, Admin

**Preconditions:**
- Order delivered
- Within 7-day return window

**User Actions (Buyer):**
1. Goes to "My Orders" → selects delivered order → "Request Return"
2. Selects reason:
   - "Product is damaged" → upload photo evidence required
   - "Product is defective" → upload photo evidence required
   - "Wrong product received" → upload photo of received product
   - "Not as described" → upload comparison photo
   - "I don't want it anymore" → exchange/credit offered (NOT refund)
3. Uploads supporting photos
4. Submits return request

**System Behavior:**
- AI + admin assessment of return request:
  - Photo analysis: does damage/defect match claim?
  - Cross-reference with listing photos: is it a different product?
  - Return history check: is this buyer a serial returner?
- Approved return: reverse pickup scheduled → refund processed on receipt
- Denied return: buyer notified with reason + exchange/credit option
- Damage responsibility assessment:
  - Manufacturing defect: artisan bears cost
  - Transit damage: logistics partner insurance claim
  - Wrong item: artisan bears cost (correct item sent or refund)
  - "Don't want": no return; exchange or platform credit

**Success State (Approved Return):**
- Return pickup scheduled
- Buyer receives refund within 5–7 business days of return receipt
- Artisan compensated if not at fault

**Success State (Denied Return):**
- Buyer offered exchange or ₹[X] platform credit
- Clear explanation of why return was denied

**Error States:**
| Error | Handling |
|---|---|
| Buyer doesn't provide photos | "Photos zaroori hain — return ka karan dikhane ke liye" |
| Reverse pickup unavailable | Buyer drops at nearest courier point |
| Dispute unresolved by AI | Escalated to admin manual review |

**Edge Cases:**
- Product damaged by buyer but claimed as defect: Photo analysis cross-references delivery condition; admin reviews
- Perishable craft (fresh flower garlands, food items): No returns applicable; noted at purchase
- Very high-value item (>₹10,000): Mandatory admin review regardless of AI assessment

**Data Required:**
- Return reason
- Supporting photos
- Return status and timeline
- Refund amount and method
- Damage responsibility assignment

**Dependencies:**
- AI image comparison model
- Return logistics (reverse pickup)
- Refund processing (REQ-9.x)
- Admin review queue (REQ-20.x)

---

## 12. Reviews, Trust & Ratings

---

### REQ-12.1: Product Reviews 🟢 P0

**Purpose:** Allow verified buyers to rate and review products, building trust for future buyers and providing feedback to artisans.

**User:** B2C Buyer (reviewer), Artisan (reader), Buyer (reader)

**Preconditions:**
- Buyer has received the product (order status: "Delivered")
- Return window expired or no return raised

**User Actions (Buyer):**
1. Prompted via push notification 3 days after delivery: "How was your [Product]? Leave a review!"
2. Taps notification → review form:
   - Star rating (1–5, tap on stars)
   - Text review (optional, 10–500 characters)
   - Photo(s) of received product (optional, up to 3)
3. Submits review

**System Behavior:**
- "Verified Purchase" badge auto-applied
- Review visible on product page after submission (no admin approval required for text; photo reviews get AI NSFW check)
- Auto-translated to all supported languages with "See original" option
- Artisan notified of new review (translated to their language):
  "Ek customer ne aapko [X] star diya! '[Review excerpt]'"
- Artisan can respond to review via voice (transcribed, translated, posted)
- Aggregate rating updated on product and artisan profile
- Fake review detection:
  - Only verified purchasers can review
  - 1 review per order per product
  - AI pattern detection (timing, content similarity, reviewer profile)
  - Photo cross-referenced with product listing

**Success State:**
- Review published on product page
- Artisan notified
- Aggregate rating updated

**Loading State:**
- "Posting your review…" spinner

**Error States:**
| Error | Handling |
|---|---|
| Review text inappropriate | "Some content was flagged. Please revise" |
| Photo upload fails | "Photo couldn't be uploaded. Try again or skip" |
| Duplicate review attempt | "You've already reviewed this product" |

**Edge Cases:**
- Buyer updates review after initial post: Allowed once within 30 days
- Artisan receives their first-ever review: Extra celebration: "Aapka pehla review aaya!"
- Abusive review targeting artisan personally: AI content filter + admin removal

**Data Required:**
- Star rating (1–5)
- Review text (original language + translations)
- Review photos
- Reviewer buyer ID (anonymized to "Buyer from [City]")
- Artisan response (if any)
- Timestamps

**Dependencies:**
- Review storage and display
- Content moderation (AI + admin)
- Translation service
- Notification system

---

## 13. Notifications

---

### REQ-13.1: Multi-Channel Artisan Notifications 🟢 P0

**Purpose:** Deliver critical notifications to artisans via multiple channels (push, SMS, in-app voice) ensuring they never miss an order or payment update, even with intermittent app usage.

**User:** Artisan

**Preconditions:**
- Artisan has active profile
- Push notification permission granted (ideal)
- Phone number available for SMS fallback

**System Behavior:**
- **Notification priority cascade:**
  1. In-app push notification with voice readback
  2. SMS (for critical events if push fails after 5 minutes)
  3. WhatsApp message (P1 — when WhatsApp integration is live)
  4. Voice call (P2 — for extremely high-value/urgent events only)

| Event | Channel(s) | Message Format |
|---|---|---|
| New order | Push (voice) + SMS | "Nayi order! ₹[X] ka [Product] order aaya hai. Accept karein" |
| Order reminder (12h) | Push + SMS | "Aapki order ka jawab dena baaki hai. 12 ghante baaki hain" |
| Order auto-cancelled (24h) | Push + SMS | "Order cancel ho gaya kyunki samay pe jawab nahi mila" |
| Payment received | Push (voice) | "₹[X] aapke bank mein bhej diye" |
| New review | Push | "Customer ne aapko [X] star diya!" |
| Weekly summary | Push (scheduled, Sunday) | "Is hafte: [X] products bike, ₹[Y] kamaye" |
| Cluster order invite | Push (voice) + SMS | "Bada order aaya hai — participate karein?" |
| Price update suggestion | Push | "Market mein demand badhi hai — price update?" |
| Listing flagged | Push | "Aapki ek listing review mein hai" |
| System maintenance | Push | "App update available hai" |

- Voice readback: push notification auto-reads aloud when artisan opens it (configurable in settings)
- All notifications stored in in-app notification center (icon-based, latest first)
- Notifications respect "Do Not Disturb" hours (configurable, default: 10 PM – 7 AM)

**Success State:**
- Artisan receives all relevant notifications
- Voice readback plays on notification open
- Actions (accept order, view earnings) accessible directly from notification

**Error States:**
| Error | Handling |
|---|---|
| Push delivery fails | Fallback to SMS within 5 minutes |
| SMS delivery fails | Log for admin review; retry next event |
| Artisan has notifications disabled | In-app banner prompting to enable |

**Data Required:**
- Notification event type
- Notification content (templated per language)
- Delivery status per channel
- Artisan notification preferences (DND hours, channels)

**Dependencies:**
- Push notification service (FCM)
- SMS gateway
- Voice readback (TTS)
- Notification templates per language

---

## 14. Analytics & Insights

---

### REQ-14.1: Artisan Voice-First Analytics 🟡 P1

**Purpose:** Provide artisans with simple, voice-delivered business insights without requiring them to read charts or dashboards.

**User:** Artisan

**Preconditions:**
- Artisan has at least 1 sale

**User Actions:**
1. Taps "My Earnings" / "📊" icon on home screen
2. Sees simple visual dashboard:
   - Large earnings number (this week / this month toggle)
   - Trend arrow (↑ or ↓ vs. previous period)
   - Products sold count
   - Top product (photo + count)
   - Rating (stars)
   - Pending actions list
3. Voice auto-reads summary on screen load
4. Can ask: "Pichle mahine kitna hua?" for historical data

**System Behavior:**
- Voice summary auto-plays: "Is hafte aapne ₹[X] kamaye. [Y] products bike. Sabse zyada [Product Name] bika — [Z] baar. Rating [W] star hai."
- Visuals: large numbers, trend arrows, product photos — no complex charts
- Data refreshed on screen load (cached for offline)
- Weekly scheduled voice summary (Sunday 10 AM local time): push notification with earnings summary

**Success State:**
- Artisan understands their business performance
- Voice summary played successfully
- Actionable items highlighted (pending orders, low stock)

**Empty State:**
- No sales yet: "Abhi tak koi sale nahi hui. Apne products share karein zyada logon ke saath!"

**Data Required:**
- Sales aggregation (daily, weekly, monthly)
- Top products by sales count
- Average rating
- Pending actions count
- Trend comparison vs. previous period

**Dependencies:**
- Analytics aggregation pipeline
- TTS engine
- Scheduled notification system

---

## 15. Support

---

### REQ-15.1: Artisan Voice-First Support 🟡 P1

**Purpose:** Provide support to artisans through voice interaction, accommodating low literacy and language barriers.

**User:** Artisan

**Preconditions:**
- Artisan has active profile

**User Actions:**
1. Taps "Help / ❓" icon from any screen
2. Sees common issues as visual icon cards:
   - "Photo kaise lein" (How to take photos)
   - "Order kaise accept karein" (How to accept orders)
   - "Payment kab aayega" (When will I get paid)
   - "Product ka price badalna hai" (Change product price)
   - "Kuch aur problem" (Other problem)
3. Taps an issue → voice explanation plays with animated tutorial
4. If not resolved: "Agent se baat karein" → connects to human support in artisan's language

**System Behavior:**
- L1 support: pre-recorded voice explanations for top 20 common issues
- L2 support: AI voice chatbot that can handle contextual queries ("Mera last order ka payment kab aayega?" → looks up actual order data and responds)
- L3 support: human agent (in artisan's language) via in-app voice call or WhatsApp
- If artisan has a linked facilitator: issue first routed to facilitator
- Proactive support: if artisan has zero sales after 30 days, app initiates: "Lagta hai aapko kuch help chahiye. Kya photo lene mein problem hai?"

**Success State:**
- Artisan's issue resolved at L1 (self-service) or L2 (AI chatbot) level
- If escalated: connected to human agent within 5 minutes during business hours

**Loading State:**
- "Connecting to support…" while agent is assigned

**Error States:**
| Error | Handling |
|---|---|
| No agents available | "Abhi agents busy hain. [X] minute mein call back karenge" — callback queued |
| Language not supported for live agent | Use AI translation layer for agent-artisan communication |

**Data Required:**
- FAQ content per language (voice + text)
- Artisan's recent activity (for contextual support)
- Support ticket tracking

**Dependencies:**
- FAQ content (voice recordings per language)
- AI chatbot (NLU + data access)
- Human agent pool (multilingual)
- Facilitator linking system

---

## 16. Multilingual Support

---

### REQ-16.1: UI Localization 🟢 P0

**Purpose:** Present the entire app UI in the artisan's or buyer's preferred language with proper script rendering.

**User:** All users

**Preconditions:**
- Language selected during onboarding or in settings

**User Actions:**
1. Selects language during onboarding (REQ-1.1)
2. Can change language anytime from Settings → Language
3. All UI elements immediately update to selected language

**System Behavior:**
- MVP languages: Hindi, English + 2 regional (TBD)
- All UI strings professionally translated (not machine-translated)
- Right-to-left support not needed for current languages (all are LTR or top-to-bottom)
- Proper Unicode rendering for all scripts (Devanagari, Bengali, Tamil, etc.)
- Numbers displayed in user's script numerals OR Arabic numerals (configurable)
- Currency always in ₹ with Arabic numerals
- Date/time in local format
- Language switcher accessible from every screen via settings gear

**Success State:**
- All UI text rendered in selected language with proper script
- No untranslated strings visible
- Layout accommodates varying text lengths (Hindi is ~40% longer than English)

**Error States:**
| Error | Handling |
|---|---|
| Translation missing for a string | Fall back to English → log missing translation for correction |
| Font rendering issue | Bundled fonts for all supported scripts (Noto Sans family) |

**Data Required:**
- String resource files per language
- Font assets per script
- Locale-specific formatting rules

**Dependencies:**
- i18n framework (Flutter intl / Android resource system)
- Professional translation vendor
- Font bundling

---

## 17. Offline & Sync

---

### REQ-17.1: Offline-First Core Actions 🟢 P0

**Purpose:** Ensure artisans can perform critical actions (photo capture, voice recording, order viewing, listing edits) without network connectivity.

**User:** Artisan

**Preconditions:**
- App installed with profile created (at least one prior online session for initial data sync)

**User Actions:**
- All actions work the same as online — no special "offline mode" UI
- A subtle indicator shows offline status: small banner "Offline — changes will sync when connected"

**System Behavior:**

| Action | Offline Behavior |
|---|---|
| Take photos | Full — saved locally |
| Record voice | Full — saved locally |
| View own listings | Full — cached locally |
| Edit listing (price, description) | Full — queued for sync |
| Accept/reject order | Queued — synced when online |
| View orders | Cached — shows last-synced data |
| AI image enhancement | Basic on-device only |
| AI catalog generation | Partial (cached for common crafts) or fully queued |
| Publish listing | Queued — auto-publishes when online |

- Sync engine:
  - Monitors network state continuously
  - When connection detected: uploads queued items in priority order (order responses first, then listings, then media)
  - Uploads use resumable protocol (chunked upload for photos/audio)
  - Conflict resolution: last-write-wins for edits; server canonical for orders
  - Sync progress shown in notification tray: "Syncing 3 items…"
- Local storage: SQLite for structured data, file system for media
- Storage limit alert at 80% device storage: "Phone ki memory kam ho rahi hai. Purani photos hata sakte hain"

**Success State:**
- Artisan works seamlessly offline
- All queued actions sync automatically when online
- Voice notification on sync complete: "Sab kuch sync ho gaya!"

**Error States:**
| Error | Handling |
|---|---|
| Sync conflict (order already cancelled by buyer while artisan was offline) | Show conflict: "Yeh order buyer ne cancel kar diya tha" — artisan action voided |
| Upload interrupted | Resume from last chunk on reconnect |
| Local storage full | Prioritize: delete cached buyer browsing data first, then old thumbnails |

**Data Required:**
- Local SQLite database schema mirroring cloud
- Sync queue (action type, timestamp, payload, status)
- Media file references (local path + cloud URL after sync)
- Last sync timestamp per data type

**Dependencies:**
- Local database (SQLite / Hive)
- Background sync service (WorkManager on Android)
- Resumable upload library
- Network state monitor

---

## 18. Security & Privacy

---

### REQ-18.1: Authentication & Data Protection 🟢 P0

**Purpose:** Secure all user data, authentication, and transactions in compliance with DPDP Act 2023 and payment regulations.

**User:** All users

**System Behavior:**

| Domain | Requirement |
|---|---|
| **Authentication** | Phone OTP (primary); 4-digit PIN for profile switching; biometric unlock (optional) |
| **Session management** | JWT tokens with 30-day refresh; auto-logout after 90 days inactivity |
| **Data in transit** | TLS 1.3 for all API calls |
| **Data at rest** | AES-256 encryption for local database; cloud-provider encryption for server storage |
| **Payment data** | PCI-DSS compliance via payment gateway (no card data on our servers) |
| **Aadhaar data** | Never stored; verification token only |
| **Voice recordings** | Stored with explicit consent; deletable by artisan; encrypted at rest |
| **Location data** | Exact GPS stored for logistics; only district-level shown to buyers |
| **Personal data (DPDP)** | Consent collected at signup; data minimization; right to erasure; data portability on request |
| **API security** | Rate limiting (100 req/min per user); API key authentication; input validation |
| **Fraud prevention** | AI-based: fake listing detection, price manipulation, review farms, suspicious account activity |

**Edge Cases:**
- User requests complete data deletion (DPDP right to erasure): All personal data deleted within 30 days; order history anonymized (not deleted, for legal compliance)
- Court order for data disclosure: Legal compliance process documented; minimum data disclosed

**Data Required:**
- Consent records per user
- Encryption keys (managed via cloud KMS)
- Audit logs for data access

**Dependencies:**
- Cloud provider encryption (GCP/AWS KMS)
- DPDP Act compliance framework
- Fraud detection ML pipeline

---

## 19. Accessibility & Low-Literacy UX

---

### REQ-19.1: Icon-First, Voice-First Navigation 🟢 P0

**Purpose:** Design the artisan app so that a person who cannot read can navigate and use all core features through icons and voice alone.

**User:** Artisan (low-literacy)

**System Behavior:**
- **Bottom navigation bar**: 4 tabs with distinct icons + minimal text label in local script
  - 🏠 Home | 📦 Orders | ➕ List | 👤 Me
- **Floating Action Button (FAB)**: Camera icon for quick product photo — always visible
- **Floating Mic Button (🎤)**: Always visible on all screens for voice commands
- **Design principles**:
  - Every tap target ≥ 56dp
  - One primary action per screen
  - Color-coded meanings: green = money/success, red = alert/attention, blue = info
  - Animations for confirmations (checkmark, confetti) + sounds
  - No text-only buttons — every button has an icon
  - Progress indicators are visual (step dots, progress bar), not text
  - Error messages delivered via voice, not just text
  - All long text has "Read Aloud 🔊" button
- **Screen reader support**: Full TalkBack compatibility
- **Text scaling**: Support up to 200% system font size
- **High contrast mode**: Toggle in settings

**Data Required:**
- Icon asset library (culturally neutral, universally recognizable)
- Voice prompts per language per screen
- Accessibility metadata for all UI elements

**Dependencies:**
- TTS engine
- TalkBack-compatible UI framework
- Voice prompt recordings

---

## 20. Admin Platform

---

### REQ-20.1: Admin Web Dashboard 🟡 P1

**Purpose:** Provide platform operators with a comprehensive web dashboard for content moderation, artisan management, order oversight, analytics, and financial management.

**User:** Admin

**Preconditions:**
- Admin account with appropriate role/permissions

**User Actions:**
- Accesses dashboard via web browser (desktop-first)
- Modules:

| Module | Key Features |
|---|---|
| **Dashboard Home** | GMV, active artisans, active buyers, orders today, revenue, alerts |
| **Artisan Management** | Verification queue, profiles, health scores, KYC status, suspension |
| **Listing Moderation** | AI-flagged queue, manual review tools, bulk approve/reject, quality scores |
| **Order Management** | Order search, stuck order alerts, dispute queue, refund management |
| **Cluster Management** | Active clusters, member performance, rebalancing tools |
| **Financials** | Payout dashboard, commission tracking, refund reconciliation, revenue reports |
| **Content Management** | Curated collections, featured artisans, banner campaigns, seasonal shops |
| **Analytics** | All metrics from PRODUCT_DISCOVERY.md Section 25.2 (GMV, supply, demand, fulfilment, AI performance, regional, craft-wise, cluster) |
| **Support** | Ticket queue, escalation management, SLA tracking |
| **Settings** | Commission rates, moderation thresholds, notification templates, language management |

**System Behavior:**
- Role-based access: Super Admin, Content Admin, Operations Admin, Finance Admin, Support Admin
- Audit logging for all admin actions
- Real-time data updates for critical metrics (orders, disputes)
- Batch operations for moderation (approve/reject multiple listings)
- Export capabilities: CSV/Excel for all data tables

**Success State:**
- Admin can manage all platform operations from web dashboard
- All critical metrics visible in real-time
- Moderation queue shows zero backlog

**Data Required:**
- All platform data aggregated for admin views
- Audit logs
- Admin role/permission definitions

**Dependencies:**
- Admin authentication (OAuth2)
- Analytics aggregation pipeline
- All backend APIs

---

## 21. Cross-Reference Matrix

Maps each requirement to its source section in PRODUCT_DISCOVERY.md:

| Requirement | PRODUCT_DISCOVERY.md Section | Priority |
|---|---|---|
| REQ-1.1 Artisan Onboarding | §2, §7.1, §30 | P0 |
| REQ-1.2 Aadhaar Verification | §7.1, §28, D3 | P1 |
| REQ-1.3 B2C Buyer Onboarding | §8, D5 | P0 |
| REQ-1.4 B2B Buyer Onboarding | §10.1, D7 | P1 |
| REQ-1.5 Facilitator Onboarding | §2.2, D1 | P1 |
| REQ-1.6 Multi-Profile | §29.2, §32.1, D20 | P1 |
| REQ-2.1 Photo Capture | §7.2, §12, §13 | P0 |
| REQ-2.2 Voice Description | §7.2, §14 | P0 |
| REQ-2.3 AI Follow-Up | §12.2 | P0 |
| REQ-2.4 AI Listing Generation | §12.1 | P0 |
| REQ-2.5 Listing Review | §7.2, §14.2 | P0 |
| REQ-3.1 Image Enhancement | §13 | P0 |
| REQ-4.1 Voice Navigation | §14.2, §30 | P1 |
| REQ-4.2 Voice Listing Edits | §14.2 | P1 |
| REQ-5.1 Fair Price Suggestion | §16 | P0 |
| REQ-6.1 Publishing Pipeline | §18 | P0 |
| REQ-6.2 Digital Craft Passport | §18.3 | P0 |
| REQ-7.1 Home & Collections | §11.1 | P0 |
| REQ-7.2 Product Search | §11.1, §11.2 | P0 |
| REQ-7.3 Voice Search | §11.1 | P1 |
| REQ-7.4 Image Search | §11.1 | P2 |
| REQ-7.5 Product Detail Page | §8.2 | P0 |
| REQ-8.1 B2C Order Placement | §8.3, §19 | P0 |
| REQ-8.2 Artisan Order Acceptance | §7.3, §19, D4 | P0 |
| REQ-8.3 B2B Bulk & Clusters | §10.2, §10.3, D7, D8 | P1 |
| REQ-9.1 Buyer Payment | §20, D16 | P0 |
| REQ-9.2 Artisan Payout | §20.2 | P0 |
| REQ-10.1 Shipping & Logistics | §21, D17 | P0 |
| REQ-11.1 Conditional Returns | §22, D18 | P0 |
| REQ-12.1 Product Reviews | §23 | P0 |
| REQ-13.1 Artisan Notifications | §24 | P0 |
| REQ-14.1 Artisan Analytics | §25.1 | P1 |
| REQ-15.1 Artisan Support | §26 | P1 |
| REQ-16.1 UI Localization | §15 | P0 |
| REQ-17.1 Offline & Sync | §31, D21 | P0 |
| REQ-18.1 Security & Privacy | §28 | P0 |
| REQ-19.1 Low-Literacy UX | §29, §30 | P0 |
| REQ-20.1 Admin Dashboard | §9, D6 | P1 |

---

## Priority Summary

### P0 — MVP Critical (18 requirements)

| # | Requirement | Domain |
|---|---|---|
| REQ-1.1 | Artisan Onboarding | Auth |
| REQ-1.3 | B2C Buyer Onboarding | Auth |
| REQ-2.1 | Product Photo Capture | Catalog |
| REQ-2.2 | Voice Product Description | Catalog |
| REQ-2.3 | AI Follow-Up Questions | Catalog |
| REQ-2.4 | AI Listing Generation | Catalog |
| REQ-2.5 | Artisan Listing Review | Catalog |
| REQ-3.1 | Automatic Image Enhancement | Catalog |
| REQ-5.1 | AI Fair Price Suggestion | Pricing |
| REQ-6.1 | Product Publishing Pipeline | Publishing |
| REQ-6.2 | Digital Craft Passport | Publishing |
| REQ-7.1 | Home Page & Collections | Discovery |
| REQ-7.2 | Product Search | Discovery |
| REQ-7.5 | Product Detail Page | Discovery |
| REQ-8.1 | B2C Order Placement | Orders |
| REQ-8.2 | Artisan Order Acceptance | Orders |
| REQ-9.1 | Buyer Payment Processing | Payments |
| REQ-9.2 | Artisan Payout | Payments |
| REQ-10.1 | Shipping & Logistics | Delivery |
| REQ-11.1 | Conditional Return Processing | Returns |
| REQ-12.1 | Product Reviews | Trust |
| REQ-13.1 | Artisan Notifications | Notifications |
| REQ-16.1 | UI Localization | i18n |
| REQ-17.1 | Offline-First Core Actions | Offline |
| REQ-18.1 | Authentication & Data Protection | Security |
| REQ-19.1 | Icon-First Voice-First Navigation | Accessibility |

### P1 — Important (8 requirements)

| # | Requirement | Domain |
|---|---|---|
| REQ-1.2 | Artisan Aadhaar Verification | Auth |
| REQ-1.4 | B2B Buyer Onboarding | Auth |
| REQ-1.5 | Facilitator Onboarding | Auth |
| REQ-1.6 | Multi-Profile Device Support | Auth |
| REQ-4.1 | Voice Navigation | Voice |
| REQ-4.2 | Voice-Activated Listing Edits | Voice |
| REQ-7.3 | Voice Search | Discovery |
| REQ-8.3 | B2B Bulk Order & Clusters | Orders |
| REQ-14.1 | Artisan Voice-First Analytics | Analytics |
| REQ-15.1 | Artisan Voice-First Support | Support |
| REQ-20.1 | Admin Web Dashboard | Admin |

### P2 — Enhancement (1 requirement)

| # | Requirement | Domain |
|---|---|---|
| REQ-7.4 | Image Search | Discovery |

> [!NOTE]
> **MVP with P0 features delivers a complete, usable product:** an artisan can onboard, create AI-powered listings via photo + voice, set fair prices, publish with Craft Passports, receive and fulfil orders, get paid, and handle returns — all in their language, offline-capable, and accessible to low-literacy users. Buyers can discover, search, browse, purchase, track, review, and return products via web and mobile.

> [!IMPORTANT]
> **P1 features are strongly recommended for launch** to differentiate from basic e-commerce (voice navigation, B2B clusters, facilitator support, analytics) and should be included unless timeline is extremely tight.

---

> [!CAUTION]
> This specification covers functional requirements only. **Technical architecture** (tech stack, database design, API contracts, infrastructure), **non-functional requirements** (performance benchmarks, scalability targets, SLAs), and **UX/UI design** (screen designs, interaction patterns, design system) are separate deliverables that should follow this document.

---

*Functional Requirements Specification for Kalakar Setu — Smart India Hackathon*
