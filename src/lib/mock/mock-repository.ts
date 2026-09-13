import {
  Profile,
  PartnerPreferences,
  Interest,
  Connection,
  FamilyMember,
  FamilyReview,
  ReportItem,
  Community,
  UserProfile,
} from '../types';
import {
  SEED_PROFILES,
  SEED_PREFERENCES,
  SEED_FAMILY_MEMBERS,
  SEED_FAMILY_REVIEWS,
  SEED_INTERESTS,
  SEED_CONNECTIONS,
  SEED_REPORTS,
  SEED_COMMUNITIES,
} from './seed-data';
import { calculateMatchScore } from '../matchmaking/scoring';

const STORAGE_KEYS = {
  PROFILES: 'matrimony_os_profiles',
  PREFERENCES: 'matrimony_os_preferences',
  INTERESTS: 'matrimony_os_interests',
  CONNECTIONS: 'matrimony_os_connections',
  FAMILY_MEMBERS: 'matrimony_os_family_members',
  FAMILY_REVIEWS: 'matrimony_os_family_reviews',
  REPORTS: 'matrimony_os_reports',
  BLOCKS: 'matrimony_os_blocks',
  SAVED: 'matrimony_os_saved',
  CURRENT_USER_ID: 'matrimony_os_current_user_id',
};

export class MockRepository {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private static getItem<T>(key: string, fallback: T): T {
    if (!this.isClient()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }

  // Current Active User
  static getCurrentUserId(): string {
    return this.getItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-1'); // Default: Priya Sharma
  }

  static setCurrentUserId(userId: string): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Communities
  static getCommunities(): Community[] {
    return SEED_COMMUNITIES;
  }

  // Profiles
  static getProfiles(): Profile[] {
    return this.getItem<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  }

  static getProfileById(id: string): Profile | undefined {
    const profiles = this.getProfiles();
    return profiles.find((p) => p.id === id);
  }

  static getProfileByUserId(userId: string): Profile | undefined {
    const profiles = this.getProfiles();
    return profiles.find((p) => p.user_id === userId);
  }

  static updateProfile(id: string, updates: Partial<Profile>): Profile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Profile not found');
    const updated = {
      ...profiles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    profiles[index] = updated;
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
    return updated;
  }

  // Partner Preferences
  static getPreferences(profileId: string): PartnerPreferences | null {
    const allPrefs = this.getItem<Record<string, PartnerPreferences>>(
      STORAGE_KEYS.PREFERENCES,
      SEED_PREFERENCES
    );
    return allPrefs[profileId] || null;
  }

  static savePreferences(profileId: string, prefs: Partial<PartnerPreferences>): PartnerPreferences {
    const allPrefs = this.getItem<Record<string, PartnerPreferences>>(
      STORAGE_KEYS.PREFERENCES,
      SEED_PREFERENCES
    );
    const existing = allPrefs[profileId] || {
      id: `pref-${Date.now()}`,
      profile_id: profileId,
      min_age: 21,
      max_age: 35,
      preferred_marital_status: ['never_married'],
      preferred_mother_tongues: [],
      preferred_countries: ['India'],
      preferred_states: [],
      preferred_cities: [],
      preferred_educations: [],
      preferred_professions: [],
      preferred_dietary_habits: [],
    };
    const updated = { ...existing, ...prefs, updated_at: new Date().toISOString() };
    allPrefs[profileId] = updated;
    this.setItem(STORAGE_KEYS.PREFERENCES, allPrefs);
    return updated;
  }

  // Matchmaking & Recommendations
  static getRecommendations(currentProfileId: string): { profile: Profile; score: any }[] {
    const currentProfile = this.getProfileById(currentProfileId);
    if (!currentProfile) return [];

    const preferences = this.getPreferences(currentProfileId);
    const blocks = this.getBlockedProfileIds(currentProfileId);
    const profiles = this.getProfiles();

    return profiles
      .filter((p) => p.id !== currentProfileId && !blocks.includes(p.id) && p.gender !== currentProfile.gender)
      .map((candidate) => {
        const score = calculateMatchScore(candidate, currentProfile, preferences);
        return { profile: candidate, score };
      })
      .sort((a, b) => b.score.overallScore - a.score.overallScore);
  }

  // Interests
  static getInterests(): Interest[] {
    return this.getItem<Interest[]>(STORAGE_KEYS.INTERESTS, SEED_INTERESTS);
  }

  static getInterestsForProfile(profileId: string): { received: Interest[]; sent: Interest[] } {
    const allInterests = this.getInterests();
    const profiles = this.getProfiles();

    const populate = (item: Interest): Interest => ({
      ...item,
      sender: profiles.find((p) => p.id === item.sender_id),
      receiver: profiles.find((p) => p.id === item.receiver_id),
    });

    return {
      received: allInterests.filter((i) => i.receiver_id === profileId).map(populate),
      sent: allInterests.filter((i) => i.sender_id === profileId).map(populate),
    };
  }

  static sendInterest(senderId: string, receiverId: string, customMessage?: string): Interest {
    const interests = this.getInterests();
    const existing = interests.find(
      (i) => i.sender_id === senderId && i.receiver_id === receiverId
    );
    if (existing) return existing;

    const newInterest: Interest = {
      id: `int-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'pending',
      custom_message: customMessage || 'Namaste, I am interested in connecting with your matrimonial profile.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    interests.unshift(newInterest);
    this.setItem(STORAGE_KEYS.INTERESTS, interests);
    return newInterest;
  }

  static respondToInterest(interestId: string, status: 'accepted' | 'declined'): Interest {
    const interests = this.getInterests();
    const index = interests.findIndex((i) => i.id === interestId);
    if (index === -1) throw new Error('Interest not found');

    interests[index].status = status;
    interests[index].responded_at = new Date().toISOString();
    interests[index].updated_at = new Date().toISOString();
    this.setItem(STORAGE_KEYS.INTERESTS, interests);

    // If accepted -> automatically create a mutual connection!
    if (status === 'accepted') {
      this.createConnection(interests[index].sender_id, interests[index].receiver_id, interestId);
    }

    return interests[index];
  }

  // Connections (Mutual Connections)
  static getConnections(): Connection[] {
    return this.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS, SEED_CONNECTIONS);
  }

  static getConnectionsForProfile(profileId: string): Connection[] {
    const all = this.getConnections();
    const profiles = this.getProfiles();
    return all
      .filter((c) => c.profile_a_id === profileId || c.profile_b_id === profileId)
      .map((c) => {
        const otherId = c.profile_a_id === profileId ? c.profile_b_id : c.profile_a_id;
        return {
          ...c,
          other_profile: profiles.find((p) => p.id === otherId),
        };
      });
  }

  static createConnection(profileA: string, profileB: string, interestId?: string): Connection {
    const connections = this.getConnections();
    const existing = connections.find(
      (c) =>
        (c.profile_a_id === profileA && c.profile_b_id === profileB) ||
        (c.profile_a_id === profileB && c.profile_b_id === profileA)
    );
    if (existing) return existing;

    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      profile_a_id: profileA,
      profile_b_id: profileB,
      interest_id: interestId,
      status: 'connected',
      contact_shared_by_a: false,
      contact_shared_by_b: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    connections.unshift(newConn);
    this.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    return newConn;
  }

  static shareContactInConnection(connectionId: string, profileId: string): Connection {
    const connections = this.getConnections();
    const index = connections.findIndex((c) => c.id === connectionId);
    if (index === -1) throw new Error('Connection not found');

    const conn = connections[index];
    if (conn.profile_a_id === profileId) {
      conn.contact_shared_by_a = true;
    } else if (conn.profile_b_id === profileId) {
      conn.contact_shared_by_b = true;
    }

    if (conn.contact_shared_by_a && conn.contact_shared_by_b) {
      conn.contact_shared_at = new Date().toISOString();
    }
    conn.updated_at = new Date().toISOString();
    connections[index] = conn;
    this.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    return conn;
  }

  // Family Mode
  static getFamilyMembers(primaryProfileId: string): FamilyMember[] {
    const all = this.getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, SEED_FAMILY_MEMBERS);
    return all.filter((f) => f.primary_profile_id === primaryProfileId);
  }

  static getFamilyMemberByToken(token: string): FamilyMember | undefined {
    const all = this.getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, SEED_FAMILY_MEMBERS);
    return all.find((f) => f.invite_token === token);
  }

  static inviteFamilyMember(
    primaryProfileId: string,
    memberName: string,
    relation: any,
    phone?: string,
    email?: string
  ): FamilyMember {
    const all = this.getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, SEED_FAMILY_MEMBERS);
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      primary_profile_id: primaryProfileId,
      member_name: memberName,
      relation,
      phone,
      email,
      invite_token: `fam-tok-${Math.random().toString(36).substring(2, 10)}`,
      token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      has_joined: false,
      created_at: new Date().toISOString(),
    };
    all.push(newMember);
    this.setItem(STORAGE_KEYS.FAMILY_MEMBERS, all);
    return newMember;
  }

  static getFamilyReviews(primaryProfileId: string): FamilyReview[] {
    const allReviews = this.getItem<FamilyReview[]>(STORAGE_KEYS.FAMILY_REVIEWS, SEED_FAMILY_REVIEWS);
    const members = this.getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, SEED_FAMILY_MEMBERS);
    const profiles = this.getProfiles();

    return allReviews
      .filter((r) => r.primary_profile_id === primaryProfileId)
      .map((r) => ({
        ...r,
        family_member: members.find((m) => m.id === r.family_member_id),
        target_profile: profiles.find((p) => p.id === r.target_profile_id),
      }));
  }

  static submitFamilyReview(
    familyMemberId: string,
    primaryProfileId: string,
    targetProfileId: string,
    recommendation: any,
    privateNote?: string
  ): FamilyReview {
    const allReviews = this.getItem<FamilyReview[]>(STORAGE_KEYS.FAMILY_REVIEWS, SEED_FAMILY_REVIEWS);
    const newReview: FamilyReview = {
      id: `rev-${Date.now()}`,
      family_member_id: familyMemberId,
      primary_profile_id: primaryProfileId,
      target_profile_id: targetProfileId,
      recommendation,
      private_note: privateNote,
      created_at: new Date().toISOString(),
    };
    allReviews.unshift(newReview);
    this.setItem(STORAGE_KEYS.FAMILY_REVIEWS, allReviews);
    return newReview;
  }

  // Safety: Blocks & Reports
  static getBlockedProfileIds(profileId: string): string[] {
    const allBlocks = this.getItem<Record<string, string[]>>(STORAGE_KEYS.BLOCKS, {});
    return allBlocks[profileId] || [];
  }

  static blockProfile(blockerId: string, blockedId: string): void {
    const allBlocks = this.getItem<Record<string, string[]>>(STORAGE_KEYS.BLOCKS, {});
    const list = allBlocks[blockerId] || [];
    if (!list.includes(blockedId)) {
      list.push(blockedId);
      allBlocks[blockerId] = list;
      this.setItem(STORAGE_KEYS.BLOCKS, allBlocks);
    }
  }

  static unblockProfile(blockerId: string, blockedId: string): void {
    const allBlocks = this.getItem<Record<string, string[]>>(STORAGE_KEYS.BLOCKS, {});
    const list = allBlocks[blockerId] || [];
    allBlocks[blockerId] = list.filter((id) => id !== blockedId);
    this.setItem(STORAGE_KEYS.BLOCKS, allBlocks);
  }

  static getReports(): ReportItem[] {
    const reports = this.getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    const profiles = this.getProfiles();
    return reports.map((r) => ({
      ...r,
      reporter: profiles.find((p) => p.id === r.reporter_id),
      reported: profiles.find((p) => p.id === r.reported_id),
    }));
  }

  static submitReport(reporterId: string, reportedId: string, reason: any, details: string): ReportItem {
    const reports = this.getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporter_id: reporterId,
      reported_id: reportedId,
      reason,
      details,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    reports.unshift(newReport);
    this.setItem(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  }

  static updateReportStatus(reportId: string, status: any, moderatorNotes?: string): ReportItem {
    const reports = this.getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    const index = reports.findIndex((r) => r.id === reportId);
    if (index === -1) throw new Error('Report not found');
    reports[index].status = status;
    if (moderatorNotes) reports[index].moderator_notes = moderatorNotes;
    reports[index].resolved_at = new Date().toISOString();
    this.setItem(STORAGE_KEYS.REPORTS, reports);
    return reports[index];
  }

  // Admin Analytics
  static getAdminStats() {
    const profiles = this.getProfiles();
    const interests = this.getInterests();
    const connections = this.getConnections();
    const reports = this.getReports();

    return {
      totalUsers: profiles.length,
      verifiedUsers: profiles.filter((p) => p.is_verified).length,
      averageCompleteness: Math.round(
        profiles.reduce((acc, p) => acc + (p.completeness_score || 0), 0) / profiles.length
      ),
      interestsSent: interests.length,
      mutualConnections: connections.length,
      openReports: reports.filter((r) => r.status === 'open').length,
    };
  }
}
