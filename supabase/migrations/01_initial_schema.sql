-- =====================================================================
-- MATRIMONY OS: PRODUCTION DATABASE SCHEMA
-- Normalized PostgreSQL Schema for WhatsApp-First AI Matrimonial Platform
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. COMMUNITIES TABLE (Configurable regional, cultural, linguistic communities)
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    region VARCHAR(100),
    language VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS (Extension table complementing auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    is_age_confirmed BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(30) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    account_status VARCHAR(30) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated', 'banned')),
    created_by_relation VARCHAR(30) DEFAULT 'self' CHECK (created_by_relation IN ('self', 'parent', 'sibling', 'relative', 'guardian')),
    referral_code VARCHAR(20) UNIQUE,
    referred_by_code VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Detailed Matrimonial Profile)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'non_binary', 'other')),
    date_of_birth DATE NOT NULL,
    height_cm INTEGER,
    marital_status VARCHAR(30) DEFAULT 'never_married' CHECK (marital_status IN ('never_married', 'divorced', 'widowed', 'awaiting_divorce')),
    mother_tongue VARCHAR(100) NOT NULL,
    languages_spoken TEXT[] DEFAULT '{}',
    
    -- Location
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    citizenship VARCHAR(100) DEFAULT 'Indian',
    willing_to_relocate BOOLEAN DEFAULT true,
    
    -- Education & Career
    highest_education VARCHAR(100) NOT NULL,
    education_field VARCHAR(100),
    institution VARCHAR(200),
    graduation_year INTEGER,
    profession VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    employer VARCHAR(200),
    employment_type VARCHAR(50) DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'business', 'self_employed', 'government', 'defence', 'not_working')),
    annual_income_range VARCHAR(50),
    
    -- Lifestyle & Cultural Background
    dietary_habits VARCHAR(50) DEFAULT 'vegetarian' CHECK (dietary_habits IN ('vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'jain')),
    smoking VARCHAR(20) DEFAULT 'no' CHECK (smoking IN ('no', 'occasionally', 'yes')),
    drinking VARCHAR(20) DEFAULT 'no' CHECK (drinking IN ('no', 'occasionally', 'yes')),
    interests TEXT[] DEFAULT '{}',
    hobbies TEXT[] DEFAULT '{}',
    family_values VARCHAR(50) DEFAULT 'moderate' CHECK (family_values IN ('traditional', 'moderate', 'liberal')),
    about_me TEXT,
    about_my_family TEXT,
    
    -- Completeness & Privacy
    completeness_score INTEGER DEFAULT 20 CHECK (completeness_score >= 0 AND completeness_score <= 100),
    profile_visibility VARCHAR(30) DEFAULT 'registered' CHECK (profile_visibility IN ('registered', 'matches_only', 'mutual_interest')),
    photo_visibility VARCHAR(30) DEFAULT 'registered' CHECK (photo_visibility IN ('registered', 'matches_only', 'mutual_interest', 'blur')),
    contact_visibility VARCHAR(30) DEFAULT 'mutual_consent' CHECK (contact_visibility IN ('mutual_consent', 'verified_only')),
    
    -- Community link
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILE PHOTOS
CREATE TABLE IF NOT EXISTS profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PARTNER PREFERENCES
CREATE TABLE IF NOT EXISTS partner_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    min_age INTEGER DEFAULT 21 CHECK (min_age >= 18),
    max_age INTEGER DEFAULT 35 CHECK (max_age >= min_age),
    min_height_cm INTEGER,
    max_height_cm INTEGER,
    preferred_marital_status TEXT[] DEFAULT '{"never_married"}',
    preferred_religions TEXT[] DEFAULT '{}',
    preferred_communities TEXT[] DEFAULT '{}',
    preferred_mother_tongues TEXT[] DEFAULT '{}',
    preferred_countries TEXT[] DEFAULT '{"India"}',
    preferred_states TEXT[] DEFAULT '{}',
    preferred_cities TEXT[] DEFAULT '{}',
    preferred_educations TEXT[] DEFAULT '{}',
    preferred_professions TEXT[] DEFAULT '{}',
    preferred_dietary_habits TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INTERESTS (Consent-based express interest flow)
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn', 'expired')),
    custom_message TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_interest_pair UNIQUE (sender_id, receiver_id)
);

-- 7. MUTUAL CONNECTIONS (Created automatically when interest is accepted)
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'blocked')),
    
    -- Explicit Contact Sharing Flow
    contact_shared_by_a BOOLEAN DEFAULT false,
    contact_shared_by_b BOOLEAN DEFAULT false,
    contact_shared_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_connection_pair UNIQUE (profile_a_id, profile_b_id)
);

-- 8. SAVED / SHORTLISTED PROFILES
CREATE TABLE IF NOT EXISTS saved_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_saved_profile UNIQUE (profile_id, target_profile_id)
);

-- 9. FAMILY MEMBERS (Family Mode collaboration)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL CHECK (relation IN ('father', 'mother', 'brother', 'sister', 'uncle', 'aunt', 'guardian', 'relative')),
    phone VARCHAR(30),
    email VARCHAR(255),
    invite_token VARCHAR(100) UNIQUE NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,
    has_joined BOOLEAN DEFAULT false,
    last_active_at TIMESTAMPTZ,
    permissions JSONB DEFAULT '{"can_shortlist": true, "can_comment": true, "can_recommend": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FAMILY REVIEWS & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS family_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    primary_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recommendation VARCHAR(30) NOT NULL CHECK (recommendation IN ('highly_recommend', 'recommend', 'neutral', 'not_recommended', 'discuss_further')),
    private_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTROLLED CONVERSATIONS (Structured icebreakers & consent-based messaging)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL UNIQUE REFERENCES connections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. MESSAGES (Structured matrimonial prompts & direct notes)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_type VARCHAR(30) DEFAULT 'text' CHECK (message_type IN ('text', 'icebreaker_prompt', 'contact_exchange_request', 'family_introduction')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('interest_received', 'interest_accepted', 'interest_declined', 'mutual_connection', 'family_invite', 'family_review', 'match_recommendation', 'safety_alert', 'system')),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SAFETY: BLOCKS
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id)
);

-- 15. SAFETY: REPORTS & MODERATION QUEUE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('fake_profile', 'harassment', 'inappropriate_content', 'impersonation', 'scam_or_fraud', 'unwanted_contact', 'other')),
    details TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    moderator_notes TEXT,
    action_taken VARCHAR(50),
    resolved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MODERATION ACTIONS (Audit trail of administrative actions)
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('suspend', 'restore', 'verify', 'reject_verification', 'warn', 'ban', 'dismiss_report')),
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 30,
    features JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled', 'trial')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    payment_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SUBSCRIPTION ENTITLEMENTS (Usage quotas for free and paid tiers)
CREATE TABLE IF NOT EXISTS subscription_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    daily_interests_limit INTEGER DEFAULT 5,
    interests_sent_today INTEGER DEFAULT 0,
    last_interest_sent_date DATE DEFAULT CURRENT_DATE,
    can_use_ai_bio_assistant BOOLEAN DEFAULT true,
    can_invite_family BOOLEAN DEFAULT true,
    max_family_members INTEGER DEFAULT 3,
    view_contact_allowed BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. REFERRALS (Viral referral tracking engine)
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'registered' CHECK (status IN ('registered', 'profile_completed', 'rewarded')),
    reward_granted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AUDIT LOGS (Security and administrative audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_gender_dob ON profiles(gender, date_of_birth);
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON profiles(city, state);
CREATE INDEX IF NOT EXISTS idx_profiles_mother_tongue ON profiles(mother_tongue);
CREATE INDEX IF NOT EXISTS idx_interests_sender_status ON interests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_interests_receiver_status ON interests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_profiles ON connections(profile_a_id, profile_b_id);
CREATE INDEX IF NOT EXISTS idx_family_members_token ON family_members(invite_token);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker_blocked ON blocks(blocker_id, blocked_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
