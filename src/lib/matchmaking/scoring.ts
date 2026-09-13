import { Profile, PartnerPreferences, MatchScoreResult } from '../types';

/**
 * Calculates a deterministic, explainable compatibility score (0 - 100)
 * between a candidate profile and a user's partner preferences.
 */
export function calculateMatchScore(
  candidate: Profile,
  userProfile: Profile,
  preferences?: PartnerPreferences | null
): MatchScoreResult {
  const strongAlignment: string[] = [];
  const thingsToDiscuss: string[] = [];

  // 1. Age Compatibility (Max 15 points)
  let ageScore = 10;
  const candidateAge = candidate.age || calculateAge(candidate.date_of_birth);
  const userAge = userProfile.age || calculateAge(userProfile.date_of_birth);

  if (preferences?.min_age && preferences?.max_age) {
    if (candidateAge >= preferences.min_age && candidateAge <= preferences.max_age) {
      ageScore = 15;
      strongAlignment.push(`Age (${candidateAge} yrs) is within your preferred range of ${preferences.min_age}–${preferences.max_age} yrs`);
    } else {
      const diff = Math.min(
        Math.abs(candidateAge - preferences.min_age),
        Math.abs(candidateAge - preferences.max_age)
      );
      ageScore = Math.max(0, 15 - diff * 3);
      thingsToDiscuss.push(`Age difference (${Math.abs(candidateAge - userAge)} yrs) outside preferred target`);
    }
  } else {
    // Default reasonable age alignment (within 5 years)
    const ageDiff = Math.abs(candidateAge - userAge);
    if (ageDiff <= 3) {
      ageScore = 15;
      strongAlignment.push(`Close age alignment (${candidateAge} yrs & ${userAge} yrs)`);
    } else if (ageDiff <= 6) {
      ageScore = 12;
    } else {
      ageScore = 8;
    }
  }

  // 2. Location & Relocation (Max 15 points)
  let locationScore = 6;
  const sameCity = candidate.city.toLowerCase() === userProfile.city.toLowerCase();
  const sameState = candidate.state.toLowerCase() === userProfile.state.toLowerCase();
  const preferredCityMatch = preferences?.preferred_cities?.some(
    (c) => c.toLowerCase() === candidate.city.toLowerCase()
  );

  if (sameCity || preferredCityMatch) {
    locationScore = 15;
    strongAlignment.push(`Both based in ${candidate.city}`);
  } else if (sameState) {
    locationScore = 12;
    strongAlignment.push(`Both in ${candidate.state} (${candidate.city} & ${userProfile.city})`);
    if (!candidate.willing_to_relocate && !userProfile.willing_to_relocate) {
      thingsToDiscuss.push('Inter-city relocation flexibility within the state');
    }
  } else if (candidate.willing_to_relocate || userProfile.willing_to_relocate) {
    locationScore = 10;
    strongAlignment.push(`Open to relocation (${candidate.city} to ${userProfile.city})`);
    thingsToDiscuss.push('Future city preferences and career relocation plans');
  } else {
    locationScore = 4;
    thingsToDiscuss.push(`Different locations (${candidate.city} vs ${userProfile.city}) with limited relocation willingness`);
  }

  // 3. Education Alignment (Max 15 points)
  let educationScore = 8;
  const userEduLower = userProfile.highest_education.toLowerCase();
  const candEduLower = candidate.highest_education.toLowerCase();

  const isMasterOrDoc = (edu: string) =>
    edu.includes('master') || edu.includes('m.') || edu.includes('phd') || edu.includes('mba') || edu.includes('m.tech') || edu.includes('ms');
  const isBachelor = (edu: string) =>
    edu.includes('bachelor') || edu.includes('b.') || edu.includes('b.tech') || edu.includes('be') || edu.includes('bsc') || edu.includes('b.com');

  if (
    preferences?.preferred_educations?.some((e) =>
      candEduLower.includes(e.toLowerCase())
    )
  ) {
    educationScore = 15;
    strongAlignment.push(`Education matches your preference (${candidate.highest_education})`);
  } else if (isMasterOrDoc(userEduLower) && isMasterOrDoc(candEduLower)) {
    educationScore = 15;
    strongAlignment.push(`Both hold postgraduate degrees (${candidate.highest_education})`);
  } else if (
    (isBachelor(userEduLower) && isBachelor(candEduLower)) ||
    (isMasterOrDoc(userEduLower) && isBachelor(candEduLower)) ||
    (isBachelor(userEduLower) && isMasterOrDoc(candEduLower))
  ) {
    educationScore = 13;
    strongAlignment.push(`Compatible graduate educational backgrounds`);
  } else {
    educationScore = 9;
  }

  // 4. Profession & Career (Max 15 points)
  let professionScore = 8;
  const candProfLower = candidate.profession.toLowerCase();
  if (
    preferences?.preferred_professions?.some((p) =>
      candProfLower.includes(p.toLowerCase())
    )
  ) {
    professionScore = 15;
    strongAlignment.push(`Career profile aligns with preferences (${candidate.profession})`);
  } else if (
    candidate.industry &&
    userProfile.industry &&
    candidate.industry.toLowerCase() === userProfile.industry.toLowerCase()
  ) {
    professionScore = 14;
    strongAlignment.push(`Both work in the ${candidate.industry} sector`);
  } else if (candidate.employment_type === userProfile.employment_type) {
    professionScore = 12;
    strongAlignment.push(`Similar professional employment stability (${candidate.employment_type.replace('_', ' ')})`);
  } else {
    professionScore = 9;
    thingsToDiscuss.push(`Work schedule and career routines (${candidate.profession} & ${userProfile.profession})`);
  }

  // 5. Language & Cultural Alignment (Max 15 points)
  let languageScore = 6;
  const sameMotherTongue =
    candidate.mother_tongue.toLowerCase() === userProfile.mother_tongue.toLowerCase();
  const sharedLanguages = candidate.languages_spoken.filter((lang) =>
    userProfile.languages_spoken.some((l) => l.toLowerCase() === lang.toLowerCase())
  );

  if (sameMotherTongue) {
    languageScore = 15;
    strongAlignment.push(`Native ${candidate.mother_tongue} speakers`);
  } else if (
    preferences?.preferred_mother_tongues?.some(
      (mt) => mt.toLowerCase() === candidate.mother_tongue.toLowerCase()
    )
  ) {
    languageScore = 14;
    strongAlignment.push(`Speaks your preferred language (${candidate.mother_tongue})`);
  } else if (sharedLanguages.length > 0) {
    languageScore = 11;
    strongAlignment.push(`Fluent in common languages: ${sharedLanguages.slice(0, 2).join(', ')}`);
  } else {
    languageScore = 6;
    thingsToDiscuss.push('Primary communication language preferences');
  }

  // 6. Lifestyle & Dietary Compatibility (Max 10 points)
  let lifestyleScore = 6;
  if (candidate.dietary_habits === userProfile.dietary_habits) {
    lifestyleScore = 10;
    strongAlignment.push(`Shared dietary lifestyle: ${candidate.dietary_habits.replace('_', ' ')}`);
  } else if (
    preferences?.preferred_dietary_habits?.includes(candidate.dietary_habits)
  ) {
    lifestyleScore = 9;
    strongAlignment.push(`Dietary preference match (${candidate.dietary_habits.replace('_', ' ')})`);
  } else {
    lifestyleScore = 5;
    thingsToDiscuss.push(`Dietary preferences: ${candidate.dietary_habits.replace('_', ' ')} vs ${userProfile.dietary_habits.replace('_', ' ')}`);
  }

  // 7. Shared Interests & Hobbies (Max 15 points)
  let interestsScore = 5;
  const candInterests = [...(candidate.interests || []), ...(candidate.hobbies || [])].map((i) =>
    i.toLowerCase()
  );
  const userInterests = [...(userProfile.interests || []), ...(userProfile.hobbies || [])].map((i) =>
    i.toLowerCase()
  );

  const mutual = candInterests.filter((item) => userInterests.includes(item));
  if (mutual.length >= 3) {
    interestsScore = 15;
    strongAlignment.push(`Multiple shared interests: ${mutual.slice(0, 3).join(', ')}`);
  } else if (mutual.length >= 1) {
    interestsScore = 12;
    strongAlignment.push(`Common interest in ${mutual[0]}`);
  } else {
    interestsScore = 7;
  }

  // Family values alignment note
  if (candidate.family_values === userProfile.family_values) {
    strongAlignment.push(`Shared ${candidate.family_values} family values`);
  } else {
    thingsToDiscuss.push(`Family perspectives: ${candidate.family_values} & ${userProfile.family_values}`);
  }

  const overallScore = Math.min(
    100,
    Math.max(
      35,
      Math.round(
        ageScore +
          locationScore +
          educationScore +
          professionScore +
          languageScore +
          lifestyleScore +
          interestsScore
      )
    )
  );

  return {
    candidateId: candidate.id,
    overallScore,
    factors: {
      ageScore,
      locationScore,
      educationScore,
      professionScore,
      languageScore,
      lifestyleScore,
      interestsScore,
    },
    strongAlignment: Array.from(new Set(strongAlignment)).slice(0, 4),
    thingsToDiscuss: Array.from(new Set(thingsToDiscuss)).slice(0, 2),
  };
}

export function calculateAge(dobString: string): number {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) ? 27 : age;
}

export function calculateProfileCompleteness(profile: Partial<Profile>): number {
  let score = 0;
  if (profile.first_name && profile.last_name) score += 15;
  if (profile.gender && profile.date_of_birth) score += 15;
  if (profile.city && profile.state) score += 15;
  if (profile.highest_education && profile.profession) score += 20;
  if (profile.about_me && profile.about_me.length > 40) score += 15;
  if (profile.primary_photo_url || (profile.photos && profile.photos.length > 0)) score += 15;
  if (profile.interests && profile.interests.length > 0) score += 5;
  return Math.min(100, score);
}
