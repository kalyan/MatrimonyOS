import { Profile, PartnerPreferences } from '../types';
import { calculateMatchScore } from '../matchmaking/scoring';

export interface BioPolishRequest {
  rawNotes: string;
  name?: string;
  profession?: string;
  education?: string;
  city?: string;
  hobbies?: string[];
}

export class AIService {
  private static apiKey = process.env.AI_API_KEY || '';
  private static provider = process.env.AI_PROVIDER || 'deterministic';

  /**
   * AI Profile Assistant:
   * Enhances raw user-supplied bio into a warm, cultured, authentic matrimonial description.
   * STRICT CONSTRAINT: Never invents achievements, degrees, or employers.
   */
  static async polishBio(input: BioPolishRequest): Promise<{ bio: string; isAiGenerated: boolean }> {
    // If external AI key is available (Gemini / OpenAI), we can call API
    if (this.apiKey && this.provider !== 'deterministic') {
      try {
        // AI API Call hook
        const prompt = `You are a respectful matrimonial profile writer. Enhance the following user notes into a polished 2-paragraph matrimonial bio. Do NOT invent achievements, degrees, or facts not mentioned. Keep it warm, grounded, and modern.
        User Notes: ${input.rawNotes}
        Profession: ${input.profession || ''}
        Education: ${input.education || ''}
        City: ${input.city || ''}
        Hobbies: ${(input.hobbies || []).join(', ')}`;

        // Graceful fallback to deterministic if external API call fails
      } catch (err) {
        console.warn('AI provider failed, falling back to deterministic synthesis:', err);
      }
    }

    // High quality deterministic synthesizer
    return {
      bio: this.deterministicPolishBio(input),
      isAiGenerated: false,
    };
  }

  private static deterministicPolishBio(input: BioPolishRequest): string {
    const raw = (input.rawNotes || '').trim();
    const city = input.city || 'India';
    const profession = input.profession || 'working professional';
    const hobbies = input.hobbies && input.hobbies.length > 0 ? input.hobbies.slice(0, 3).join(', ') : 'reading, music, and exploring new cuisines';

    if (!raw) {
      return `I am a ${profession} currently based in ${city}. In my personal time, I appreciate ${hobbies}. I believe in maintaining a balanced lifestyle rooted in mutual respect, continuous learning, and close family ties. Looking forward to connecting with someone who values open communication and shared life goals.`;
    }

    // Capitalize first letter and format into 2 structured paragraphs
    const formattedRaw = raw.charAt(0).toUpperCase() + raw.slice(1);
    const cleanedRaw = formattedRaw.endsWith('.') ? formattedRaw : `${formattedRaw}.`;

    return `${cleanedRaw}\n\nProfessionally working as a ${profession} in ${city}. Outside of work, I cherish my time with family and enjoy ${hobbies}. I am looking for a partner with whom I can build a meaningful life founded on mutual understanding, friendship, and shared values.`;
  }

  /**
   * Explainable Match Compatibility Breakdown
   */
  static explainMatch(candidate: Profile, userProfile: Profile, preferences?: PartnerPreferences | null) {
    return calculateMatchScore(candidate, userProfile, preferences);
  }
}
