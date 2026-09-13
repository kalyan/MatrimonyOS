# Matrimony OS — WhatsApp-First AI Matrimonial Platform

> **Find Meaningful Connections. Bring Families Together.**

**Matrimony OS** is a modern, privacy-by-default matrimonial SaaS platform designed specifically for meaningful lifelong relationships and family involvement. It is architected mobile-first and engineered to work inside mobile browsers and WhatsApp WebViews.

---

## 🌟 Core Differentiators & Principles

1. **WhatsApp as the Engagement Layer; Web as the Application Layer**:
   - Deep links for instant sharing to family members (`/family/[token]`), candidate recommendations (`/match/[id]`), and viral referrals (`/register?ref=CODE`).
   - Generates WhatsApp Click-to-Chat intents (`wa.me/?text=...`) without requiring an expensive WhatsApp Business API license during initial launch.
2. **Family Mode (Major Differentiator)**:
   - Primary candidate invites parents (Mother/Father) or siblings via WhatsApp.
   - Family members access a dedicated Family Review Portal (`/family/[token]`) with large typography and simplified actions: *Highly Recommend*, *Good Match*, *Discuss Further*, *Pass*.
   - Private family notes and audit trail visible on candidate's dashboard ("Mother recommended Rajesh on Sept 14").
3. **Strict 18+ Gate & Privacy Shield**:
   - Strictly 18+ enforcement with mandatory birthdate validation.
   - Search engine privacy: All profile and recommendation routes carry `X-Robots-Tag: noindex, nofollow` headers.
   - Contact Shield: Phone numbers and direct WhatsApp links are concealed until both members send interest, establish a mutual connection, and explicitly approve contact sharing.
   - Zero unsolicited direct messaging: interactions require mutual interest acceptance.
4. **Explainable 0–100 AI Matchmaking Engine**:
   - Multi-factor deterministic scoring: Age (15%), Location & Relocation (15%), Education (15%), Career & Profession (15%), Language & Cultural background (15%), Lifestyle & Dietary habits (10%), Shared Interests & Hobbies (15%).
   - Transparent "Why this match?" breakdown detailing *Strong Alignment Points* and *Suggested Topics to Discuss*.
   - No opaque AI or false destiny claims.
5. **AI Profile Bio Assistant**:
   - Refines rough bullet points into an articulate, respectful matrimonial bio with a strict constraint: *never invents degrees, employers, or facts not supplied by the user*.
   - Graceful deterministic fallback when no external AI API key is configured.
6. **Zero-Cost / Free-Tier First Architecture**:
   - Built to run seamlessly on free tiers (Vercel/Cloudflare Pages + Supabase PostgreSQL).
   - Dual-mode data layer: Works out-of-the-box locally with 35+ realistic pre-seeded Indian profiles across Assam, Bengal, Maharashtra, Tamil Nadu, Telangana, Punjab, and Delhi without requiring external credentials. Connects natively to live Supabase once credentials are provided.

---

## 🏗️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS (Brand Crimson, Auspicious Gold, and WhatsApp palettes)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Database & Storage**: PostgreSQL 15+ / Supabase with Row Level Security (RLS)
- **PWA**: Web App Manifest, mobile viewport optimization, standalone mode
- **Testing**: Vitest automated test suite

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 2. Installation
```bash
git clone <repo-url>
cd "Whatsapp Matrimony OS"
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

The application starts immediately in **Demo & Local Fallback Mode** with 35+ realistic Indian matrimonial candidate profiles, active sample interests, mutual connections, and family review logs.

---

## 🎭 Switching Demo Perspectives

In the top right navigation bar, click the **Demo Pill** (`Demo: Priya`) to switch between:
1. **Priya Sharma** (Female Candidate, 29 yrs, Senior Product Manager, Bengaluru)
2. **Arun Barua** (Male Candidate, 31 yrs, CleanTech Entrepreneur, Guwahati)
3. **Ananya Chatterjee** (Female Candidate, 29 yrs, Economics Consultant, Kolkata)
4. **Rohan Deshmukh** (Male Candidate, 32 yrs, Staff AI Engineer, Pune)
5. **Platform Administrator** (Access to `/admin` for user moderation, report review queue, and community management)

To experience the **Family Portal**, click **Family Mode** in the header or navigate directly to `/family/dad-token-sharma-123` to review matches as candidate Priya's father.

---

## 🗄️ Database & Supabase Deployment

Complete PostgreSQL migration scripts are provided in the `/supabase` folder:
- `supabase/migrations/01_initial_schema.sql`: 21 normalized tables, foreign keys, and indexes.
- `supabase/migrations/02_rls_policies.sql`: Comprehensive Row-Level Security policies.
- `supabase/seed.sql`: Seed data for communities and membership tiers.

### Connecting Live Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL migrations from `supabase/migrations/` in the Supabase SQL Editor.
3. Add your credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 📱 WhatsApp Integration Strategy

The platform uses a progressive integration strategy:
1. **Phase 1 (MVP - Zero Cost)**:
   - Uses native `wa.me/?text=...` Click-to-Chat deep links.
   - Encodes opaque URLs (`/profile/[id]`, `/family/[token]`, `/register?ref=CODE`).
   - Automatically detects WhatsApp In-App Browser to adjust padding and viewport gestures.
2. **Phase 2 (Scale - Official Business API)**:
   - Plugs into Meta Cloud API / Gupshup / Infobip using the existing `WhatsAppService` provider interface.
   - Sends automated template notifications: "New interest received from Rohan", "Your mother recommended 2 matches".

---

## 🧪 Automated Testing

Run the Vitest test suite:
```bash
npm test
```
Tests cover:
- 0–100 Compatibility scoring algorithm and explainability generator (`tests/matchmaking.test.ts`)
- Privacy shield and contact URL security (`tests/privacy-guard.test.ts`)
- Family Mode token security and review submission (`tests/family-workflow.test.ts`)

Typecheck & Production Build:
```bash
npm run typecheck
npm run build
```

---

## 📋 Recommended Next Development Steps

1. **Meta WhatsApp Cloud API Webhooks**: Wire incoming WhatsApp replies to automatically respond to interest notifications.
2. **Payment Gateway**: Integrate Razorpay or Stripe India for processing Premium membership upgrades.
3. **Government ID & Professional Verification**: Add DigiLocker or HyperVerge integration for automated KYC verification of 18+ age and education credentials.
4. **Multilingual UI**: Add Hindi, Bengali, Assamese, Tamil, Telugu, and Marathi localization.
