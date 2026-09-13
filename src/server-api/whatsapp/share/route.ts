import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export async function POST(req: NextRequest) {
  try {
    const { action, candidateName, profileId, customNote, inviterName, token, relation, referralCode, userName } = await req.json();

    let shareUrl = '';
    if (action === 'family_share') {
      shareUrl = WhatsAppService.createFamilyShareWhatsAppUrl(candidateName, profileId, customNote);
    } else if (action === 'family_invite') {
      shareUrl = WhatsAppService.createFamilyInviteWhatsAppUrl(inviterName, token, relation);
    } else if (action === 'referral') {
      shareUrl = WhatsAppService.createReferralWhatsAppUrl(referralCode, userName);
    } else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    return NextResponse.json({ shareUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Share URL generation failed' }, { status: 500 });
  }
}
