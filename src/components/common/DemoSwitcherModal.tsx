'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { X, Check, User, Shield, Users } from 'lucide-react';
import { SEED_PROFILES } from '@/lib/mock/seed-data';

interface Props {
  onClose: () => void;
}

export default function DemoSwitcherModal({ onClose }: Props) {
  const { profile, user, loginAsDemo } = useAuth();

  const handleSelectCandidate = (profileId: string) => {
    loginAsDemo(profileId, 'member');
    onClose();
  };

  const handleSelectAdmin = () => {
    loginAsDemo('', 'admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
            MVP Demo Simulator
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Switch Demo Perspective</h2>
          <p className="text-xs text-slate-500 mt-1">
            Experience Matrimony OS from different stakeholder perspectives: Candidate, Family Member, or Platform Administrator.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Matrimonial Candidates
          </div>

          {SEED_PROFILES.slice(0, 4).map((p) => {
            const isSelected = user?.role === 'member' && profile?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectCandidate(p.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={p.primary_photo_url}
                    alt={p.first_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm flex items-center space-x-1.5">
                      <span>{p.first_name} {p.last_name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({p.age} yrs, {p.city})</span>
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">{p.profession}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-brand-600 flex-shrink-0" />}
              </button>
            );
          })}

          <div className="pt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Governance & Management
          </div>

          <button
            onClick={handleSelectAdmin}
            className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
              user?.role === 'admin'
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Platform Administrator</div>
                <div className="text-xs text-slate-500">Moderation, report queue, user verification & stats</div>
              </div>
            </div>
            {user?.role === 'admin' && <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />}
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            All data persists safely in local storage during demo mode.
          </p>
        </div>
      </div>
    </div>
  );
}
