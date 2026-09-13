'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Share2,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { FamilyMember, FamilyReview } from '@/lib/types';
import FamilyInviteModal from '@/components/family/FamilyInviteModal';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export default function FamilyHubPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [reviews, setReviews] = useState<FamilyReview[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const loadFamilyData = () => {
    if (!profile) return;
    setMembers(MockRepository.getFamilyMembers(profile.id));
    setReviews(MockRepository.getFamilyReviews(profile.id));
  };

  useEffect(() => {
    loadFamilyData();
  }, [profile]);

  if (!profile) return null;

  const handleCopyLink = (token: string) => {
    const url = WhatsAppService.getFamilyInviteLink(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleWhatsAppInvite = (member: FamilyMember) => {
    const url = WhatsAppService.createFamilyInviteWhatsAppUrl(
      profile.first_name,
      member.invite_token,
      member.relation
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>Family Collaboration Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Family Mode</h1>
          <p className="text-xs text-slate-600 max-w-lg">
            Invite your parents or siblings to help shortlist matrimonial matches and leave private notes. You always retain final control.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-brand-500/20 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Family Member</span>
        </button>
      </div>

      {/* Invited Family Members Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Invited Family Members ({members.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{member.member_name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                    {member.relation}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {member.has_joined ? 'Active on dashboard' : 'Invitation sent'}
                </div>
                <Link
                  href={`/family/${member.invite_token}`}
                  className="text-[11px] text-brand-600 font-bold hover:underline inline-block mt-1"
                >
                  Preview Member Portal →
                </Link>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyLink(member.invite_token)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition"
                  title="Copy Access Link"
                >
                  {copiedToken === member.invite_token ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleWhatsAppInvite(member)}
                  className="p-2 rounded-xl bg-wa-green hover:bg-[#1EBE5D] text-white transition shadow-sm"
                  title="Resend on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Reviews & Recommendations Feed */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Family Review & Recommendations Trail
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => {
              const target = rev.target_profile;
              const member = rev.family_member;
              if (!target) return null;

              return (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={target.primary_photo_url}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/profile/${target.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-brand-600"
                        >
                          {target.first_name} {target.last_name}
                        </Link>
                        <span className="text-xs text-slate-400">({target.city})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                          {rev.recommendation.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          by {member?.member_name || 'Family'} ({member?.relation || 'Guardian'})
                        </span>
                      </div>

                      {rev.private_note && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                          &quot;{rev.private_note}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/profile/${target.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    View Match
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No family reviews submitted yet. When your family reviews candidates using their private link, their comments will appear here.
          </div>
        )}
      </div>

      {/* Modal */}
      {showInviteModal && (
        <FamilyInviteModal
          currentProfile={profile}
          onSuccess={() => {
            loadFamilyData();
            setShowInviteModal(false);
          }}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
