import { describe, it, expect, beforeEach } from 'vitest';
import { MockRepository } from '../src/lib/mock/mock-repository';
import { Profile } from '../src/lib/types';

describe('Admin User Activation Workflow', () => {
  const newCandidate: Profile = {
    id: 'prof-new-test',
    user_id: 'usr-new-test',
    first_name: 'Rahul',
    last_name: 'Verma',
    gender: 'male',
    date_of_birth: '1995-06-15',
    community_id: 'com-brahmin',
    sub_caste: 'Iyer',
    religion: 'Hindu',
    mother_tongue: 'Tamil',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    highest_education: 'Master in Computer Science',
    field_of_study: 'Computer Science',
    profession: 'Software Engineer',
    languages_spoken: ['Tamil', 'English'],
    marital_status: 'never_married',
    dietary_habits: 'vegetarian',
    height_cm: 178,
    primary_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    about_me: 'Testing registration and admin activation flow.',
    is_verified: false,
    is_active: false,
    account_status: 'pending_approval',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const viewerCandidate: Profile = {
    id: 'prof-viewer',
    user_id: 'usr-viewer',
    first_name: 'Priya',
    last_name: 'Sharma',
    gender: 'female',
    date_of_birth: '1997-04-15',
    community_id: 'com-brahmin',
    religion: 'Hindu',
    mother_tongue: 'Tamil',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    highest_education: 'Master of Technology',
    profession: 'Product Manager',
    languages_spoken: ['Tamil', 'English'],
    marital_status: 'never_married',
    dietary_habits: 'vegetarian',
    primary_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    about_me: 'Active candidate looking for matches.',
    is_verified: true,
    is_active: true,
    account_status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    // Save viewer profile and new pending profile
    MockRepository.saveProfile(viewerCandidate);
    MockRepository.saveProfile(newCandidate);
  });

  it('excludes pending unapproved profiles from public match recommendations', () => {
    const recs = MockRepository.getRecommendations('prof-viewer');
    const hasPendingProfile = recs.some((r) => r.profile.id === newCandidate.id);
    expect(hasPendingProfile).toBe(false);
  });

  it('lists newly registered profiles in pending profiles queue for admin review', () => {
    const pending = MockRepository.getPendingProfiles();
    const found = pending.find((p) => p.id === newCandidate.id);
    expect(found).toBeDefined();
    expect(found?.account_status).toBe('pending_approval');
    expect(found?.is_active).toBe(false);
  });

  it('allows admin to activate profile, making it verified, active, and discoverable', () => {
    const activated = MockRepository.activateProfile(newCandidate.id);
    expect(activated).toBeDefined();
    expect(activated?.is_active).toBe(true);
    expect(activated?.is_verified).toBe(true);
    expect(activated?.account_status).toBe('active');

    // Should no longer be in pending list
    const pendingAfter = MockRepository.getPendingProfiles();
    expect(pendingAfter.some((p) => p.id === newCandidate.id)).toBe(false);

    // Should now be discoverable in recommendations
    const recsAfter = MockRepository.getRecommendations('prof-viewer');
    expect(recsAfter.some((r) => r.profile.id === newCandidate.id)).toBe(true);
  });

  it('allows admin to deactivate a profile when needed', () => {
    const deactivated = MockRepository.deactivateProfile(newCandidate.id);
    expect(deactivated).toBeDefined();
    expect(deactivated?.is_active).toBe(false);
    expect(deactivated?.account_status).toBe('deactivated');

    const recs = MockRepository.getRecommendations('prof-viewer');
    expect(recs.some((r) => r.profile.id === newCandidate.id)).toBe(false);
  });
});
