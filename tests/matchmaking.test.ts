import { describe, it, expect } from 'vitest';
import { calculateMatchScore, calculateAge, calculateProfileCompleteness } from '../src/lib/matchmaking/scoring';
import { SEED_PROFILES, SEED_PREFERENCES } from '../src/lib/mock/seed-data';

describe('Matchmaking Engine & Explainability', () => {
  it('correctly calculates age from date of birth', () => {
    const age = calculateAge('1997-04-15');
    expect(age).toBeGreaterThanOrEqual(28);
  });

  it('calculates deterministic compatibility score between 0 and 100', () => {
    const priya = SEED_PROFILES[0];
    const arun = SEED_PROFILES[1];
    const priyaPrefs = SEED_PREFERENCES['prof-1'];

    const result = calculateMatchScore(arun, priya, priyaPrefs);
    expect(result.overallScore).toBeGreaterThanOrEqual(40);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.strongAlignment.length).toBeGreaterThan(0);
    expect(result.factors.educationScore).toBeGreaterThan(0);
    expect(result.factors.locationScore).toBeGreaterThan(0);
  });

  it('accurately computes profile completeness percentage', () => {
    const fullProfile = SEED_PROFILES[0];
    const completeness = calculateProfileCompleteness(fullProfile);
    expect(completeness).toBeGreaterThanOrEqual(90);

    const emptyProfile = { first_name: 'Test' };
    const lowCompleteness = calculateProfileCompleteness(emptyProfile);
    expect(lowCompleteness).toBeLessThan(30);
  });
});
