# Kalakar Setu — RESTful & Streaming API Contract Specification
## कला से बाज़ार तक | OpenAPI 3.0 Endpoints, Request/Response Payloads & Streaming Protocols

> **Document Type:** Production API Contract Specification  
> **Version:** 1.0  
> **Date:** 2026-09-03  
> **Protocol Standards:** REST over HTTPS (TLS 1.3), gRPC for Voice Streaming, WebSockets for Live Telemetry  
> **Status:** 🟡 Production-Ready API Specification

---

# Table of Contents

1. [Global API Standards & Conventions](#1-global-api-standards--conventions)
2. [Authentication & Session Tokens](#2-authentication--session-tokens)
3. [Error Handling & Standard Error Envelopes](#3-error-handling--standard-error-envelopes)
4. [Domain API Contracts](#4-domain-api-contracts)
   - [4.1 Authentication & Profile Switch API](#41-authentication--profile-switch-api)
   - [4.2 Artisan Profile, Location & KYC API](#42-artisan-profile-location--kyc-api)
   - [4.3 AI Computer Vision & Studio Enhancement API](#43-ai-computer-vision--studio-enhancement-api)
   - [4.4 AI Voice Streaming & Conversational Q&A API](#44-ai-voice-streaming--conversational-qa-api)
   - [4.5 AI Catalog Synthesis & Translation API](#45-ai-catalog-synthesis--translation-api)
   - [4.6 Dynamic Fair Pricing Engine API](#46-dynamic-fair-pricing-engine-api)
   - [4.7 Product Catalog & Digital Craft Passport API](#47-product-catalog--digital-craft-passport-api)
   - [4.8 Buyer Storefront Discovery & Search API](#48-buyer-storefront-discovery--search-api)
   - [4.9 Orders Lifecycle & Voice Fulfillment API](#49-orders-lifecycle--voice-fulfillment-api)
   - [4.10 Logistics, Consignments & Tracking API](#410-logistics-consignments--tracking-api)
   - [4.11 Escrow Ledger, Bank Setup & Payouts API](#411-escrow-ledger-bank-setup--payouts-api)
   - [4.12 B2B Institutional RFQs & Cluster API](#412-b2b-institutional-rfqs--cluster-api)
   - [4.13 Offline Delta Synchronization Engine API](#413-offline-delta-synchronization-engine-api)
   - [4.14 Reviews, Ratings & Disputes API](#414-reviews-ratings--disputes-api)
   - [4.15 Admin Operations & Moderation API](#415-admin-operations--moderation-api)

---

# 1. Global API Standards & Conventions

### Base URLs
- **Production API:** `https://api.kalakarsetu.in/v1`
- **Voice Streaming gRPC:** `grpc.api.kalakarsetu.in:443`
- **Live Order Telemetry WebSocket:** `wss://api.kalakarsetu.in/v1/ws/telemetry`

### Headers
Every client HTTP request must include:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
X-Client-Platform: Android | iOS | Web
X-App-Version: 1.0.4
X-Locale: hi_IN
X-Idempotency-Key: <UUID_V4>
```

---

# 2. Authentication & Session Tokens

- **Access Token:** Asymmetric signed JWT (RS256 algorithm, 1-hour expiry).
- **Refresh Token:** Cryptographically random 256-bit string stored in HTTP-only secure cookie or Android KeyStore (30-day expiry).
- **Idempotency Key:** Mandatory for all state-mutating requests (`POST`, `PUT`, `PATCH`) to prevent duplicate transactions on unstable rural cellular networks.

---

# 3. Error Handling & Standard Error Envelopes

Every error response returns standard RFC 7807 Problem Details:

```json
{
  "error": {
    "code": "ORDER_ACCEPTANCE_TIMEOUT",
    "message": "The 24-hour window for accepting this order has expired.",
    "voice_prompt_locale": {
      "hi": "Yeh order 24 ghante ke andar accept nahi kiya gaya, isliye cancel ho gaya hai.",
      "en": "This order was not accepted within 24 hours and has been cancelled."
    },
    "details": {
      "order_id": "KS-2026-98124",
      "expired_at": "2026-09-03T12:00:00Z"
    },
    "timestamp": "2026-09-03T16:47:00Z"
  }
}
```

---

# 4. Domain API Contracts

---

### 4.1 Authentication & Profile Switch API

#### `POST /auth/artisan/send-otp`
- **Purpose:** Request 6-digit SMS OTP for artisan mobile login.
- **Auth:** None (Public).
- **Request Body:**
  ```json
  {
    "phone_number": "+919876543210",
    "locale": "hi_IN"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "status": "OTP_DISPATCHED",
    "session_id": "sess_89a1f2b4",
    "retry_after_seconds": 60
  }
  ```

#### `POST /auth/artisan/verify-otp`
- **Purpose:** Verify OTP and return JWT access and refresh tokens.
- **Auth:** None.
- **Request Body:**
  ```json
  {
    "session_id": "sess_89a1f2b4",
    "otp_code": "849201"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "ref_98a72b...",
    "expires_in_seconds": 3600,
    "user": {
      "id": "c4b1d6f2-98e3-4a11-b0e2-8921a4f02b11",
      "phone_number": "+919876543210",
      "full_name": "Sunita Devi",
      "role": "ARTISAN",
      "is_new_user": false
    }
  }
  ```

#### `POST /auth/switch-profile`
- **Purpose:** Switch active artisan account on a shared household device.
- **Auth:** Required (`Bearer`).
- **Request Body:**
  ```json
  {
    "target_artisan_id": "e2f1a098-33b2-4c89-9812-7812bc44a101",
    "pin_code": "4921"
  }
  ```
- **Response `200 OK`:** Returns new profile JWT.

---

### 4.2 Artisan Profile, Location & KYC API

#### `GET /artisan/profile`
- **Purpose:** Fetch complete artisan profile, health score, and verification tier.
- **Auth:** Required (`ARTISAN`).
- **Response `200 OK`:**
  ```json
  {
    "id": "c4b1d6f2-98e3-4a11-b0e2-8921a4f02b11",
    "full_name": "Sunita Devi",
    "craft_category_code": "PAINTING_MITHILA",
    "verification_tier": "AADHAAR_VERIFIED",
    "health_score": 94,
    "village_name": "Ranti",
    "district": "Madhubani",
    "state": "Bihar",
    "bank_verified": true,
    "bank_summary": {
      "bank_name": "State Bank of India",
      "account_masked": "XXXX-XXXX-4921"
    }
  }
  ```

#### `POST /artisan/kyc/aadhaar-verify`
- **Purpose:** Execute tokenized Aadhaar OTP verification via DigiLocker.
- **Auth:** Required.
- **Request Body:**
  ```json
  {
    "aadhaar_number": "123456789012",
    "otp_code": "654321",
    "txn_reference": "uidai_txn_8912"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "verification_status": "VERIFIED",
    "verification_tier": "AADHAAR_VERIFIED",
    "verified_name_match_score": 0.98
  }
  ```

---

### 4.3 AI Computer Vision & Studio Enhancement API

#### `POST /ai/vision/enhance-photo`
- **Purpose:** Background segmentation, color calibration, drop-shadow generation, and upscaling.
- **Auth:** Required.
- **Content-Type:** `multipart/form-data`
  - `photo`: Binary JPEG file.
  - `craft_category`: String (e.g., `'TEXTILE_HANDLOOM'`).
- **Response `200 OK`:**
  ```json
  {
    "raw_asset_url": "https://cdn.kalakarsetu.in/raw/img_8912.jpg",
    "enhanced_asset_url": "https://cdn.kalakarsetu.in/enhanced/img_8912.webp",
    "thumbnail_url": "https://cdn.kalakarsetu.in/thumb/img_8912.webp",
    "quality_metrics": {
      "sharpness_score": 0.92,
      "color_accuracy_score": 0.96,
      "segmentation_confidence": 0.94
    },
    "processing_time_ms": 3420
  }
  ```

---

### 4.4 AI Voice Streaming & Conversational Q&A API

#### `POST /ai/voice/transcribe-turn`
- **Purpose:** Transcribe audio snippet in regional language and extract craft entities.
- **Auth:** Required.
- **Content-Type:** `multipart/form-data`
  - `audio`: WAV file (16kHz mono).
  - `source_language`: String (e.g., `'hi'`).
- **Response `200 OK`:**
  ```json
  {
    "transcript": "Yeh handmade cotton paper par bani Madhubani machhli painting hai.",
    "extracted_entities": {
      "craft_category": "PAINTING_MITHILA",
      "material": "Handmade Cotton Paper",
      "motif": "Fish / Matsya"
    },
    "next_follow_up_question": {
      "question_id": "labor_hours",
      "text_in_artisan_language": "Isay banane mein kitne din lage?",
      "audio_prompt_url": "https://cdn.kalakarsetu.in/audio/prompts/q_labor_hi.aac"
    },
    "is_complete": false
  }
  ```

---

### 4.5 AI Catalog Synthesis & Translation API

#### `POST /ai/catalog/synthesize`
- **Purpose:** Synthesize trilingual product title, storytelling copy, and care instructions.
- **Auth:** Required.
- **Request Body:**
  ```json
  {
    "craft_category_code": "PAINTING_MITHILA",
    "entities": {
      "material": "Handmade Cotton Paper, Botanical Dyes",
      "labor_hours": 28,
      "motifs": ["Fish", "Tree of Life"]
    },
    "artisan_id": "c4b1d6f2-98e3-4a11-b0e2-8921a4f02b11"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "titles": {
      "en": "Handcrafted Madhubani Fish Painting on Cotton Rag Paper",
      "hi": "हाथ से बनी मधुबनी मछली पेंटिंग — प्राकृतिक रंगों द्वारा",
      "bn": "হাতে তৈরি মধুবনী মাছের চিত্রকর্ম"
    },
    "descriptions": {
      "en": "Crafted over 4 days by artisan Sunita Devi in Ranti village...",
      "hi": "रंती गांव की कलाकार सुनीता देवी द्वारा 4 दिनों में तैयार की गई..."
    },
    "care_instructions": {
      "en": "Keep away from direct moisture and frame under UV glass."
    },
    "tags": ["Madhubani", "Folk Art", "Eco-Friendly", "Fish Motif", "Wall Decor"]
  }
  ```

---

### 4.6 Dynamic Fair Pricing Engine API

#### `POST /pricing/calculate-fair-price`
- **Purpose:** Compute fair price suggestion and transparent cost breakdown.
- **Auth:** Required.
- **Request Body:**
  ```json
  {
    "craft_category_code": "PAINTING_MITHILA",
    "labor_hours": 28,
    "artisan_state": "Bihar",
    "material_declared_cost": 250.00
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "suggested_price": 2150.00,
    "breakdown": {
      "material_cost": 250.00,
      "labor_cost": 1400.00,
      "complexity_fee": 350.00,
      "packaging_cost": 60.00,
      "market_demand_adjustment": 90.00
    },
    "net_take_home": 2042.50,
    "platform_fee": 107.50,
    "minimum_legal_floor": 1650.00
  }
  ```

---

### 4.7 Product Catalog & Digital Craft Passport API

#### `POST /products`
- **Purpose:** Create and publish a product listing with Craft Passport QR.
- **Auth:** Required (`ARTISAN`).
- **Request Body:**
  ```json
  {
    "title": { "en": "Madhubani Fish Painting", "hi": "मधुबनी मछली पेंटिंग" },
    "description": { "en": "Authentic folk painting...", "hi": "पारंपरिक लोक कला..." },
    "craft_category_code": "PAINTING_MITHILA",
    "selling_price": 2150.00,
    "ai_suggested_price": 2150.00,
    "labor_hours": 28,
    "stock_quantity": 1,
    "stock_type": "READY_STOCK",
    "images": [
      { "enhanced_url": "https://cdn.../enhanced.webp", "is_primary": true }
    ],
    "voice_story_asset_id": "audio_8912"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "id": "prod_49b201a",
    "status": "ACTIVE",
    "craft_passport": {
      "passport_code": "IN-BR-MDB-2026-89421",
      "qr_code_svg_url": "https://cdn.../qr_89421.svg",
      "public_url": "https://kalakarsetu.in/craft/IN-BR-MDB-2026-89421"
    }
  }
  ```

---

### 4.8 Buyer Storefront Discovery & Search API

#### `GET /buyer/search?q=madhubani&filters=gi_tagged:true&sort=relevance&page=1`
- **Purpose:** Search catalog with faceted filters and new-artisan discovery quotas.
- **Auth:** None (Public).
- **Response `200 OK`:**
  ```json
  {
    "total_results": 48,
    "page": 1,
    "total_pages": 3,
    "products": [
      {
        "id": "prod_49b201a",
        "title": "Madhubani Fish Painting",
        "price": 2150.00,
        "primary_image_url": "https://cdn.../thumb.webp",
        "artisan_name": "Sunita Devi",
        "district": "Madhubani",
        "state": "Bihar",
        "is_gi_certified": true,
        "rating": 4.9,
        "stock_type": "READY_STOCK"
      }
    ]
  }
  ```

---

### 4.9 Orders Lifecycle & Voice Fulfillment API

#### `POST /orders/checkout`
- **Purpose:** Buyer order initiation; locks escrow and creates split artisan sub-orders.
- **Auth:** Required (`BUYER`).
- **Request Body:**
  ```json
  {
    "cart_items": [
      { "product_id": "prod_49b201a", "quantity": 1 }
    ],
    "shipping_address": {
      "recipient_name": "Pooja Sharma",
      "phone": "+919811122233",
      "street": "Flat 402, Lotus Heights",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001"
    },
    "payment_method": "UPI"
  }
  ```
- **Response `201 Created`:** Returns `order_id` and payment gateway checkout session tokens.

#### `POST /artisan/orders/{sub_order_id}/accept`
- **Purpose:** Artisan accepts order via single tap or voice intent.
- **Auth:** Required (`ARTISAN`).
- **Response `200 OK`:**
  ```json
  {
    "status": "CONFIRMED",
    "dispatch_deadline_at": "2026-09-06T18:00:00Z",
    "voice_confirmation_url": "https://cdn.../order_accepted_hi.aac"
  }
  ```

---

### 4.10 Logistics, Consignments & Tracking API

#### `POST /logistics/shipment/generate-manifest`
- **Purpose:** Book postal consignment and generate digital barcode for phone screen scanning.
- **Auth:** Required.
- **Request Body:**
  ```json
  {
    "sub_order_id": "sub_ord_8921",
    "fulfillment_mode": "POST_OFFICE_DROP"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "carrier_name": "INDIA_POST_SPEED_POST",
    "tracking_number": "SP123456789IN",
    "barcode_base64": "data:image/png;base64,iVBORw0...",
    "shipping_label_pdf_url": "https://cdn.../label_8921.pdf"
  }
  ```

---

### 4.11 Escrow Ledger, Bank Setup & Payouts API

#### `GET /artisan/earnings/passbook`
- **Purpose:** Fetch digital passbook balances and recent payout records.
- **Auth:** Required (`ARTISAN`).
- **Response `200 OK`:**
  ```json
  {
    "lifetime_earnings": 24800.00,
    "monthly_earnings": 8400.00,
    "in_escrow_pending": 2042.50,
    "recent_transactions": [
      {
        "amount": 2090.00,
        "date": "2026-08-28T10:30:00Z",
        "type": "CREDIT",
        "bank_utr": "UTR981240129",
        "order_number": "KS-2026-9812"
      }
    ]
  }
  ```

---

### 4.12 B2B Institutional RFQs & Cluster API

#### `POST /b2b/clusters/{id}/accept-quota`
- **Purpose:** Artisan accepts assigned cluster production quota.
- **Auth:** Required (`ARTISAN`).
- **Request Body:**
  ```json
  {
    "cluster_id": "clust_diwali_04",
    "accepted_units": 50
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "status": "ACCEPTED",
    "advance_deposit_released": 7500.00,
    "milestone_1_deadline": "2026-09-10"
  }
  ```

---

### 4.13 Offline Delta Synchronization Engine API

#### `POST /sync/batch-outbox`
- **Purpose:** Upload queued offline mutations from mobile SQLite outbox.
- **Auth:** Required.
- **Request Body:**
  ```json
  {
    "mutations": [
      {
        "mutation_id": "mut_8912a",
        "entity_type": "PRODUCT_DRAFT",
        "action": "CREATE",
        "payload": { ... },
        "client_timestamp": 1788429000
      },
      {
        "mutation_id": "mut_8912b",
        "entity_type": "ORDER_ACCEPT",
        "action": "UPDATE",
        "payload": { "sub_order_id": "sub_ord_8921" },
        "client_timestamp": 1788429005
      }
    ]
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "processed_mutation_ids": ["mut_8912a", "mut_8912b"],
    "conflicts": []
  }
  ```

---

### 4.14 Reviews, Ratings & Disputes API

#### `POST /buyer/disputes/create`
- **Purpose:** File return claim with mandatory transit damage photo evidence.
- **Auth:** Required (`BUYER`).
- **Request Body:**
  ```json
  {
    "sub_order_id": "sub_ord_8921",
    "reason": "TRANSIT_DAMAGE",
    "evidence_photo_urls": [
      "https://cdn.../damage_box.jpg",
      "https://cdn.../damage_pot.jpg"
    ],
    "description": "Item arrived broken into pieces."
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "dispute_id": "disp_7712",
    "escrow_status": "DISPUTED_LOCKED",
    "eta_resolution_hours": 24
  }
  ```

---

### 4.15 Admin Operations & Moderation API

#### `POST /admin/moderation/{id}/adjudicate`
- **Purpose:** Approve or reject AI-flagged listings.
- **Auth:** Required (`ADMIN_STAFF`).
- **Request Body:**
  ```json
  {
    "decision": "APPROVE",
    "moderator_notes": "False positive; verified authentic handloom weave."
  }
  ```
- **Response `200 OK`:** Returns updated product status (`ACTIVE`).

---

*End of Production API Contract Specification — Kalakar Setu Platform*
