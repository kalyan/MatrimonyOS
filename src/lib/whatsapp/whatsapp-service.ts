/**
 * WhatsApp Integration Layer
 * Provides deep linking, WhatsApp Click-to-Chat intents, and notification abstraction.
 */

export class WhatsAppService {
  private static getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  /**
   * Generates a deep link to view a match or profile
   */
  static getProfileDeepLink(profileId: string): string {
    return `${this.getBaseUrl()}/profile/${profileId}`;
  }

  /**
   * Generates a family invitation deep link
   */
  static getFamilyInviteLink(token: string): string {
    return `${this.getBaseUrl()}/family/${token}`;
  }

  /**
   * Generates a referral registration deep link
   */
  static getReferralLink(referralCode: string): string {
    return `${this.getBaseUrl()}/register?ref=${encodeURIComponent(referralCode)}`;
  }

  /**
   * Generates a WhatsApp share URL to share a profile with family (e.g. parents or siblings)
   */
  static createFamilyShareWhatsAppUrl(candidateName: string, profileId: string, customNote?: string): string {
    const link = this.getProfileDeepLink(profileId);
    let text = `Namaste! Please review this matrimonial profile of *${candidateName}* on Matrimony OS.\n\n🔗 View Profile: ${link}`;
    if (customNote) {
      text += `\n\nNote: "${customNote}"`;
    }
    text += `\n\n_Matrimony OS — Find Meaningful Connections. Bring Families Together._`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates a WhatsApp share URL to invite a family member to the review portal
   */
  static createFamilyInviteWhatsAppUrl(inviterName: string, token: string, relation: string): string {
    const link = this.getFamilyInviteLink(token);
    const text = `Namaste! *${inviterName}* has invited you as a *${relation}* to help review and shortlist matrimonial matches on Matrimony OS.\n\nClick the secure link below to open the Family Dashboard:\n🔗 ${link}\n\n_No password needed. Your access is private and secure._`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates a direct WhatsApp Click-to-Chat link when contact sharing is mutually approved
   */
  static createDirectWhatsAppChatUrl(phoneNumber: string, recipientName: string, senderName: string): string {
    // Strip non-digits
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const text = `Namaste ${recipientName}, this is ${senderName} from Matrimony OS! We recently connected and consented to share contact information. Looking forward to our conversation.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates a WhatsApp share URL for viral user referrals
   */
  static createReferralWhatsAppUrl(referralCode: string, userName: string): string {
    const link = this.getReferralLink(referralCode);
    const text = `Join Matrimony OS — a modern, privacy-first matrimonial platform with family collaboration and AI matching.\n\nUse my invite link to get started: 🔗 ${link}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  /**
   * Detects if the current client is running inside a WhatsApp In-App Browser / WebView
   */
  static isWhatsAppWebView(): boolean {
    if (typeof window === 'undefined' || !navigator) return false;
    const ua = navigator.userAgent || navigator.vendor || '';
    return /WhatsApp/i.test(ua) || /FBAV/i.test(ua);
  }
}
