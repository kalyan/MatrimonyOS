'use client';

import React, { useState } from 'react';
import { X, Users, Copy, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { Profile, FamilyRelation } from '@/lib/types';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';
import { MockRepository } from '@/lib/mock/mock-repository';

interface Props {
  currentProfile: Profile;
  onSuccess: () => void;
  onClose: () => void;
}

export default function FamilyInviteModal({ currentProfile, onSuccess, onClose }: Props) {
  const [memberName, setMemberName] = useState('');
  const [relation, setRelation] = useState<FamilyRelation>('father');
  const [phone, setPhone] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const newMember = MockRepository.inviteFamilyMember(
      currentProfile.id,
      memberName.trim(),
      relation,
      phone.trim() || undefined
    );

    setGeneratedToken(newMember.invite_token);
    onSuccess();
  };

  const inviteUrl = generatedToken ? WhatsAppService.getFamilyInviteLink(generatedToken) : '';

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    if (!generatedToken) return;
    const url = WhatsAppService.createFamilyInviteWhatsAppUrl(
      currentProfile.first_name,
      generatedToken,
      relation
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center shadow-inner mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Invite Family Member</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Enable your parents or siblings to review matrimonial matches, leave private notes, and recommend profiles.
          </p>
        </div>

        {!generatedToken ? (
          <form onSubmit={handleGenerateInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Family Role</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value as FamilyRelation)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="father">Father (Dad)</option>
                <option value="mother">Mother (Mom)</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="guardian">Guardian</option>
                <option value="relative">Relative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Sharma"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <span>
                Family members only receive access to profiles you shortlist or share. They cannot modify your account settings.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/20"
            >
              Generate Secure Family Link
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="text-xs font-bold text-emerald-900">Invite Link Created!</div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Share this unique link with {memberName} ({relation}) via WhatsApp.
              </p>
            </div>

            <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] font-mono break-all text-slate-700 select-all border border-slate-200">
              {inviteUrl}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleWhatsAppSend}
                className="py-2.5 rounded-xl bg-wa-green hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Send on WhatsApp</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
