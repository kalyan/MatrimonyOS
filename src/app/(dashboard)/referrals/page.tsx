'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Sparkles, MessageCircle, Gift } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export default function ReferralsPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const referralCode = `MOS-${profile.first_name.toUpperCase()}-2026`;
  const referralLink = WhatsAppService.getReferralLink(referralCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = WhatsAppService.createReferralWhatsAppUrl(referralCode, profile.first_name);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 mx-auto flex items-center justify-center mb-2">
          <Gift className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Invite Friends to Matrimony OS
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Help friends and relatives discover verified, privacy-first matrimonial matches. Earn 1 month of free Premium for every 3 friends who complete their profiles.
        </p>
      </div>

      {/* Share Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
        <label className="block text-xs font-semibold text-slate-700">Your Personal Referral Link</label>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 select-all break-all">
          {referralLink}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-3 px-4 rounded-xl bg-wa-green hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <div className="text-xl font-bold text-slate-900">4</div>
          <div className="text-[10px] text-slate-500">Friends Invited</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <div className="text-xl font-bold text-brand-600">2</div>
          <div className="text-[10px] text-slate-500">Profiles Verified</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <div className="text-xl font-bold text-emerald-600">1/3</div>
          <div className="text-[10px] text-slate-500">Until Next Reward</div>
        </div>
      </div>
    </div>
  );
}
