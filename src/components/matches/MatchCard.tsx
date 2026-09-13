'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Profile, MatchScoreResult } from '@/lib/types';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';
import CompatibilityModal from './CompatibilityModal';

interface Props {
  candidate: Profile;
  scoreResult?: MatchScoreResult;
  onSendInterest: (candidateId: string) => void;
  onPass?: (candidateId: string) => void;
  onShareToFamily?: (candidateId: string) => void;
  isInterestSent?: boolean;
}

export default function MatchCard({
  candidate,
  scoreResult,
  onSendInterest,
  onPass,
  onShareToFamily,
  isInterestSent = false,
}: Props) {
  const [showCompatibility, setShowCompatibility] = useState(false);
  const score = scoreResult?.overallScore || 85;

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = WhatsAppService.createFamilyShareWhatsAppUrl(
      `${candidate.first_name} ${candidate.last_name}`,
      candidate.id,
      `What do you think of this profile? Education: ${candidate.highest_education}, City: ${candidate.city}`
    );
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition hover:shadow-premium group">
        {/* Photo & Header Section */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-100">
          <img
            src={
              candidate.primary_photo_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
            }
            alt={candidate.first_name}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Compatibility Score Pill */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCompatibility(true);
            }}
            className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center space-x-1.5 hover:bg-white transition border border-rose-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-xs font-bold text-slate-900">{score}% Match</span>
          </button>

          {/* Verified Badge */}
          {candidate.is_verified && (
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur text-white text-[11px] font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}

          {/* Bottom Photo Overlay Info */}
          <div className="absolute bottom-3 left-4 right-4 text-white z-10">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {candidate.first_name} {candidate.last_name}
              </h3>
              <span className="text-sm font-normal text-slate-200">
                {candidate.age} yrs, {candidate.height_cm ? `${candidate.height_cm} cm` : ''}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-200 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
              <span className="truncate">
                {candidate.city}, {candidate.state}
              </span>
              {candidate.willing_to_relocate && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-1">
                  Relocation Open
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-3">
          {/* Education & Profession */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium">{candidate.highest_education}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium">{candidate.profession}</span>
            </div>
          </div>

          {/* Brief Bio Snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {candidate.about_me}
          </p>

          {/* Shared Interests / Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {candidate.interests.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
              >
                {item}
              </span>
            ))}
            {candidate.community_name && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium">
                {candidate.community_name}
              </span>
            )}
          </div>

          {/* Explainable Match Trigger Pill */}
          {scoreResult && (
            <button
              onClick={() => setShowCompatibility(true)}
              className="w-full text-left p-2 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs text-rose-900 hover:bg-rose-50 transition"
            >
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-semibold">
                  Why this match?{' '}
                  <span className="font-normal text-rose-700">
                    {scoreResult.strongAlignment[0] || 'Strong alignment across preferences'}
                  </span>
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            </button>
          )}

          {/* Action Bar */}
          <div className="pt-2 flex items-center space-x-2">
            {/* View Full Profile */}
            <Link
              href={`/profile/${candidate.id}`}
              className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              View Profile
            </Link>

            {/* Express Interest Button */}
            <button
              onClick={() => onSendInterest(candidate.id)}
              disabled={isInterestSent}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                isInterestSent
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/30'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isInterestSent ? 'fill-emerald-800' : 'fill-white'}`} />
              <span>{isInterestSent ? 'Interest Sent' : 'Send Interest'}</span>
            </button>

            {/* WhatsApp Family Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
              title="Share profile with family via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compatibility Breakdown Modal */}
      {showCompatibility && scoreResult && (
        <CompatibilityModal
          candidate={candidate}
          scoreResult={scoreResult}
          onClose={() => setShowCompatibility(false)}
        />
      )}
    </>
  );
}
