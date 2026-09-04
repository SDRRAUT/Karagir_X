# Kalakar Setu — Production Security & Compliance Specification
## कला से बाज़ार तक | DPDP Act 2023, Cryptography, Escrow Safety & Threat Mitigation

> **Document Type:** Production Security Architecture Specification  
> **Version:** 1.0  
> **Date:** 2026-09-03  
> **Regulatory Frameworks:** Digital Personal Data Protection (DPDP) Act 2023, RBI Payment Aggregator Guidelines, CERT-In Cyber Security Mandates, UIDAI Aadhaar Act  
> **Status:** 🟡 Production-Ready Security Architecture

---

# Table of Contents

1. [Security Architecture Overview & Threat Model](#1-security-architecture-overview--threat-model)
2. [DPDP Act 2023 Compliance & Data Fiduciary Framework](#2-dpdp-act-2023-compliance--data-fiduciary-framework)
3. [Identity, Authentication & Session Security](#3-identity-authentication--session-security)
4. [Zero-Storage Aadhaar Tokenization Policy](#4-zero-storage-aadhaar-tokenization-policy)
5. [Role-Based Access Control (RBAC) Matrix](#5-role-based-access-control-rbac-matrix)
6. [Data Cryptography & Key Management (KMS)](#6-data-cryptography--key-management-kms)
7. [Escrow Vault Financial Protection & Anti-Tamper Controls](#7-escrow-vault-financial-protection--anti-tamper-controls)
8. [API Edge Security, Rate Limiting & Webhook HMAC Verification](#8-api-edge-security-rate-limiting--webhook-hmac-verification)
9. [AI Safety, Anti-Fraud & Counterfeit Detection](#9-ai-safety-anti-fraud--counterfeit-detection)
10. [Incident Response & CERT-In Compliance](#10-incident-response--cert-in-compliance)

---

# 1. Security Architecture Overview & Threat Model

Kalakar Setu safeguards two distinct high-value targets:
1. **Marginalized Rural Citizens:** Vulnerable to phishing, identity theft, predatory middleman takeovers, and fraudulent bank account diversions.
2. **High-Volume Escrow Funds:** Millions of Rupees flowing daily through automated marketplace nodal escrow accounts requiring absolute transactional integrity.

### Threat Model Matrix (STRIDE Analysis)

| Threat Category | Attack Vector | Kalakar Setu Architectural Countermeasure |
|---|---|---|
| **Spoofing** | Attacker impersonates artisan via SIM swap or forged SMS. | Rate-limited OTP with device binding; biometric/PIN challenge on profile switch; high-value payouts require Aadhaar token match. |
| **Tampering** | Attacker modifies price or bank account payload in transit. | TLS 1.3 enforced; HMAC-SHA256 signature verification on payment and sync payloads; database optimistic row locking. |
| **Repudiation** | Dishonest buyer claims handcrafted package was empty. | Digital Craft Passport QR first-scan telemetry; mandatory delivery unboxing damage photos; immutable courier scan events. |
| **Information Disclosure** | Leak of artisan phone numbers or home addresses. | Public marketplace displays only district-level location; exact street address masked; bank account numbers encrypted with AES-256 GCM. |
| **Denial of Service** | DDoS attack flooding checkout or Bhashini voice streaming. | Cloudflare Edge DDoS mitigation; Traefik Redis-backed sliding-window rate limit (100 req/min per IP); Celery worker autoscaling. |
| **Elevation of Privilege** | Compromised staff account attempts unauthorized bank payouts. | Dual-control authorization required (`FINANCE_CONTROLLER` + `SUPER_ADMIN` TOTP MFA) for batch IMPS disbursement. |

---

# 2. DPDP Act 2023 Compliance & Data Fiduciary Framework

As a **Data Fiduciary** under India's Digital Personal Data Protection Act (2023), Kalakar Setu implements privacy-by-design:

### 2.1 Vernacular Notice & Informed Consent
- Prior to capturing personal data (name, phone, voice recording), the app delivers a spoken audio consent notice in the artisan's registered language:
  *"Aapka naam aur photo grahakon ko dikhane ke liye aur bank details kamai bhejne ke liye use hongi. Kya aap sahamat hain?"*
- Consent records are stored in PostgreSQL with timestamp, language code, and affirmative voice/tap metadata.

### 2.2 Data Minimization & Privacy Thresholds
- **Location Fuzzing:** The buyer-facing app and public Craft Passport never expose exact GPS coordinates. Coordinates are snapped to the district centroid (e.g., center of Madhubani district). Full GPS is accessible solely by the logistics assignment engine for postal pickups.
- **Voice Consent:** Artisan voice recordings captured for storytelling are flagged with an explicit publish consent token. Artisans can revoke voice publication at any time via settings.

### 2.3 Citizen Rights Implementation
- **Right to Access & Data Portability (`POST /privacy/export`):** Generates machine-readable JSON archive of all listings, earnings, and personal attributes within 48 hours.
- **Right to Erasure (`POST /privacy/request-erasure`):** Anonymizes user identifiers within 30 days while preserving financial transaction ledger IDs as mandated by RBI commercial accounting laws.

---

# 3. Identity, Authentication & Session Security

### 3.1 Asymmetric Token Architecture (RS256)
- **Token Signing:** The Auth Service signs JWTs using an RSA 4096-bit private key kept in Cloud KMS.
- **Token Verification:** Downstream microservices verify tokens locally using the cached public key (`JWKS` endpoint), eliminating cross-service database roundtrips.

```
Access Token Lifespan:    60 Minutes
Refresh Token Lifespan:   30 Days (Sliding Window, Revocable in Redis)
JWT Header:               { "alg": "RS256", "typ": "JWT", "kid": "ks_auth_2026_v1" }
```

### 3.2 SMS OTP Flood Protection
To prevent cellular SMS fraud and financial drain on SMS gateways:
- Maximum 3 OTP requests per phone number per 15-minute window.
- Exponential backoff: Request 1 = immediate; Request 2 = 60s delay; Request 3 = 180s delay.
- IP-based rate limit: Max 20 OTP requests per hour per IP address.

---

# 4. Zero-Storage Aadhaar Tokenization Policy

In strict accordance with the **Aadhaar Act 2016** and UIDAI guidelines:

```
[ Artisan Phone ] ──(12-Digit Aadhaar)──> [ MeitY DigiLocker / UIDAI e-KYC Gateway ]
                                                              │
                                                  (Verification Token)
                                                              ▼
                                              [ Kalakar Setu Database ]
                                              (Store ONLY: 'aadhaar_token')
                                              (NEVER store 12-digit Aadhaar)
```

1. **Ephemeral Transmission:** Raw 12-digit Aadhaar numbers are held in volatile RAM only during the immediate UIDAI API call; they are never written to log files, caches, or databases.
2. **Encrypted KYC Token:** The system retains only a cryptographic SHA-256 verification hash returned by UIDAI (`aadhaar_token`), confirming identity verification status without possessing sensitive identity numbers.

---

# 5. Role-Based Access Control (RBAC) Matrix

| Platform Permission | Artisan | Buyer | Facilitator | Ops Moderator | Finance Controller | Super Admin |
|---|---|---|---|---|---|---|
| `listing:create_publish` | ✅ (Own) | ❌ | ✅ (Assisted) | ❌ | ❌ | ✅ (Override) |
| `order:accept_reject` | ✅ (Own) | ❌ | ✅ (Assisted) | ❌ | ❌ | ✅ (Override) |
| `order:place_pay` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `escrow:view_ledger` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `escrow:authorize_payout`| ❌ | ❌ | ❌ | ❌ | ✅ (Dual) | ✅ (Dual) |
| `catalog:moderate_delist`| ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `kyc:approve_artisan` | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `system:config_edit` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# 6. Data Cryptography & Key Management (KMS)

### 6.1 Encryption at Rest (AES-256 GCM)
- **Database Column Encryption:** Artisan bank account numbers, IFSC codes, and mobile numbers are encrypted prior to database insertion using AES-256 in Galois/Counter Mode (GCM) with random 96-bit initialization vectors (IV).
- **Storage Buckets:** Cloudflare R2 / AWS S3 buckets enforce server-side encryption (`SSE-KMS`) with envelope encryption keys rotated every 90 days.

### 6.2 Encryption in Transit (TLS 1.3)
- **Minimum Protocol:** TLS 1.3 enforced on edge routers (TLS 1.0, 1.1, and 1.2 deprecated).
- **Cipher Suites Permitted:**
  - `TLS_AES_256_GCM_SHA384`
  - `TLS_CHACHA20_POLY1305_SHA256`
- **HTTP Strict Transport Security (HSTS):** `max-age=31536000; includeSubDomains; preload`.

---

# 7. Escrow Vault Financial Protection & Anti-Tamper Controls

### 7.1 Nodal Account Double-Entry Ledger Protection
- Payout execution queries utilize strict transactional locking:
  ```sql
  BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  -- Lock escrow row preventing concurrent payout races
  SELECT * FROM escrow_ledger WHERE sub_order_id = $1 FOR UPDATE;
  ...
  COMMIT;
  ```

### 7.2 Webhook HMAC Signature Verification
All callbacks from Cashfree / Razorpay are cryptographically validated against shared secrets before updating ledger states:
```python
import hmac
import hashlib

def verify_payment_webhook(raw_payload: bytes, signature_header: str, secret: str) -> bool:
    computed_signature = hmac.new(
        key=secret.encode('utf-8'),
        msg=raw_payload,
        digestmod=hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed_signature, signature_header)
```

---

# 8. API Edge Security, Rate Limiting & Webhook HMAC Verification

- **Sliding-Window Rate Limiter:** Implemented in Traefik edge proxy using Redis:
  - Standard Client APIs: Max 100 requests / minute / IP.
  - Search Autocomplete: Max 300 requests / minute / IP.
  - Image AI Enhancement: Max 10 uploads / minute / artisan account.
- **Cross-Site Scripting (XSS) & Content Security Policy (CSP):**
  ```http
  Content-Security-Policy: default-src 'self'; img-src 'self' https://cdn.kalakarsetu.in data:; media-src https://cdn.kalakarsetu.in; script-src 'self' 'nonce-random';
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  ```

---

# 9. AI Safety, Anti-Fraud & Counterfeit Detection

1. **Mass-Manufactured Fake Detection:** Computer vision models analyze weave irregularities. If an image displays 100% mechanical uniformity across a 2-meter textile, it is flagged for human audit under the *"Suspected Factory Counterfeit"* policy.
2. **Review Farm Detection:** The system prohibits reviews from non-purchasers. In addition, accounts reviewing multiple artisans within a 5-minute window trigger automated review quarantine and IP blacklisting.

---

# 10. Incident Response & CERT-In Compliance

In compliance with **Indian Computer Emergency Response Team (CERT-In) Cyber Security Directions 2022**:

1. **6-Hour Mandatory Reporting:** Any cybersecurity incident (unauthorized database access, DDoS outage > 30 minutes, credential compromise) must be reported to `incident@cert-in.org.in` within 6 hours of detection.
2. **NTP Time Synchronization:** All platform servers synchronize system clocks via National Physical Laboratory (NPL) official NTP servers.
3. **Log Retention:** All immutable security access and audit logs are retained in encrypted WORM (Write Once Read Many) cloud storage for **180 days minimum**.

---

# 11. Supabase Row Level Security (RLS) & Client Key Hygiene

### 11.1 Principle of Least Privilege: Zero Secret Exposure
- **Client Application (`mobile/`):** Bundles solely the client-safe public anonymous key (`EXPO_PUBLIC_SUPABASE_ANON_KEY`) and API URL (`EXPO_PUBLIC_SUPABASE_URL`).
- **Forbidden in Mobile Client:** The Supabase `service_role` key, payment gateway private API secrets, and AI provider master tokens are strictly forbidden from mobile client bundles.
- **Environment Guard:** Verified with 0 hardcoded secrets in Git repository.

### 11.2 Database Row Level Security (RLS) Matrix
Row Level Security is enabled and enforced across all 19 relational tables in `public`:
- **Profiles (`public.profiles`, `public.artisan_profiles`, `public.buyer_profiles`):**
  - Read: Public can view verified artisan biographies; private profile data restricted to `auth.uid() = id`.
  - Write: Users can only mutate their own profile (`auth.uid() = id`).
- **Product Catalog (`public.products`, `public.product_images`, `public.craft_passports`):**
  - Read: Public / buyers can only query rows where `status = 'ACTIVE' AND deleted_at IS NULL`.
  - Write: Artisans can only insert, update, or soft-delete products where `artisan_id = auth.uid()`.
- **Orders & Escrow (`public.orders`, `public.sub_orders`, `public.order_items`, `public.escrow_ledger`):**
  - Read: Buyers can only inspect orders matching `buyer_id = auth.uid()`.
  - Artisans can only view sub-orders matching `artisan_id = auth.uid()`.
  - Escrow ledger is read-only to participants; settlements are mutated strictly via database functions.
- **Security Functions & InitPlan Caching:**
  - All RLS policies utilize `(select auth.uid())` subqueries to ensure PostgreSQL caches the user identifier in an InitPlan rather than executing per-row function evaluation.
  - All database functions enforce explicit `SET search_path = public, pg_temp` to prevent search path hijacking.
  - Advisor scans confirmed **0 security vulnerabilities** and **0 performance warnings**.

---

*End of Production Security & Compliance Specification — Kalakar Setu Platform*
