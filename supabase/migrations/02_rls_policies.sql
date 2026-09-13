-- =====================================================================
-- MATRIMONY OS: ROW LEVEL SECURITY (RLS) POLICIES
-- Strict authorization ensuring user privacy and authorized family access
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin/moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. USER PROFILES
CREATE POLICY "Users can view their own user profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id OR is_admin_or_moderator());

CREATE POLICY "Users can update their own user profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. PROFILES (Matrimonial Profile visibility)
-- Users can view profiles that are:
-- - their own
-- - OR belonging to active, non-blocked members when visibility is 'registered'
CREATE POLICY "Users can view public or eligible profiles"
ON profiles FOR SELECT
USING (
  user_id = auth.uid()
  OR (
    profile_visibility IN ('registered', 'matches_only')
    AND NOT EXISTS (
      SELECT 1 FROM blocks
      WHERE (blocker_id = profiles.id AND blocked_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
         OR (blocked_id = profiles.id AND blocker_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    )
  )
  OR is_admin_or_moderator()
);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (user_id = auth.uid());

-- 3. PROFILE PHOTOS
CREATE POLICY "Viewable photos based on profile permissions"
ON profile_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_photos.profile_id
    AND (
      profiles.user_id = auth.uid()
      OR profiles.photo_visibility != 'mutual_interest'
      OR EXISTS (
        SELECT 1 FROM connections c
        JOIN profiles p_me ON p_me.user_id = auth.uid()
        WHERE (c.profile_a_id = p_me.id AND c.profile_b_id = profiles.id)
           OR (c.profile_b_id = p_me.id AND c.profile_a_id = profiles.id)
      )
    )
  )
);

CREATE POLICY "Users manage their own photos"
ON profile_photos FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_photos.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 4. PARTNER PREFERENCES
CREATE POLICY "Users view and manage their preferences"
ON partner_preferences FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = partner_preferences.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 5. INTERESTS
CREATE POLICY "Users view interests they sent or received"
ON interests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE (profiles.id = interests.sender_id OR profiles.id = interests.receiver_id)
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send interests from their profile"
ON interests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = interests.sender_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update interests received"
ON interests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = interests.receiver_id
    AND profiles.user_id = auth.uid()
  )
);

-- 6. CONNECTIONS
CREATE POLICY "Users view their mutual connections"
ON connections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE (profiles.id = connections.profile_a_id OR profiles.id = connections.profile_b_id)
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their mutual connections (contact sharing)"
ON connections FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE (profiles.id = connections.profile_a_id OR profiles.id = connections.profile_b_id)
    AND profiles.user_id = auth.uid()
  )
);

-- 7. FAMILY MEMBERS & REVIEWS
CREATE POLICY "Primary users manage their invited family"
ON family_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = family_members.primary_profile_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Primary users view family reviews"
ON family_reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = family_reviews.primary_profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 8. NOTIFICATIONS
CREATE POLICY "Users see only their own notifications"
ON notifications FOR ALL
USING (user_id = auth.uid());

-- 9. BLOCKS & REPORTS
CREATE POLICY "Users manage their own blocks"
ON blocks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = blocks.blocker_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can file reports"
ON reports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = reports.reporter_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins and moderators manage reports"
ON reports FOR ALL
USING (is_admin_or_moderator());
