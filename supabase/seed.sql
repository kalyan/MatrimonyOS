-- =====================================================================
-- MATRIMONY OS: PRODUCTION SEED DATA SCRIPT
-- Realistic diverse Indian matrimonial demo dataset
-- =====================================================================

-- 1. SEED COMMUNITIES
INSERT INTO communities (id, name, code, region, language) VALUES
('c0000000-0000-0000-0000-000000000001', 'Assamese', 'assamese', 'Northeast India', 'Assamese'),
('c0000000-0000-0000-0000-000000000002', 'Bengali', 'bengali', 'East India', 'Bengali'),
('c0000000-0000-0000-0000-000000000003', 'Punjabi', 'punjabi', 'North India', 'Punjabi'),
('c0000000-0000-0000-0000-000000000004', 'Marathi', 'marathi', 'West India', 'Marathi'),
('c0000000-0000-0000-0000-000000000005', 'Tamil', 'tamil', 'South India', 'Tamil'),
('c0000000-0000-0000-0000-000000000006', 'Telugu', 'telugu', 'South India', 'Telugu'),
('c0000000-0000-0000-0000-000000000007', 'Kannada', 'kannada', 'South India', 'Kannada'),
('c0000000-0000-0000-0000-000000000008', 'Malayalam', 'malayalam', 'South India', 'Malayalam'),
('c0000000-0000-0000-0000-000000000009', 'Hindi / North Indian', 'hindi', 'North/Central India', 'Hindi')
ON CONFLICT (name) DO NOTHING;

-- 2. SUBSCRIPTION PLANS
INSERT INTO subscription_plans (id, code, name, price_inr, duration_days, features) VALUES
('s0000000-0000-0000-0000-000000000001', 'free', 'Free Member', 0, 365, '{"daily_interests": 5, "family_invites": 1, "ai_bio_boosts": 1}'),
('s0000000-0000-0000-0000-000000000002', 'premium', 'Premium Member', 1499, 90, '{"daily_interests": -1, "family_invites": -1, "ai_bio_boosts": -1, "priority_placement": true, "whatsapp_unlock": true}'),
('s0000000-0000-0000-0000-000000000003', 'assisted', 'Assisted Matrimony', 9999, 180, '{"human_advisor": true, "family_coordination": true, "curated_matches": true}')
ON CONFLICT (code) DO NOTHING;
