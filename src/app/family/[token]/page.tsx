'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Heart,
  MessageCircleQuestion,
  GraduationCap,
  Briefcase,
  MapPin,
  Check,
} from 'lucide-react';
import { MockRepository } from '@/lib/mock/mock-repository';
import { FamilyMember, Profile, FamilyRecommendation } from '@/lib/types';
import { SEED_PROFILES } from '@/lib/mock/seed-data';

export default function FamilyPortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [familyMember, setFamilyMember] = useState<FamilyMember | null>(null);
  const [primaryProfile, setPrimaryProfile] = useState<Profile | null>(null);
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<{
    [targetId: string]: { rec: FamilyRecommendation; note: string; submitted: boolean };
  }>({});

  useEffect(() => {
    if (!token) return;
    const member = MockRepository.getFamilyMemberByToken(token);
    if (member) {
      setFamilyMember(member);
      const primary = MockRepository.getProfileById(member.primary_profile_id);
      if (primary) {
        setPrimaryProfile(primary);
        // Show eligible candidates of opposite gender
        const all = MockRepository.getProfiles().filter(
          (p) => p.id !== primary.id && p.gender !== primary.gender
        );
        setCandidates(all);
      }
    }
  }, [token]);

  if (!familyMember || !primaryProfile) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Invalid or Expired Family Link</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Please ask your family member to generate a fresh invitation link from their Matrimony OS dashboard.
        </p>
      </div>
    );
  }

  const handleReviewSubmit = (targetId: string, rec: FamilyRecommendation) => {
    const note = selectedRecommendations[targetId]?.note || '';
    MockRepository.submitFamilyReview(
      familyMember.id,
      primaryProfile.id,
      targetId,
      rec,
      note
    );

    setSelectedRecommendations((prev) => ({
      ...prev,
      [targetId]: { rec, note, submitted: true },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner for Family Member */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-brand-700 rounded-3xl p-6 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>Family Collaboration Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome, {familyMember.member_name}
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 max-w-lg">
          You are assisting <strong className="text-white underline">{primaryProfile.first_name} {primaryProfile.last_name}</strong> as {familyMember.relation}. Review profiles and share your feedback.
        </p>
      </div>

      {/* Guidance Card for Parents */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="font-bold flex items-center space-x-1.5">
          <Users className="w-4 h-4 text-amber-700" />
          <span>How Family Review Works:</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Click &quot;Highly Recommend&quot; or &quot;Discuss Further&quot; and leave private thoughts. {primaryProfile.first_name} will see your notes in their private dashboard to guide their decisions.
        </p>
      </div>

      {/* Candidate Profiles List */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Matches for {primaryProfile.first_name} ({candidates.length})
        </h2>

        {candidates.map((cand) => {
          const reviewState = selectedRecommendations[cand.id];

          return (
            <div
              key={cand.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden space-y-4 p-5"
            >
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <img
                  src={cand.primary_photo_url}
                  alt={cand.first_name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">
                      {cand.first_name} {cand.last_name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      ({cand.age} yrs, {cand.height_cm} cm)
                    </span>
                    {cand.is_verified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cand.city}, {cand.state}</span>
                  </div>
                  <div className="text-xs text-slate-700 flex flex-wrap gap-2 pt-0.5">
                    <span className="flex items-center space-x-1 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cand.highest_education}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cand.profession}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Family Background */}
              <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-700 space-y-2 border border-slate-100">
                <p className="italic leading-relaxed">&quot;{cand.about_me}&quot;</p>
                {cand.about_my_family && (
                  <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Family Background:</strong> {cand.about_my_family}
                  </div>
                )}
              </div>

              {/* Family Recommendation Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-700">
                  Your Recommendation as {familyMember.relation}:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReviewSubmit(cand.id, 'highly_recommend')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                      reviewState?.rec === 'highly_recommend'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>🌟 Highly Recommend</span>
                  </button>

                  <button
                    onClick={() => handleReviewSubmit(cand.id, 'recommend')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                      reviewState?.rec === 'recommend'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>👍 Good Match</span>
                  </button>

                  <button
                    onClick={() => handleReviewSubmit(cand.id, 'discuss_further')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                      reviewState?.rec === 'discuss_further'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>💬 Discuss Further</span>
                  </button>

                  <button
                    onClick={() => handleReviewSubmit(cand.id, 'not_recommended')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                      reviewState?.rec === 'not_recommended'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Pass</span>
                  </button>
                </div>

                {/* Optional Private Note */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Add private note for ${primaryProfile.first_name} (e.g. good educational match)...`}
                    value={selectedRecommendations[cand.id]?.note || ''}
                    onChange={(e) =>
                      setSelectedRecommendations((prev) => ({
                        ...prev,
                        [cand.id]: {
                          rec: prev[cand.id]?.rec || 'recommend',
                          note: e.target.value,
                          submitted: false,
                        },
                      }))
                    }
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={() =>
                      handleReviewSubmit(
                        cand.id,
                        selectedRecommendations[cand.id]?.rec || 'recommend'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                  >
                    Save Note
                  </button>
                </div>

                {reviewState?.submitted && (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 animate-fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved! {primaryProfile.first_name} will see your feedback.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
