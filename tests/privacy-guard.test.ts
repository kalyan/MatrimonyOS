import { describe, it, expect } from 'vitest';
import { WhatsAppService } from '../src/lib/whatsapp/whatsapp-service';

describe('Privacy Guard & WhatsApp Deep Links', () => {
  it('generates secure WhatsApp deep links without leaking raw unencoded credentials', () => {
    const shareUrl = WhatsAppService.createFamilyShareWhatsAppUrl(
      'Priya Sharma',
      'prof-1',
      'Look at this profile'
    );
    expect(shareUrl).toContain('https://wa.me/?text=');
    expect(shareUrl).toContain(encodeURIComponent('Priya Sharma'));
    expect(shareUrl).toContain(encodeURIComponent('/profile/prof-1'));
  });

  it('generates direct WhatsApp chat URL with clean phone number format', () => {
    const chatUrl = WhatsAppService.createDirectWhatsAppChatUrl(
      '+91 98765-43210',
      'Rohan',
      'Priya'
    );
    expect(chatUrl).toContain('https://wa.me/919876543210');
    expect(chatUrl).toContain('Namaste%20Rohan');
  });

  it('generates signed referral links with referral codes', () => {
    const referralLink = WhatsAppService.getReferralLink('MOS-TEST-123');
    expect(referralLink).toContain('/register?ref=MOS-TEST-123');
  });
});
