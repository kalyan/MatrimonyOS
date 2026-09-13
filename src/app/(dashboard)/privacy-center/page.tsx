'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Ban,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { Profile, ProfileVisibility, PhotoVisibility } from '@/lib/types';

export default function PrivacyPage() {
  const { profile, updateCurrentProfile } = useAuth();
  const [blockedProfiles, setBlockedProfiles] = useState<Profile[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadBlocked = () => {
    if (!profile) return;
    const blockedIds = MockRepository.getBlockedProfileIds(profile.id);
    const profiles = MockRepository.getProfiles().filter((p) => blockedIds.includes(p.id));
    setBlockedProfiles(profiles);
  };

  useEffect(() => {
    loadBlocked();
  }, [profile]);

  if (!profile) return null;

  const handleUnblock = (targetId: string) => {
    MockRepository.unblockProfile(profile.id, targetId);
    loadBlocked();
  };

  const handleVisibilityChange = (key: 'profile_visibility' | 'photo_visibility', val: any) => {
    updateCurrentProfile({ [key]: val });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Privacy & Safety Center</h1>
        <p className="text-xs text-slate-500">
          Manage how your matrimonial profile is discovered and protect your personal privacy.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Privacy preferences updated successfully.</span>
        </div>
      )}

      {/* Profile & Photo Visibility Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Discovery & Visibility Controls
        </h2>

        {/* Profile Visibility */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Profile Visibility</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'registered', label: 'All Registered Members', desc: 'Visible to verified users on Matrimony OS' },
              { id: 'matches_only', label: 'Recommended Matches Only', desc: 'Only visible to profiles matching your preferences' },
              { id: 'mutual_interest', label: 'Private (Mutual Only)', desc: 'Hidden until interest is mutually acknowledged' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleVisibilityChange('profile_visibility', opt.id)}
                className={`p-3 rounded-2xl border text-left transition ${
                  profile.profile_visibility === opt.id
                    ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-normal">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Privacy */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">Photo Privacy</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleVisibilityChange('photo_visibility', 'registered')}
              className={`p-3 rounded-2xl border text-left transition ${
                profile.photo_visibility === 'registered'
                  ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Visible to Registered Members</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Recommended for 4x higher response rates.</div>
            </button>

            <button
              onClick={() => handleVisibilityChange('photo_visibility', 'blur')}
              className={`p-3 rounded-2xl border text-left transition ${
                profile.photo_visibility === 'blur'
                  ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Protected / Blurred</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Photo is unlocked only when you accept an interest.</div>
            </button>
          </div>
        </div>
      </div>

      {/* Blocked Profiles Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Ban className="w-4 h-4 text-rose-500" />
          <span>Blocked Members ({blockedProfiles.length})</span>
        </h2>

        {blockedProfiles.length > 0 ? (
          <div className="space-y-3">
            {blockedProfiles.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={b.primary_photo_url}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900">{b.first_name} {b.last_name}</span>
                    <div className="text-[10px] text-slate-500">{b.city} • Blocked</div>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(b.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-white text-slate-700 transition"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            You have not blocked any members. Blocked users cannot view your profile or contact you.
          </p>
        )}
      </div>

      {/* Legal & Safety Commitments */}
      <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 space-y-1.5 leading-relaxed">
        <div className="font-bold text-slate-800">Our Privacy Principles:</div>
        <div>1. Matrimony OS does not sell personal data or display public contact information.</div>
        <div>2. Profile pages enforce `noindex, nofollow` to prevent Google indexing.</div>
        <div>3. You can request complete account deletion at any time by contacting privacy@matrimonyos.com.</div>
      </div>
    </div>
  );
}
