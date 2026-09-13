'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Users,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import MatchCard from '@/components/matches/MatchCard';
import FamilyInviteModal from '@/components/family/FamilyInviteModal';
import { Profile, MatchScoreResult } from '@/lib/types';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export default function HomePage() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<{ profile: Profile; score: MatchScoreResult }[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  const [stats, setStats] = useState({ receivedInterests: 0, connections: 0, familyReviews: 0 });
  const [showFamilyInvite, setShowFamilyInvite] = useState(false);

  useEffect(() => {
    if (!profile) return;

    // Load recommendations
    const recs = MockRepository.getRecommendations(profile.id);
    setRecommendations(recs);

    // Load user's sent interests
    const interests = MockRepository.getInterestsForProfile(profile.id);
    setSentInterestIds(interests.sent.map((i) => i.receiver_id));

    // Load stats
    const connections = MockRepository.getConnectionsForProfile(profile.id);
    const reviews = MockRepository.getFamilyReviews(profile.id);
    setStats({
      receivedInterests: interests.received.filter((i) => i.status === 'pending').length,
      connections: connections.length,
      familyReviews: reviews.length,
    });
  }, [profile]);

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">Please complete onboarding</h2>
        <Link href="/onboarding" className="mt-4 inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Start Onboarding
        </Link>
      </div>
    );
  }

  const handleSendInterest = (candidateId: string) => {
    MockRepository.sendInterest(profile.id, candidateId);
    setSentInterestIds((prev) => [...prev, candidateId]);
  };

  const handleWhatsAppReferral = () => {
    const url = WhatsAppService.createReferralWhatsAppUrl('REF-' + profile.first_name.toUpperCase(), profile.first_name);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting & Notification Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-rose-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Matchmaking Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {profile.first_name}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-lg">
            We discovered high-compatibility matrimonial matches curated for your preferences and family background.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setShowFamilyInvite(true)}
              className="px-4 py-2 rounded-xl bg-white text-brand-700 text-xs font-bold hover:bg-rose-50 transition shadow flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Invite Family via WhatsApp</span>
            </button>
            <button
              onClick={handleWhatsAppReferral}
              className="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold backdrop-blur transition flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Quality Score & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Completeness Card */}
        <div className="sm:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-600"
                strokeDasharray={`${profile.completeness_score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-900">{profile.completeness_score}%</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Profile Completeness</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              High completeness boosts visibility to verified families by 3.8x.
            </p>
            <Link href="/profile/edit" className="text-[11px] text-brand-600 font-bold hover:underline inline-flex items-center space-x-1">
              <span>Edit Profile & Photos</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Interests Stat */}
        <Link
          href="/interests"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:border-brand-300 transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">New Interests</span>
            <Heart className="w-4 h-4 text-brand-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.receivedInterests}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Pending your review</p>
        </Link>

        {/* Mutual Connections Stat */}
        <Link
          href="/connections"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-300 transition group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Mutual Connections</span>
            <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.connections}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Contact exchange enabled</p>
        </Link>
      </div>

      {/* Family Review Activity Callout */}
      {stats.familyReviews > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950">Family Recommendations Available</div>
              <p className="text-[11px] text-amber-800">Your family member reviewed and recommended candidate matches.</p>
            </div>
          </div>
          <Link
            href="/family"
            className="px-3 py-1.5 rounded-lg bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition"
          >
            View Notes
          </Link>
        </div>
      )}

      {/* Recommended Matches Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended For You</h2>
            <p className="text-xs text-slate-500">Curated with explainable deterministic compatibility</p>
          </div>
          <Link
            href="/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>View All ({recommendations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 6).map((rec) => (
            <MatchCard
              key={rec.profile.id}
              candidate={rec.profile}
              scoreResult={rec.score}
              onSendInterest={handleSendInterest}
              isInterestSent={sentInterestIds.includes(rec.profile.id)}
            />
          ))}
        </div>
      </div>

      {/* Family Invite Modal */}
      {showFamilyInvite && (
        <FamilyInviteModal
          currentProfile={profile}
          onSuccess={() => setShowFamilyInvite(false)}
          onClose={() => setShowFamilyInvite(false)}
        />
      )}
    </div>
  );
}
