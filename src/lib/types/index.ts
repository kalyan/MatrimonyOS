export type UserRole = 'member' | 'moderator' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'deactivated' | 'banned' | 'pending_approval';
export type CreatedByRelation = 'self' | 'parent' | 'sibling' | 'relative' | 'guardian';

export type Gender = 'male' | 'female' | 'non_binary' | 'other';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'awaiting_divorce';
export type EmploymentType = 'full_time' | 'business' | 'self_employed' | 'government' | 'defence' | 'not_working';
export type DietaryHabits = 'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan' | 'jain';
export type HabitFrequency = 'no' | 'occasionally' | 'yes';
export type FamilyValues = 'traditional' | 'moderate' | 'liberal';

export type ProfileVisibility = 'registered' | 'matches_only' | 'mutual_interest';
export type PhotoVisibility = 'registered' | 'matches_only' | 'mutual_interest' | 'blur';
export type ContactVisibility = 'mutual_consent' | 'verified_only';

export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';
export type ConnectionStatus = 'connected' | 'disconnected' | 'blocked';
export type FamilyRelation = 'father' | 'mother' | 'brother' | 'sister' | 'uncle' | 'aunt' | 'guardian' | 'relative';
export type FamilyRecommendation = 'highly_recommend' | 'recommend' | 'neutral' | 'not_recommended' | 'discuss_further';

export type ReportReason = 'fake_profile' | 'harassment' | 'inappropriate_content' | 'impersonation' | 'scam_or_fraud' | 'unwanted_contact' | 'other';
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';
export type ModerationActionType = 'suspend' | 'restore' | 'verify' | 'reject_verification' | 'warn' | 'ban' | 'dismiss_report';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_age_confirmed: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  account_status: AccountStatus;
  created_by_relation: CreatedByRelation;
  referral_code: string;
  referred_by_code?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePhoto {
  id: string;
  profile_id: string;
  url: string;
  storage_path?: string;
  is_primary: boolean;
  order_index: number;
  is_approved: boolean;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  code: string;
  description?: string;
  region?: string;
  language?: string;
  is_active: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string; // ISO YYYY-MM-DD
  age?: number;
  height_cm?: number;
  marital_status: MaritalStatus;
  mother_tongue: string;
  languages_spoken: string[];
  
  // Location
  city: string;
  state: string;
  country: string;
  citizenship: string;
  willing_to_relocate: boolean;
  
  // Education & Career
  highest_education: string;
  education_field?: string;
  institution?: string;
  graduation_year?: number;
  profession: string;
  industry?: string;
  employer?: string;
  employment_type: EmploymentType;
  annual_income_range?: string;
  
  // Lifestyle & Background
  dietary_habits: DietaryHabits;
  smoking: HabitFrequency;
  drinking: HabitFrequency;
  interests: string[];
  hobbies: string[];
  family_values: FamilyValues;
  about_me: string;
  about_my_family?: string;
  
  // Scores & Visibility
  completeness_score: number;
  profile_visibility: ProfileVisibility;
  photo_visibility: PhotoVisibility;
  contact_visibility: ContactVisibility;
  community_id?: string;
  community_name?: string;
  
  photos?: ProfilePhoto[];
  primary_photo_url?: string;
  created_by_relation?: CreatedByRelation;
  is_verified?: boolean;
  is_active?: boolean;
  account_status?: AccountStatus;
  
  created_at: string;
  updated_at: string;
}

export interface PartnerPreferences {
  id: string;
  profile_id: string;
  min_age: number;
  max_age: number;
  min_height_cm?: number;
  max_height_cm?: number;
  preferred_marital_status: MaritalStatus[];
  preferred_religions?: string[];
  preferred_communities?: string[];
  preferred_mother_tongues: string[];
  preferred_countries: string[];
  preferred_states: string[];
  preferred_cities: string[];
  preferred_educations: string[];
  preferred_professions: string[];
  preferred_dietary_habits: DietaryHabits[];
  created_at?: string;
  updated_at?: string;
}

export interface Interest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: InterestStatus;
  custom_message?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Connection {
  id: string;
  profile_a_id: string;
  profile_b_id: string;
  interest_id?: string;
  status: ConnectionStatus;
  contact_shared_by_a: boolean;
  contact_shared_by_b: boolean;
  contact_shared_at?: string;
  created_at: string;
  updated_at: string;
  other_profile?: Profile;
  conversation_id?: string;
}

export interface FamilyMember {
  id: string;
  primary_profile_id: string;
  member_name: string;
  relation: FamilyRelation;
  phone?: string;
  email?: string;
  invite_token: string;
  token_expires_at: string;
  has_joined: boolean;
  last_active_at?: string;
  created_at: string;
}

export interface FamilyReview {
  id: string;
  family_member_id: string;
  primary_profile_id: string;
  target_profile_id: string;
  recommendation: FamilyRecommendation;
  private_note?: string;
  family_member?: FamilyMember;
  target_profile?: Profile;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 'text' | 'icebreaker_prompt' | 'contact_exchange_request' | 'family_introduction';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'interest_received' | 'interest_accepted' | 'interest_declined' | 'mutual_connection' | 'family_invite' | 'family_review' | 'match_recommendation' | 'safety_alert' | 'system';
  title: string;
  body: string;
  link?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  moderator_notes?: string;
  action_taken?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  reporter?: Profile;
  reported?: Profile;
}

export interface MatchScoreResult {
  candidateId: string;
  overallScore: number; // 0 - 100
  factors: {
    ageScore: number; // weight: 15
    locationScore: number; // weight: 15
    educationScore: number; // weight: 15
    professionScore: number; // weight: 15
    languageScore: number; // weight: 15
    lifestyleScore: number; // weight: 10
    interestsScore: number; // weight: 15
  };
  strongAlignment: string[];
  thingsToDiscuss: string[];
}
