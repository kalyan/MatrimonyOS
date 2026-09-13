# Matrimony OS — System Architecture & Design

## 1. High-Level Product Architecture

Matrimony OS follows a **WhatsApp-First Engagement** model paired with a **Progressive Web Application (PWA)** core:

```text
[ Prospective User / Family Member ]
                 │
                 ▼
       ┌───────────────────┐
       │   WhatsApp Chat   │  ◄── Notification Layer (Deep Links, Click-to-Chat)
       └─────────┬─────────┘
                 │ (Opens deep link: /match/[id], /family/[token], /register?ref=...)
                 ▼
       ┌───────────────────┐
       │  Next.js PWA /    │  ◄── Application Layer (SSR + React Client Components)
       │  WhatsApp WebView │
       └─────────┬─────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌──────────────┐     ┌──────────────┐
│  AI Engine   │     │ Data Layer   │
│(Deterministic│     │(Dual-Mode:   │
│ + LLM API)   │     │Supabase /    │
└──────────────┘     │LocalFallback)│
                     └──────────────┘
```

---

## 2. Key Architectural Modules

### 2.1 WhatsApp Integration Layer (`WhatsAppService`)
- Encapsulates deep link formatting, Click-to-Chat parameter serialization, and WhatsApp WebView detection.
- Generates secure URLs without exposing sensitive database IDs in plain view.
- Provides fallback for web browser users while optimizing touch controls for WhatsApp in-app browser viewports.

### 2.2 Explainable AI Compatibility Engine (`calculateMatchScore`)
Unlike opaque black-box AI algorithms that make dubious psychological assertions, Matrimony OS uses a **transparent, multi-factor deterministic scoring model** (0–100):
- **Age Compatibility (15 pts)**: Bell-curve alignment with user-specified age boundaries.
- **Location & Relocation (15 pts)**: Same city, same state, or mutual willingness to relocate.
- **Education Alignment (15 pts)**: Postgraduate parity and graduate compatibility tiers.
- **Profession & Career (15 pts)**: Industry synergy and employment stability metrics.
- **Language & Community (15 pts)**: Mother tongue alignment and common linguistic fluency.
- **Lifestyle & Dietary (10 pts)**: Diet habits (Vegetarian, Non-Veg, Jain) and values.
- **Interests & Hobbies (15 pts)**: Mutual shared interests, sports, and creative pursuits.

### 2.3 Family Mode Workflow
```text
Candidate discovers profile
           │
           ▼
Shortlists / Shares to Family via WhatsApp
           │
           ▼
Parent opens secure Family Portal (/family/[token])
           │
           ▼
Parent submits private recommendation + notes
           │
           ▼
Audit record logged on Candidate's dashboard
           │
           ▼
Candidate decides whether to express interest
```

### 2.4 Privacy & Anti-Harassment Guardrails
- **No Unsolicited Messaging**: Members cannot send direct unapproved chat messages.
- **Two-Tier Contact Consent**:
  1. Member A sends interest -> Member B accepts -> Mutual Connection established.
  2. Member A requests contact exchange -> Member B explicitly clicks "Approve Contact Sharing" -> Verified WhatsApp / Phone number revealed.
- **Zero Search Indexing**: Global `X-Robots-Tag: noindex, nofollow` headers on all matrimonial routes.

---

## 3. Deployment Architecture (Zero Cost Tier)

- **Frontend**: Hosted on Vercel or Cloudflare Pages (Free Tier).
- **Backend & Database**: Supabase PostgreSQL with native connection pooling and Row-Level Security (Free Tier).
- **Fallback Mode**: In-memory and browser localStorage fallback repository ensures 100% functionality even when offline or before Supabase credentials are configured.
