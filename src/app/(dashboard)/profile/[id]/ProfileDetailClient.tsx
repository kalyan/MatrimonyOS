'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Share2,
  ShieldCheck,
  Lock,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  AlertTriangle,
  Ban,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { calculateMatchScore } from '@/lib/matchmaking/scoring';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';
import { Profile, MatchScoreResult } from '@/lib/types';
import CompatibilityModal from '@/components/matches/CompatibilityModal';
import ReportModal from '@/components/safety/ReportModal';
import BlockModal from '@/components/safety/BlockModal';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile: currentProfile } = useAuth();
  const profileId = params?.id as string;

  const [targetProfile, setTargetProfile] = useState<Profile | null>(null);
  const [scoreResult, setScoreResult] = useState<MatchScoreResult | null>(null);
  const [isInterestSent, setIsInterestSent] = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (!profileId) return;
    const found = MockRepository.getProfileById(profileId);
    if (found) {
      setTargetProfile(found);
      if (currentProfile) {
        const prefs = MockRepository.getPreferences(currentProfile.id);
        const score = calculateMatchScore(found, currentProfile, prefs);
        setScoreResult(score);

        // Check if interest sent
        const interests = MockRepository.getInterestsForProfile(currentProfile.id);
        const alreadySent = interests.sent.some((i) => i.receiver_id === found.id);
        setIsInterestSent(alreadySent);
      }
    }
  }, [profileId, currentProfile]);

  if (!targetProfile) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Profile Not Found</h2>
        <p className="text-xs text-slate-500">The requested profile might have been modified or deactivated.</p>
        <Link href="/discover" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Discover
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentProfile?.id === targetProfile.id;

  const handleSendInterest = () => {
    if (!currentProfile) return;
    MockRepository.sendInterest(currentProfile.id, targetProfile.id);
    setIsInterestSent(true);
  };

  const handleWhatsAppShare = () => {
    const url = WhatsAppService.createFamilyShareWhatsAppUrl(
      `${targetProfile.first_name} ${targetProfile.last_name}`,
      targetProfile.id,
      `Sharing this profile on Matrimony OS for review. Education: ${targetProfile.highest_education}`
    );
    window.open(url, '_blank');
  };

  const allPhotos = targetProfile.photos && targetProfile.photos.length > 0
    ? targetProfile.photos.map((p) => p.url)
    : [targetProfile.primary_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Back & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center space-x-1 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {!isOwnProfile && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Share profile via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </button>

            <button
              onClick={() => setShowBlockModal(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs transition"
              title="Block Profile"
            >
              <Ban className="w-3.5 h-3.5 text-rose-500" />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs transition"
              title="Report Profile"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        )}
      </div>

      {/* Profile Header Card with Photo Carousel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full bg-slate-100">
          <img
            src={allPhotos[selectedPhotoIndex]}
            alt={targetProfile.first_name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Compatibility Badge */}
          {scoreResult && !isOwnProfile && (
            <button
              onClick={() => setShowCompatibilityModal(true)}
              className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center space-x-1.5 hover:bg-white transition border border-rose-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-xs font-bold text-slate-900">{scoreResult.overallScore}% Compatibility</span>
            </button>
          )}

          {/* Verified Badge */}
          {targetProfile.is_verified && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur text-white text-xs font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Profile</span>
            </div>
          )}

          {/* Bottom Photo Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white z-10">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {targetProfile.first_name} {targetProfile.last_name}
              </h1>
              <span className="text-sm font-normal text-slate-200">
                {targetProfile.age} yrs {targetProfile.height_cm ? `• ${targetProfile.height_cm} cm` : ''}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-200 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
              <span>{targetProfile.city}, {targetProfile.state}, {targetProfile.country}</span>
              {targetProfile.willing_to_relocate && (
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded ml-2">Willing to relocate</span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {allPhotos.length > 1 && (
          <div className="flex items-center space-x-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
            {allPhotos.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-12 h-12 rounded-xl overflow-hidden ring-2 transition flex-shrink-0 ${
                  selectedPhotoIndex === idx ? 'ring-brand-600' : 'ring-transparent opacity-60'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons for non-self */}
        {!isOwnProfile && currentProfile && (
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSendInterest}
              disabled={isInterestSent}
              className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition ${
                isInterestSent
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInterestSent ? 'fill-emerald-800' : 'fill-white'}`} />
              <span>{isInterestSent ? 'Interest Sent (Pending Approval)' : 'Express Interest'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto py-3 px-5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Discuss with Family on WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* Protected Contact Information Shield */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-start space-x-3 text-xs text-emerald-950">
        <Lock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Contact Shield Active</div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Phone numbers and direct WhatsApp handles are protected. Contact sharing requires both members to send interest, create a mutual connection, and explicitly approve contact exchange.
          </p>
        </div>
      </div>

      {/* Structured Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: About Me */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About {targetProfile.first_name}</h2>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {targetProfile.about_me}
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Interests & Passions:</span>
            <div className="flex flex-wrap gap-1.5">
              {targetProfile.interests.map((item, idx) => (
                <span key={idx} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Education & Career */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Education & Career</h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <div className="text-slate-400 font-medium text-[11px]">Highest Qualification</div>
              <div className="font-semibold text-slate-900">{targetProfile.highest_education}</div>
              {targetProfile.institution && (
                <div className="text-slate-500">{targetProfile.institution}</div>
              )}
            </div>

            <div>
              <div className="text-slate-400 font-medium text-[11px]">Profession & Designation</div>
              <div className="font-semibold text-slate-900">{targetProfile.profession}</div>
              {targetProfile.employer && (
                <div className="text-slate-500">{targetProfile.employer}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Employment Type</div>
                <div className="font-medium capitalize">{targetProfile.employment_type.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Annual Income</div>
                <div className="font-medium text-slate-900">{targetProfile.annual_income_range || 'Confidential'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Family & Cultural Background */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Family & Cultural Background</h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Mother Tongue</div>
                <div className="font-medium">{targetProfile.mother_tongue}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Community</div>
                <div className="font-medium">{targetProfile.community_name || 'Regional'}</div>
              </div>
            </div>

            <div>
              <div className="text-slate-400 font-medium text-[11px]">Languages Spoken</div>
              <div className="font-medium">{targetProfile.languages_spoken.join(', ')}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium text-[11px]">Family Values</div>
              <div className="font-medium capitalize">{targetProfile.family_values} values</div>
            </div>

            {targetProfile.about_my_family && (
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Family Notes</div>
                <p className="text-slate-600 leading-relaxed mt-0.5">{targetProfile.about_my_family}</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Lifestyle Habits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lifestyle & Habits</h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Dietary Habits</div>
                <div className="font-medium capitalize">{targetProfile.dietary_habits.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Marital Status</div>
                <div className="font-medium capitalize">{targetProfile.marital_status.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Smoking</div>
                <div className="font-medium capitalize">{targetProfile.smoking}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Drinking</div>
                <div className="font-medium capitalize">{targetProfile.drinking}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Breakdown Modal */}
      {showCompatibilityModal && scoreResult && (
        <CompatibilityModal
          candidate={targetProfile}
          scoreResult={scoreResult}
          onClose={() => setShowCompatibilityModal(false)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && currentProfile && (
        <ReportModal
          reportedProfile={targetProfile}
          currentProfileId={currentProfile.id}
          onSuccess={() => {}}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Block Modal */}
      {showBlockModal && currentProfile && (
        <BlockModal
          targetProfile={targetProfile}
          currentProfileId={currentProfile.id}
          onSuccess={() => router.push('/discover')}
          onClose={() => setShowBlockModal(false)}
        />
      )}
    </div>
  );
}
