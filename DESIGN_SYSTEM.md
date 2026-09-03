# Kalakar Setu — Mobile Design System Specification
## सेतु डिज़ाइन सिस्टम (Setu Design System) | Premium Low-Literacy Commerce Design Framework

> **Document Type:** Production-Grade Design System & Component Library  
> **Version:** 1.0  
> **Date:** 2026-09-03  
> **Target Platforms:** Android Mobile (Artisan App & Buyer App), Responsive Web (Buyer Storefront & Admin Portal)  
> **Core Philosophy:** *कला, संवाद, और विश्वास (Craft, Dialogue, and Trust)* — Uncompromising visual elegance paired with radical accessibility for users who cannot read, write, or navigate complex digital interfaces.

---

# Table of Contents

1. [Design Principles for Low-Literacy & Rural Commerce](#1-design-principles-for-low-literacy--rural-commerce)
2. [Color Palette & Semantic Tokens](#2-color-palette--semantic-tokens)
3. [Typography & Indic Script Hierarchy](#3-typography--indic-script-hierarchy)
4. [Elevation, Surfaces & Shadows](#4-elevation-surfaces--shadows)
5. [Grid, Spacing & Layout Ergonomics](#5-grid-spacing--layout-ergonomics)
6. [Iconography & Cultural Metaphors](#6-iconography--cultural-metaphors)
7. [Touch Targets & Haptic Tokens](#7-touch-targets--haptic-tokens)
8. [Buttons & Interactive Triggers](#8-buttons--interactive-triggers)
9. [Tactile Numeric & Voice Inputs](#9-tactile-numeric--voice-inputs)
10. [Card Architectures](#10-card-architectures)
11. [Product Cards (Artisan & Buyer Variants)](#11-product-cards-artisan--buyer-variants)
12. [Navigation Systems & Persistent Shell](#12-navigation-systems--persistent-shell)
13. [Headers & Top App Bars](#13-headers--top-app-bars)
14. [Tabs & Segmented Filters](#14-tabs--segmented-filters)
15. [Chips & Filter Tags](#15-chips--filter-tags)
16. [Badges, Seals & Trust Indicators](#16-badges-seals--trust-indicators)
17. [Modals, Dialogs & Confirmation Overlays](#17-modals-dialogs--confirmation-overlays)
18. [Bottom Sheets & Action Drawers](#18-bottom-sheets--action-drawers)
19. [Loading Indicators & Cultural Spinners](#19-loading-indicators--cultural-spinners)
20. [Skeletons & Shimmer States](#20-skeletons--shimmer-states)
21. [Empty States & Reassuring Guidance](#21-empty-states--reassuring-guidance)
22. [Error States, Fallbacks & Self-Healing UI](#22-error-states-fallbacks--self-healing-ui)
23. [Success States, Confetti & Audio Celebrations](#23-success-states-confetti--audio-celebrations)

---

# 1. Design Principles for Low-Literacy & Rural Commerce

### Principle 1: Voice and Icon Duopoly (Never Text Alone)
Every functional piece of information or clickable element must pair a high-contrast visual icon with a spoken voice alternative. An artisan who cannot read the word "बिक्री" (Sales) recognizes the green coin pouch icon and hears the audio clip on tap.

### Principle 2: One Primary Decision Per Screen
Cognitive overload causes abandonment. The artisan interface never presents nested tabs or multi-column option forms. Screens follow a strict linear progression: *One question, one camera frame, one confirmation.*

### Principle 3: Physical & Cultural Real-World Metaphors
Avoid abstract computing concepts (e.g., "SKU", "Drafts", "Repository", "Payload"). Replace with familiar physical counterparts:
- Instead of "Inventory Database" ➔ **"Meri Dukan" (मेरी दुकान / My Shop)**
- Instead of "Balance Ledger & Escrow" ➔ **"Mera Khata" (मेरा खाता / My Passbook)**
- Instead of "Order Pipeline" ➔ **"Bhejne Wala Saman" (भेजने वाला सामान / Goods to Ship)**

### Principle 4: Radical Touch Ergonomics (Work-Worn Hands)
Rural artisans (weavers, potters, blacksmiths) frequently have calloused or dust-covered fingertips. Touch targets must never fall below **56dp × 56dp** with generous 16dp spacing margins to eliminate accidental mis-taps.

### Principle 5: Deterministic Color Semantics
Colors must have absolute, unbending meanings across all 87 screens:
- **Forest Emerald (`#1E5631`):** Money, incoming payments, verified status, active stock, affirmative actions.
- **Deep Terracotta (`#C04000`):** Action initiation, camera shutter, purchase checkout, creative energy.
- **Haldi Ochre (`#D4AF37`):** Authenticity seals, GI certification, pending review, high prestige.
- **Alert Crimson (`#B00020`):** Dangerous actions, rejection, canceled orders, broken rules.

---

# 2. Color Palette & Semantic Tokens

### 2.1 Primary & Cultural Brand Palette

```
[ Forest Emerald ]    [ Deep Terracotta ]    [ Haldi Ochre ]    [ Indigo Neel ]
     #1E5631               #C04000              #D4AF37            #1B3B6F
   (Money/Growth)        (Craft/Action)       (Trust/GI Tag)     (Information)
```

| Token Name | Hex Code | RGB | Contrast vs White | Semantic Meaning & Context |
|---|---|---|---|---|
| `color-primary-emerald-900` | `#0E2F1B` | `14, 47, 27` | 13.8:1 | Dark header bars, high-emphasis financial text |
| `color-primary-emerald-700` | `#1E5631` | `30, 86, 49` | 7.4:1 | Primary affirmative buttons, positive ledger credit |
| `color-primary-emerald-500` | `#2D8A4E` | `45, 138, 78` | 4.8:1 | Active status dots, audio progress waveforms |
| `color-primary-emerald-100` | `#E8F5E9` | `232, 245, 233` | 1.2:1 | Background fill for verified badges and earnings cards |
| `color-terracotta-700` | `#C04000` | `192, 64, 0` | 5.1:1 | Primary commerce CTA (Buy Now, Camera Shutter) |
| `color-terracotta-900` | `#7F2A00` | `127, 42, 0` | 8.9:1 | Terracotta button pressed state, banner backgrounds |
| `color-terracotta-100` | `#FBE9E7` | `251, 233, 231` | 1.1:1 | Attention banners, highlighted draft cards |
| `color-ochre-gold-600` | `#D4AF37` | `212, 175, 55` | 2.1:1 | Verified artisan shields, GI Tag certificates |
| `color-ochre-gold-900` | `#5B4A10` | `91, 74, 16` | 8.2:1 | Gold text on light gold backgrounds |
| `color-indigo-700` | `#1B3B6F` | `27, 59, 111` | 8.1:1 | Shipping status indicators, B2B institutional cards |
| `color-indigo-100` | `#E3F2FD` | `227, 242, 253` | 1.2:1 | Postal tracking cards and info banners |

### 2.2 Neutral & Surface Palette (Anti-Glare)

Rural users frequently operate devices under direct, harsh sunlight outdoors or under dim 5W bulbs indoors. Harsh stark white causes eye fatigue, while deep blacks cause OLED reflections. We use warm natural parchment neutrals:

| Token Name | Hex Code | Context |
|---|---|---|
| `color-surface-parchment` | `#F9F6F0` | Default app background (warm kora cotton texture) |
| `color-surface-card` | `#FFFFFF` | Elevated touch cards, bottom sheets |
| `color-surface-subtle` | `#F0EAE1` | Dividers, disabled button fills, unselected tabs |
| `color-text-charcoal-primary` | `#1A1C1E` | Primary body and numeral typography (15.2:1 contrast) |
| `color-text-charcoal-secondary` | `#49454F` | Helper copy, timestamps, secondary labels (6.8:1 contrast) |
| `color-text-muted` | `#79747E` | Placeholder text, disabled labels |
| `color-border-card` | `#E0D7C9` | High-definition card outlines (1.5dp width) |

### 2.3 Semantic Feedback Tokens

| Token Name | Hex Code | Meaning |
|---|---|---|
| `color-status-success` | `#1E5631` | Order confirmed, payment received, sync complete |
| `color-status-warning` | `#ED6C02` | Low battery, pending KYC, order expiring in 4 hours |
| `color-status-danger` | `#B00020` | Blurry photo rejected, order canceled, bank failure |
| `color-status-offline` | `#5C6B73` | Network disconnected, outbox queued |

---

# 3. Typography & Indic Script Hierarchy

### 3.1 Typeface Families
- **Primary Indic Font Stack:** `Noto Sans Devanagari`, `Noto Sans Bengali`, `Noto Sans Tamil`, `Noto Sans Telugu`, `Noto Sans Gujarati`, `Noto Sans Odia`. (Bundled offline within app binary).
- **Primary Latin & Numeral Stack:** `Inter Display` (Optimized for ultra-legible numeric distinction between `0`, `8`, `6`, and `9`).
- **Brand Storytelling Heading:** `Outfit SemiBold` (Used for buyer marketing headers and Craft Passport typography).

### 3.2 Type Scale (1.250 Major Third Responsive Scale)

```
Scale Title             Size    Weight    Line Height   Tracking    Primary Use
Display Large           32sp    Bold      40sp          -0.5px      Monthly Income Hero, Splash Header
Display Medium          28sp    Bold      36sp          -0.25px     AI Suggested Price, Key Totals
Headline Large          24sp    Bold      32sp           0px        Screen Titles, Modal Headlines
Headline Medium         20sp    SemiBold  28sp           0px        Product Title on PDP, Card Headers
Body Large (Prominent)  18sp    Medium    26sp          +0.15px     Primary Button Labels, Voice Prompts
Body Medium (Default)   16sp    Regular   24sp          +0.25px     Description copy, Ledger rows
Body Small (Helper)     14sp    Regular   20sp          +0.4px      Timestamps, shipping hints
Numeral Extra-Bold      36sp    Bold      44sp           0px        Tactile Keypad, Grand Totals
```

### 3.3 Indic Script Vertical Metrics Adjustment
Indic scripts have complex ascenders, descenders, and vowel matras (मात्राएं) that clip under standard Latin line heights. 
- **Universal Rule:** All Indic text containers must enforce a minimum `line-height` of **1.45× to 1.55× the font-size** (e.g., 18sp font uses 26sp line-height).
- **Clipping Protection:** Vertical padding on buttons must be at least 14dp top and 14dp bottom to prevent descender cut-off.

---

# 4. Elevation, Surfaces & Shadows

Low-literacy users rely heavily on tactile "affordance" — understanding what can be touched based on physical depth. Flat UI is confusing; high-contrast elevation creates distinct physical cards that clearly look pressable.

```
Elevation Level    Y-Offset    Blur Radius    Spread    Opacity / Color           Application
Level 0 (Flat)     0dp         0dp            0dp       None                      Background Parchment
Level 1 (Card)     2dp         6dp            0dp       rgba(26, 28, 30, 0.08)    Product cards, Ledger rows
Level 2 (Active)   4dp         12dp           0dp       rgba(26, 28, 30, 0.12)    Selected craft tiles, Modals
Level 3 (Floating) 6dp         18dp           2dp       rgba(192, 64, 0, 0.25)    Camera Shutter, Floating Mic
Level 4 (Top Bar)  2dp         4dp            0dp       rgba(26, 28, 30, 0.06)    Sticky bottom navigation
```

- **Card Border Token:** In addition to shadow, all elevated cards include a **1.5dp solid outline** (`color-border-card: #E0D7C9`) ensuring separation on budget TFT/TN LCD screens with poor viewing angles.

---

# 5. Grid, Spacing & Layout Ergonomics

### 5.1 8dp Baseline Spacing Scale

| Spacing Token | Value | Visual Reference | Primary Application |
|---|---|---|---|
| `space-xxs` | 2dp | Micro gap | Border width, dot separators |
| `space-xs` | 4dp | Tight gap | Badge icon-to-text margin |
| `space-sm` | 8dp | Compact | Distance between tag chips |
| `space-md` | 16dp | Base Gutter | Screen edge margins, internal card padding |
| `space-lg` | 24dp | Generous | Space between unrelated vertical sections |
| `space-xl` | 32dp | Landmark | Distance between hero price and action buttons |
| `space-xxl` | 48dp | Safe Area | Bottom clearance for floating action bar |

### 5.2 One-Handed Thumb Zone Ergonomics
Rural artisans frequently hold their phone in one hand while working at a loom or pottery wheel with the other.
- **Top 30% of Screen:** Read-only information (Photos, status banners, large earnings balance).
- **Bottom 70% of Screen (Thumb Reach Area):** All interactive elements, primary green actions, floating mic, numeric keypad, and decision buttons.

```
┌─────────────────────────┐
│     READ-ONLY ZONE      │  Top 30%: Photos, Balances, Audio Prompts
│  (No critical buttons)  │
├─────────────────────────┤
│                         │
│       ACTION ZONE       │  Bottom 70%: Easy natural thumb reach
│   (56dp+ Touch Targets) │  - Decision buttons
│                         │  - Numeric Keypads
│                         │  - Microphone Trigger
└─────────────────────────┘
```

---

# 6. Iconography & Cultural Metaphors

All icons are rendered in **duotone or filled bold stroke (2.5dp stroke width)** to remain crisp on low-density screens (mdpi/hdpi).

### Cultural Icon Mapping Matrix

```
Function               Icon Graphic Metaphor          Label (Hindi)         Label (English)
Create Product         📸 Bada Camera + Plus          नया प्रोडक्ट         New Product
Orders / Shipments     📦 Bandha Hua Parcel Box       ऑर्डर                 Orders
Earnings / Money       💰 Sikke aur Khata Passbook    कमाई / खाता           Earnings / Ledger
Voice Action           🎤 Chamakdar Microphone        बोलकर बताएं           Speak Now
Verified Maker         🛡️ Sone ka Shield + Check      सत्यापित कलाकार        Verified Artisan
GI Tag Certificate     🏛️ Rashtriya Mudra Seal        जी.आई. टैग            GI Certified
Drop-Off Dak Ghar      📮 Lal Dak Dibba (Post Box)    डाक घर                Post Office
Doorstep Pickup        🚚 Chhota Hathi Delivery Van   घर से पिकअप           Doorstep Pickup
Language Selector      🌐 Prithvi / Bhasha Globe      भाषा                  Language
Audio Readback         🔊 Bajta Hua Speaker           सुनें                 Listen
```

---

# 7. Touch Targets & Haptic Tokens

### 7.1 Touch Boundary Enforcement
- Standard web guidelines recommend 48dp; the **Setu Design System mandates 56dp × 56dp minimum touch bounds** for every interactable element in the artisan viewport.
- If an icon is visually 24dp, its tap container must be padded to 56dp:
  ```css
  .touch-target-accessible {
    min-width: 56px;
    min-height: 56px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  ```

### 7.2 Haptic Vibration Tokens
Mobile devices provide tactile confirmation for users who cannot read confirmation text:
- `haptic-tick` (15ms, light): Keypad number pressed, filter chip toggled.
- `haptic-confirm` (40ms, crisp): Photo captured, order accepted, mic recording started.
- `haptic-celebrate` (100ms pulse, pause 50ms, 150ms heavy pulse): Product published, bank payout credited.
- `haptic-error` (3 rapid 50ms buzzes): Unrecognized voice command, invalid OTP, blurry photo detected.

---

# 8. Buttons & Interactive Triggers

### 8.1 Primary Action Button (`btn-primary-action`)
- **Visuals:** Solid Forest Emerald (`#1E5631`), 16dp rounded corners, minimum height **56dp**.
- **Label:** 18sp Bold centered text paired with a leading 28dp high-contrast white icon.
- **Elevation:** 3dp resting, 1dp pressed.
- **States:**
  - *Default:* `#1E5631` with crisp white text and icon.
  - *Pressed:* Scale `0.98`, background darkens to `#0E2F1B`, emits `haptic-confirm`.
  - *Disabled:* Background `#E0D7C9`, text `#79747E`, zero elevation.
  - *Loading:* Label hidden, central 28dp spinning white wheel indicator.

```
┌────────────────────────────────────────────────────────┐
│  (✓)  हारे बटन को दबाएं — पब्लिश करें / Publish        │  Height: 56dp
└────────────────────────────────────────────────────────┘
```

### 8.2 Terracotta Commerce Button (`btn-commerce-action`)
- **Visuals:** Solid Deep Terracotta (`#C04000`), height 56dp, bold white font.
- **Application:** Buyer "Buy Now", Camera Capture button.

### 8.3 Secondary Tactile Outline Button (`btn-secondary-outline`)
- **Visuals:** Transparent background, 2dp solid outline in `#1E5631`, text `#1E5631`.
- **Application:** "Draft Save Karein", "Skip", "Retake Photo".

### 8.4 Dual Decision Pair (Accept vs. Reject)
Used on Order Detail (`ART-SCR-29`) and Milestone approvals:
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ (✓) मंजूर है / ACCEPT   │  │ (✕) मना करें / REJECT   │
│       Bg: #1E5631       │  │       Bg: #B00020       │
│       Text: White       │  │       Text: White       │
│       Height: 64dp      │  │       Height: 64dp      │
└─────────────────────────┘  └─────────────────────────┘
```

### 8.5 Floating Microphone Assistant (`fab-voice-assistant`)
- **Dimensions:** 68dp × 68dp circular button at bottom right.
- **Color:** Gradient from Deep Terracotta (`#C04000`) to Ochre Gold (`#D4AF37`).
- **Resting State:** Emits continuous ambient soft pulse ring (opacity 0.4 to 0.0) every 2 seconds.
- **Active Recording State:** Scales to 76dp, pulses vibrant red (`#B00020`), displays animated audio wavebars.

---

# 9. Tactile Numeric & Voice Inputs

Low-literacy artisans must never be forced to use the default QWERTY keyboard with tiny keys.

### 9.1 In-App Tactile Numeric Keypad (`comp-tactile-keypad`)
Used for Phone Number (`ART-SCR-03`), OTP (`ART-SCR-04`), Aadhaar (`ART-SCR-12`), and Price adjustments.

```
┌───────────────┬───────────────┬───────────────┐
│       1       │       2       │       3       │  Key Height: 64dp
│     (एक)      │      (दो)     │     (तीन)     │  Key Width: 33%
├───────────────┼───────────────┼───────────────┤
│       4       │       5       │       6       │  Font: 28sp Bold
│     (चार)     │     (पांच)    │      (छह)     │  Audio tone per key
├───────────────┼───────────────┼───────────────┤
│       7       │       8       │       9       │  Background: #FFFFFF
│     (सात)     │      (आठ)     │      (नौ)     │  Border: 1dp solid
├───────────────┼───────────────┼───────────────┤
│       ⌫       │       0       │       ✓       │
│    (हटाएं)    │     (शून्य)   │     (हो गया)  │
└───────────────┴───────────────┴───────────────┘
```

### 9.2 Voice Input Field (`comp-voice-input-field`)
- Large text container (minimum height 72dp) with border radius 12dp.
- Left: Dynamic audio wave animation indicating recording level.
- Center: Real-time transcribed words appearing in bold 20sp Indic font.
- Right: Large 56dp green microphone button (tap to start, tap to stop).
- Audio readback button (🔊) appears automatically once transcription finishes.

---

# 10. Card Architectures

### 10.1 Stat & Earnings Hero Card (`card-stat-hero`)
- **Background:** Gradient `#1E5631` (Top) to `#0E2F1B` (Bottom).
- **Text:** Crisp White.
- **Components:**
  - Top row: Sikke/Coin icon + Title: *"Is Mahine ki Kamai (This Month's Income)"*.
  - Center: Giant currency display: `₹8,400` in 32sp Bold.
  - Bottom row: Trend badge `[ ↑ 20% pichle mahine se ]` + Speaker button (🔊 *"Aapne is mahine aath hazaar char sau rupaye kamaye"*).

```
┌────────────────────────────────────────────────────────┐
│  💰 इस महीने की कमाई (This Month's Income)             │
│                                                        │
│  ₹8,400                                        [ 🔊 ]  │
│                                                        │
│  [ ↑ 20% ज्यादा ]        State Bank of India (..4921)  │
└────────────────────────────────────────────────────────┘
```

### 10.2 Transparent Price Ledger Card (`card-price-ledger`)
Used on `ART-SCR-22` to explain fair cost structure:
```
┌────────────────────────────────────────────────────────┐
│  🧵 कच्चा माल (Material Cost):          ₹250           │
│  ⏱️ मेहनत (Labor 4 Days):               ₹1,400         │
│  🎨 कला की बनावट (Complexity):          ₹350           │
│  📦 पैकेजिंग (Packaging):               ₹60            │
│  ────────────────────────────────────────────────────  │
│  💰 AI सुझाया दाम (Suggested Selling):  ₹2,150         │
│  ────────────────────────────────────────────────────  │
│  💵 आपके खाते में आएंगे (You Take Home): ₹2,042       │
│     (5% प्लेटफार्म सहयोग शुल्क के बाद)                  │
└────────────────────────────────────────────────────────┘
```

---

# 11. Product Cards (Artisan & Buyer Variants)

### 11.1 Artisan Inventory Card (`card-product-artisan`)
- **Dimensions:** Full width, horizontal orientation (Image 120dp × 120dp on left; details on right).
- **Status Dot Badge:**
  - 🟢 Live in Market (`#1E5631`)
  - 🔴 Sold Out (`#B00020`)
  - ⏸️ Paused (`#ED6C02`)
- **Content:**
  - Title in local script (Max 2 lines, truncated with ellipsis).
  - Large price tag: `₹2,150`.
  - Stock count pill: `[ 2 पीस उपलब्ध ]`.
  - Action row: Quick-Edit Price button, 3-dot overflow menu.

### 11.2 Buyer Storefront Card (`card-product-buyer`)
- **Dimensions:** 2-column vertical card on mobile (168dp width).
- **Image:** 1:1 Aspect ratio studio enhanced photo with subtle drop shadow.
- **Badges:**
  - Top-left overlay: `[ GI TAGGED ✅ ]` in Ochre Gold.
  - Top-right overlay: Heart Wishlist trigger (48dp touch target).
- **Artisan Provenance Bar:**
  - 24dp round maker avatar + *"Sunita Devi, Madhubani"*.
- **Content:**
  - Title in 16sp SemiBold.
  - Price: `₹2,150` in bold + *"Free Delivery"*.
  - Fulfillment pill: 🟢 *"Ready to Ship"* or ⏱️ *"Made to Order"*.

```
┌───────────────────────────┐
│ [GI TAG]              (♡) │
│                           │
│     [ Product Image ]     │  1:1 Aspect Ratio
│                           │  Studio Enhanced
│                           │
├───────────────────────────┤
│ 👩‍🎨 Sunita Devi, Bihar    │  Artisan Provenance
│ Madhubani Fish Painting   │  Title (16sp)
│ ₹2,150                    │  Price (18sp Bold)
│ 🟢 Ships in 48 Hours      │  Fulfillment Badge
└───────────────────────────┘
```

---

# 12. Navigation Systems & Persistent Shell

### 12.1 Artisan Persistent Bottom Bar (`nav-artisan-bottom-bar`)
Height: **72dp** (Elevated to ensure comfortable finger clearance). Contains 4 primary tabs and a central docked floating camera action button:

```
┌───────────┬───────────┬───────────┬───────────┬───────────┐
│    🏠     │    📦     │    📸     │    💰     │    👤     │
│   होम     │   ऑर्डर   │ नया प्रोडक्ट│   खाता    │  प्रोफाइल │
│  (Home)   │  (Orders) │  (Center) │  (Khata)  │ (Profile) │
└───────────┴───────────┴───────────┴───────────┴───────────┘
```
- **Central Button:** Elevated 16dp above the bar with glowing border. Tapping launches instant camera capture.
- **Active Tab State:** Icon scales by 1.15×, icon and label turn Forest Emerald (`#1E5631`), 3dp pill indicator appears below label.
- **Unselected Tab State:** Icon and label render in Charcoal Secondary (`#49454F`).

### 12.2 Buyer Persistent Navigation
- Standard 5-tab bar: Home (`🏠`), Explore Craft Map (`🗺️`), Search (`🔍`), Wishlist (`❤️`), Cart (`🛒` with badge count).

---

# 13. Headers & Top App Bars

### 13.1 Artisan Dashboard Header (`header-artisan-dashboard`)
- **Height:** 64dp.
- **Left:** Artisan circular photo avatar + Verified Gold Checkmark badge.
- **Center:** Spoken greeting text: *"नमस्ते, सुनीता जी!"*.
- **Right:**
  - 🌐 Language Switcher Pill (e.g., `[ हिन्दी ▼ ]` — 48dp tap target).
  - 🔔 Notifications Bell with red badge counter.

### 13.2 Screen Flow Header (`header-flow-back`)
- **Height:** 56dp.
- **Left:** Large 48dp Back Arrow (`←`).
- **Center:** Screen title in 20sp Bold.
- **Right:** 🔊 Persistent Audio Readback Button (Tapping immediately speaks screen instructions aloud).

---

# 14. Tabs & Segmented Filters

Used to filter orders (`ART-SCR-28`) and inventory (`ART-SCR-26`):

```
┌─────────────────┬─────────────────┬─────────────────┐
│  🔔 नये [ 1 ]   │ 🔨 बन रहे [ 2 ] │ 🚚 भेजे [ 3 ]   │
│   Active Tab    │   Inactive Tab  │   Inactive Tab  │
│   Bg: #1E5631   │   Bg: #F0EAE1   │   Bg: #F0EAE1   │
│   Text: White   │   Text: #49454F │   Text: #49454F │
└─────────────────┴─────────────────┴─────────────────┘
```
- **Height:** 48dp pill shape.
- **Selection Indicator:** Full solid color fill (not a thin underline, which is invisible to low-vision users).
- **Haptic:** Emits `haptic-tick` on tab switch.

---

# 15. Chips & Filter Tags

### 15.1 Selection Chips (`chip-selection`)
Used for Craft Selection (`ART-SCR-07`) and Q&A suggestion answers (`ART-SCR-20`):
- **Height:** 44dp minimum.
- **Border Radius:** 22dp pill.
- **Unselected:** Border 1.5dp `#E0D7C9`, Background White, Text `#1A1C1E`.
- **Selected:** Border 2dp `#1E5631`, Background `#E8F5E9` (Emerald 100), Text `#1E5631`, Leading Checkmark icon (`✓`).

---

# 16. Badges, Seals & Trust Indicators

### 16.1 Verified Artisan Shield (`badge-verified-artisan`)
- **Visual:** Solid Ochre Gold shield icon (`#D4AF37`) with sharp white checkmark.
- **Label:** *"सत्यापित कलाकार / Verified Artisan ✅"*.
- **Guarantee:** Explains that maker identity was verified via Aadhaar / Government Craft Registry.

### 16.2 GI Tagged Authentic Seal (`badge-gi-tag`)
- **Visual:** National heritage seal icon with dark ochre background (`#5B4A10`) and gold text: `[ GI TAGGED HERITAGE CRAFT ]`.

### 16.3 Urgency Order Timer Badge (`badge-urgency-timer`)
- **Visual:** Amber background (`#FFF3E0`), Deep Orange text (`#E65100`), ticking clock icon: `[ ⏰ 14 घन्टे बाकी ]`.

---

# 17. Modals, Dialogs & Confirmation Overlays

### 17.1 Voice Confirmation Dialog (`modal-voice-confirm`)
Used when an artisan issues a voice command to change price or reject an order:
```
┌────────────────────────────────────────────────────────┐
│  ⚠️ क्या आप पक्का ऑर्डर मना करना चाहते हैं?          │
│  (Are you sure you want to reject this order?)         │
│                                                        │
│  🔊 "मना करने से यह आर्डर किसी दूसरे कलाकार को        │
│      चला जाएगा।"                                       │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  (✕) हाँ, मना करें / Yes, Reject                 │  │
│  │      Bg: #B00020, Height: 56dp                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  (←) नहीं, वापस जाएं / No, Keep Order            │  │
│  │      Bg: #F0EAE1, Height: 56dp                   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```
- **Backdrop:** Scrim color `#000000` with 60% opacity.
- **Audio Auto-Play:** The warning is spoken automatically as the modal opens.

---

# 18. Bottom Sheets & Action Drawers

### 18.1 Standard Bottom Sheet Container (`sheet-bottom-drawer`)
- **Corner Radius:** 24dp top-left and 24dp top-right.
- **Drag Handle:** 48dp wide, 4dp thick pill in `#C7C4BE` at the top center.
- **Behavior:** Slides up with smooth cubic-bezier curve (`(0.25, 1, 0.5, 1)`).
- **Dismissal:** Accessible by dragging down, tapping top close button, or pressing Android back button.

---

# 19. Loading Indicators & Cultural Spinners

Standard circular spinners feel technical and induce anxiety for rural users wondering if their phone froze. We replace them with recognizable cultural animations:

### 19.1 Spinning Potter's Wheel Spinner (`spinner-potters-wheel`)
- A stylized clay potter's wheel rotating smoothly at 45 RPM.
- Accompanying spoken prompt: *"कृपया एक पल रुकें, काम चल रहा है..."*.

### 19.2 Weaving Shuttle Linear Progress Bar (`progress-weaving-shuttle`)
- Used during AI Catalog Generation (`ART-SCR-21`).
- An authentic wooden handloom weaving shuttle moving back and forth across horizontal warp threads, progressively filling the progress track in Forest Emerald (`#1E5631`).

---

# 20. Skeletons & Shimmer States

- **Shimmer Gradient:** Base color `#EBE6DD` moving to highlight `#F7F4EE` at an angle of 20 degrees.
- **Animation Speed:** 1.4 seconds sweep cycle.
- **Structure Matching:** Skeletons strictly mimic the final loaded cards (rounded rectangles matching product photo shapes, pill-shaped tags, and thick button bars) to prevent layout shifts.

---

# 21. Empty States & Reassuring Guidance

Empty states must never feel like an error or dead end. They must provide visual warmth, spoken encouragement, and a large single action button.

### 21.1 Empty Shop State (`empty-state-shop`)
- **Illustration:** A cheerful rural Indian marketplace stall with empty wooden shelves and blooming marigold garlands.
- **Audio Prompt:** *"आपकी दुकान अभी खाली है! अपना पहला प्रोडक्ट जोड़ने के लिए बड़ा हरा बटन दबाएं।"*
- **Visual Title:** *"आपकी दुकान तैयार है! (Your shop is ready)"*.
- **Primary CTA:** 📸 **"पहला प्रोडक्ट जोड़ें / Add First Product"** (Pulsing button).

### 21.2 Empty Orders State (`empty-state-orders`)
- **Illustration:** A resting courier bicycle with an empty basket under a banyan tree.
- **Visual Copy:** *"अभी कोई नया आर्डर नहीं है। जब कोई ग्राहक सामान खरीदेगा, तो यहाँ घंटी बजेगी!"*.

---

# 22. Error States, Fallbacks & Self-Healing UI

### 22.1 Offline Network Banner (`banner-offline-persistent`)
- Renders permanently at the top of the screen when cellular data drops:
  - Background: Muted Slate (`#5C6B73`).
  - Text: *"📡 इंटरनेट नहीं है — आपका काम फोन में सुरक्षित है। (Working Offline)"*.
  - Icon: Cloud with offline slash.

### 22.2 Blurry Photo Detected Alert (`alert-camera-blur`)
- Overlay appears over camera thumbnail:
  - Amber border + double vibration (`haptic-error`).
  - Voice prompt: *"फोटो थोड़ी धुंधली है। हाथ स्थिर रख कर एक बार फिर खींचें।"*.
  - Two buttons: 🔄 **"दोबारा लें (Retake)"** vs. ⚠️ **"यही चलेगी (Keep)"**.

---

# 23. Success States, Confetti & Audio Celebrations

Closing the commerce loop is an emotional milestone for an artisan selling their craft online for the first time.

### 23.1 Product Published Celebration (`success-product-published`)
- **Visual:** Confetti particles in emerald, saffron, and gold burst across the screen for 2.5 seconds.
- **Audio:** Joyful temple bell and flute celebration chime.
- **Voice Congratulation:** *"बधाई हो सुनीता जी! आपका प्रोडक्ट अब बाज़ार में लाइव है।"*.
- **Card:** Craft Passport QR code shines with a moving light glint.

### 23.2 Bank Deposit Celebration (`success-money-credited`)
- **Visual:** Rupee coins falling smoothly into the digital passbook.
- **Audio:** Crisp metallic coin drop sound effect.
- **Voice Announcement:** *"आपके बैंक खाते में ₹2,042 जमा हो गए हैं!"*.

---

# 24. Design System Token Quick-Reference Table

```json
{
  "theme": "KalakarSetuLight",
  "colors": {
    "primary": "#1E5631",
    "primary_dark": "#0E2F1B",
    "primary_light": "#E8F5E9",
    "accent_terracotta": "#C04000",
    "accent_terracotta_dark": "#7F2A00",
    "gold_seal": "#D4AF37",
    "gold_seal_dark": "#5B4A10",
    "background_parchment": "#F9F6F0",
    "surface_card": "#FFFFFF",
    "border_card": "#E0D7C9",
    "text_primary": "#1A1C1E",
    "text_secondary": "#49454F",
    "status_error": "#B00020",
    "status_warning": "#ED6C02",
    "status_info": "#1B3B6F"
  },
  "typography": {
    "font_indic": "Noto Sans Indic Stack",
    "font_latin": "Inter Display",
    "scale_display_large": 32,
    "scale_headline_large": 24,
    "scale_body_large": 18,
    "scale_body_medium": 16,
    "indic_line_height_multiplier": 1.5
  },
  "touch": {
    "min_touch_target_dp": 56,
    "button_height_primary_dp": 56,
    "button_height_decision_dp": 64,
    "card_corner_radius_dp": 16,
    "gutter_horizontal_dp": 16
  }
}
```

---

*End of Setu Design System Specification — Production Blueprint for Kalakar Setu Mobile & Web UI*
