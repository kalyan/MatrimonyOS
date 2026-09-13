import { describe, it, expect } from 'vitest';
import { MockRepository } from '../src/lib/mock/mock-repository';

describe('Family Collaboration Workflow', () => {
  it('generates secure family invitation tokens with validity', () => {
    const member = MockRepository.inviteFamilyMember(
      'prof-1',
      'Sunita Sharma',
      'mother',
      '+919876543211'
    );
    expect(member.invite_token).toBeDefined();
    expect(member.invite_token.startsWith('fam-tok-')).toBe(true);
    expect(member.relation).toBe('mother');
    expect(member.has_joined).toBe(false);
  });

  it('allows family members to submit reviews with audit records', () => {
    const review = MockRepository.submitFamilyReview(
      'fam-1',
      'prof-1',
      'prof-4',
      'highly_recommend',
      'Great cultural alignment and values.'
    );
    expect(review.id).toBeDefined();
    expect(review.recommendation).toBe('highly_recommend');
    expect(review.private_note).toContain('cultural alignment');

    const allReviews = MockRepository.getFamilyReviews('prof-1');
    expect(allReviews.length).toBeGreaterThan(0);
  });
});
