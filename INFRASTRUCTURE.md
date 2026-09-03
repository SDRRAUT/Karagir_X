# Kalakar Setu — Production Infrastructure, CI/CD & DevOps Specification
## कला से बाज़ार तक | Kubernetes Cluster Topology, CI/CD Pipelines & High-Availability Operations

> **Document Type:** Production Infrastructure & Operations Specification  
> **Version:** 1.0  
> **Date:** 2026-09-03  
> **Hosting Sovereign Zone:** India Data Centers (AWS Mumbai `ap-south-1` / MeitY-Empanelled Cloud)  
> **Status:** 🟡 Production-Ready Infrastructure Specification

---

# Table of Contents

1. [Infrastructure Topology & Sovereign Cloud Strategy](#1-infrastructure-topology--sovereign-cloud-strategy)
2. [Kubernetes (K8s) Cluster Architecture](#2-kubernetes-k8s-cluster-architecture)
   - [2.1 Node Pools & Workload Separation](#21-node-pools--workload-separation)
   - [2.2 Ingress & Edge Routing (Traefik v3)](#22-ingress--edge-routing-traefik-v3)
   - [2.3 Horizontal Pod Autoscaling (HPA) Rules](#23-horizontal-pod-autoscaling-hpa-rules)
3. [Continuous Integration & Delivery (CI/CD) Pipelines](#3-continuous-integration--delivery-cicd-pipelines)
   - [3.1 Mobile Pipeline (Flutter Android & iOS)](#31-mobile-pipeline-flutter-android--ios)
   - [3.2 Backend Pipeline (FastAPI Microservices)](#32-backend-pipeline-fastapi-microservices)
4. [Environment Configuration & Secrets Management](#4-environment-configuration--secrets-management)
5. [Observability, Monitoring & Alerting (Prometheus, Loki, Grafana)](#5-observability-monitoring--alerting-prometheus-loki-grafana)
6. [Disaster Recovery, Backup Strategy & RPO/RTO](#6-disaster-recovery-backup-strategy--rporto)

---

# 1. Infrastructure Topology & Sovereign Cloud Strategy

To comply with Indian data sovereignty requirements under the **DPDP Act 2023** and **MeitY guidelines**, all production data (databases, customer details, voice recordings, and financial ledgers) resides exclusively within **Indian geographic boundaries** (AWS Mumbai `ap-south-1` and Hyderabad `ap-south-2`).

```
                              [ Cloudflare Edge CDN & DDoS Shield ]
                                                │
                                                ▼
                            [ AWS Network Load Balancer (NLB) ]
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             KUBERNETES CLUSTER (AWS EKS ap-south-1)                         │
│                                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              Traefik v3 Ingress Controller                             │  │
│  └───────────────┬───────────────────────────────────────┬───────────────────────────────┘  │
│                  │                                       │                                  │
│                  ▼                                       ▼                                  ▼
│  ┌───────────────────────────────┐       ┌───────────────────────────────┐       ┌───────┐  │
│  │    General CPU Node Pool      │       │     AI GPU Worker Node Pool   │       │ Redis │  │
│  │  (m6i.xlarge - 4 vCPU, 16GB)  │       │   (g5.xlarge - NVIDIA A10G)   │       │Cluster│  │
│  │                               │       │                               │       └───────┘  │
│  │ - auth-service (x3 replicas)  │       │ - cv-worker (U²-Net FastSAM)  │                  │
│  │ - catalog-service (x4 repl)   │       │ - bhashini-streaming-gateway  │                  │
│  │ - order-service (x3 repl)     │       │ - celery-task-runners         │                  │
│  │ - pricing-service (x2 repl)   │       └───────────────────────────────┘                  │
│  └───────────────────────────────┘                                                          │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
┌──────────────────────────────┐                              ┌──────────────────────────────┐
│  Amazon Aurora PostgreSQL 16 │                              │   Cloudflare R2 / AWS S3     │
│   (Multi-AZ Multi-Region)    │                              │     (Encrypted Media Assets) │
└──────────────────────────────┘                              └──────────────────────────────┘
```

---

# 2. Kubernetes (K8s) Cluster Architecture

### 2.1 Node Pools & Workload Separation

| Node Pool Name | Instance Type | vCPU / RAM | Accelerators | Workloads Hosted |
|---|---|---|---|---|
| `system-pool` | `m6i.large` | 2 vCPU / 8 GB | None | CoreDNS, Traefik Ingress, Metrics Server |
| `services-pool` | `m6i.xlarge` | 4 vCPU / 16 GB | None | FastAPI Microservices, Meilisearch Engine |
| `ai-gpu-pool` | `g5.xlarge` | 4 vCPU / 16 GB | 1x NVIDIA A10G (24GB VRAM) | U²-Net Segmentation, Real-ESRGAN Upscaling |
| `batch-pool` | `c6i.xlarge` | 4 vCPU / 8 GB | Spot Instances | Celery async workers, sync outbox processors |

### 2.2 Ingress & Edge Routing (Traefik v3)
- **Automatic Let's Encrypt TLS Termination:** Manages wildcard certificates (`*.kalakarsetu.in`).
- **HTTP/3 & gRPC Support:** High-efficiency transport for mobile voice streaming and live telemetry.
- **Middleware Chain:** Rate limiting (Redis sliding-window) + CORS validation + Security Headers (HSTS, CSP).

### 2.3 Horizontal Pod Autoscaling (HPA) Rules
- **CPU / Memory Threshold:** Autoscale triggered when average pod CPU $> 70\%$ or RAM $> 80\%$.
- **Custom Metrics (KEDA):** AI GPU workers autoscale based on **Redis Celery Queue Length**:
  $$\text{Target Replicas} = \left\lceil \frac{\text{Queue Depth}}{15} \right\rceil \quad (\text{Min: 2, Max: 12})$$

---

# 3. Continuous Integration & Delivery (CI/CD) Pipelines

GitHub Actions powers all automated testing, container builds, and canary rollouts.

### 3.1 Mobile Pipeline (`.github/workflows/mobile-release.yml`)

```yaml
name: Mobile CI/CD Pipeline
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  flutter-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Run Static Analysis & Lints
        run: flutter analyze

      - name: Run Unit & Widget Tests
        run: flutter test --coverage

      - name: Build Android App Bundle (AAB)
        run: flutter build appbundle --release
        env:
          SIGNING_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}

      - name: Deploy to Google Play Store (Internal Track)
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_STORE_JSON_KEY }}
          packageName: in.kalakarsetu.app
          releaseFiles: build/app/outputs/bundle/release/app-release.aab
          track: internal
```

### 3.2 Backend Pipeline (`.github/workflows/backend-deploy.yml`)

```yaml
name: Backend Services CI/CD
on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Run Pytest with Coverage
        run: |
          pip install -r requirements-dev.txt
          pytest --cov=services tests/

      - name: Security Vulnerability Scan (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

      - name: Build & Push Multi-Arch Docker Container
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ secrets.AWS_ECR_REGISTRY }}/kalakar-backend:${{ github.sha }}

      - name: Deploy to EKS via Helm (Canary Rollout)
        run: |
          helm upgrade --install kalakar-backend ./k8s/helm/kalakar-backend \
            --set image.tag=${{ github.sha }} \
            --namespace production
```

---

# 4. Environment Configuration & Secrets Management

Secrets are never stored in Git repositories. We use **AWS Secrets Manager / HashiCorp Vault** injected as native Kubernetes secrets via the External Secrets Operator (`ESO`).

### Environment Matrix

```
Variable Key               Development (dev)              Production (prod)
----------------------------------------------------------------------------------------------------
ENVIRONMENT                dev                            prod
LOG_LEVEL                  DEBUG                          INFO
POSTGRES_DB_NAME           kalakar_dev                    kalakar_prod
REDIS_HOST                 redis-dev.internal             redis-cluster.internal
CASHFREE_ENVIRONMENT       SANDBOX                        PRODUCTION
BHASHINI_API_ENDPOINT      https://nmt.bhashini.gov.in    https://prod-asr.bhashini.gov.in
S3_ASSET_BUCKET            kalakar-dev-assets             kalakar-prod-assets-mumbai
CORS_ORIGINS               http://localhost:3000          https://kalakarsetu.in,https://admin.kalakarsetu.in
```

---

# 5. Observability, Monitoring & Alerting (Prometheus, Loki, Grafana)

### 5.1 Telemetry Stack
- **Metrics (Prometheus):** Scraping `/metrics` endpoints for HTTP request duration (p95, p99), Celery job backlog, and database connection pool saturation.
- **Log Aggregation (Grafana Loki):** All microservices emit structured JSON logs:
  ```json
  {"timestamp":"2026-09-03T16:48:00Z","level":"INFO","service":"catalog-service","trace_id":"8912ab","artisan_id":"c4b1d6...","action":"product_published","duration_ms":120}
  ```
- **Error Tracing (Sentry):** Captures unhandled mobile exceptions and network timeout breadcrumbs.

### 5.2 Critical Alerting Rules

| Alert Name | Condition | Severity | Channel | Action Required |
|---|---|---|---|---|
| `EscrowDiscrepancyDetected` | `reconciliation_variance != 0` | **P0 Critical** | PagerDuty + SMS | Freeze batch payout; audit transaction logs |
| `BhashiniSTTHighLatency` | `p95(asr_duration_ms) > 1500` | **P1 High** | Slack `#ops-alerts` | Automatic circuit breaker failover to Google STT |
| `ArtisanOrderAutoCancelSpike` | `increase(order_auto_cancels[1h]) > 10` | **P1 High** | WhatsApp Ops Desk | Investigate rural connectivity or push notifications |
| `PostgresPoolNearCapacity` | `db_connections / max_connections > 0.85` | **P2 Medium** | Slack `#infra-alerts` | Scale read replicas or review long-running queries |

---

# 6. Disaster Recovery, Backup Strategy & RPO/RTO

### Recovery Objectives
- **Recovery Point Objective (RPO):** $\le 15\text{ minutes}$ (Maximum tolerable data loss in disaster).
- **Recovery Time Objective (RTO):** $\le 60\text{ minutes}$ (Maximum system downtime).

### Backup & Failover Execution
1. **Automated PostgreSQL Continuous Archiving:** Point-in-Time Recovery (PITR) with WAL (Write-Ahead Logs) continuously streamed to an isolated S3 backup bucket in Hyderabad (`ap-south-2`).
2. **Daily Snapshot Retention:** Automated daily snapshots retained for 30 days; weekly snapshots retained for 1 year.
3. **Cross-Region Failover Plan:** If AWS Mumbai (`ap-south-1`) suffers an outage, the secondary warm standby in Hyderabad (`ap-south-2`) is promoted via automated Route 53 DNS failover.

---

*End of Production Infrastructure, CI/CD & DevOps Specification — Kalakar Setu Platform*
