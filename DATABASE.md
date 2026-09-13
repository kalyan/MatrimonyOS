# Matrimony OS — Database Schema & RLS Architecture

The database is built on normalized PostgreSQL (Supabase compatible) with 21 core tables, foreign key constraints, indexes, and comprehensive Row Level Security (RLS) policies.

---

## 1. Entity Relationship Overview

```text
auth.users (Supabase Auth)
     │ 1:1
     ▼
user_profiles ──────────────┬───────────────┐
     │ 1:1                  │ 1:N           │ 1:N
     ▼                      ▼               ▼
  profiles ◄───────── partner_preferences  audit_logs
     │
     ├────── 1:N ──────► profile_photos
     ├────── 1:N ──────► saved_profiles
     ├────── 1:N ──────► interests (as sender / receiver)
     ├────── 1:N ──────► connections (as profile_a / profile_b)
     │                      │
     │                      └─ 1:1 ──► conversations ── 1:N ──► messages
     │
     ├────── 1:N ──────► family_members ── 1:N ──► family_reviews
     ├────── 1:N ──────► reports (as reporter / reported)
     └────── 1:N ──────► blocks (as blocker / blocked)
```

---

## 2. Table Specifications

| Table Name | Primary Purpose | Security Policy Summary |
| :--- | :--- | :--- |
| `communities` | Configurable regional, cultural, linguistic communities | Read public; Admin write |
| `user_profiles` | Core account data, 18+ gate status, verification status | Owner read/update; Admin read/write |
| `profiles` | Matrimonial attributes, education, profession, bio | Permitted members read; Owner write |
| `profile_photos` | User photo assets, ordering, approval status | Read based on visibility; Owner write |
| `partner_preferences` | Partner criteria (age, education, cities, diet) | Owner read/write only |
| `interests` | Consent-based express interest invitations | Sender & Receiver read/write |
| `connections` | Mutual connections & contact sharing status | Connected parties only |
| `saved_profiles` | Shortlisted profiles & candidate bookmarks | Owner only |
| `family_members` | Invited family members, roles, and access tokens | Candidate owner manage |
| `family_reviews` | Recommendations and private family discussion notes | Candidate owner & family member |
| `conversations` | Controlled communication container | Connected parties only |
| `messages` | Structured icebreakers & matrimonial notes | Connected parties only |
| `notifications` | In-app alerts for interests, matches, family notes | User recipient only |
| `blocks` | Blocked user pairs | Blocker manage |
| `reports` | Safety reports queue | Reporter create; Admin review |
| `moderation_actions` | Administrative audit trail for bans/suspensions | Admin only |
| `subscription_plans` | Free, Premium, Assisted membership plans | Read public |
| `user_subscriptions` | Active user subscription state | User read; Admin manage |
| `subscription_entitlements` | Quotas for daily interests, family invites | User read; System update |
| `referrals` | Viral referral tracking and reward statuses | Referrer & Referred read |
| `audit_logs` | Security and access audit logging | Admin read; System insert |

---

## 3. Row Level Security (RLS) Rules

Every table has RLS explicitly enabled via `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`.

Key rules:
1. **Contact Information Segregation**: User phone numbers and email addresses are stored in `user_profiles` and excluded from `profiles` views.
2. **Block Enforcement**: The `profiles` SELECT policy dynamically checks `NOT EXISTS (SELECT 1 FROM blocks WHERE blocker_id = target OR blocked_id = target)`. Blocked users can neither find each other in queries nor send interests.
3. **Family Isolation**: Family members can only inspect profiles shortlisted or recommended for their specific candidate. They cannot access other users' accounts or private chats.
