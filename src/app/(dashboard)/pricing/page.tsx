'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Shield, Heart, Users, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth/auth-context';

export default function PricingPage() {
  const { profile } = useAuth();
  const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);

  const handleMockUpgrade = (planName: string) => {
    setUpgradedPlan(planName);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Transparent Matrimonial Memberships
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Find Your Partner with Confidence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Every plan includes our strict safety charter, zero unsolicited messaging, and verified matrimonial matching.
        </p>
      </div>

      {upgradedPlan && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 animate-fade-in">
          <div className="text-sm font-bold text-emerald-950">
            🎉 Successfully upgraded to {upgradedPlan}!
          </div>
          <p className="text-xs text-emerald-800">
            Your daily interest limit has been boosted to unlimited, and priority family features are unlocked.
          </p>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Free Member</h3>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹0</div>
              <p className="text-[11px] text-slate-500">Essential matchmaking access</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Create verified profile & photos</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>5 interests sent per day</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Daily AI match recommendations</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>1 family member invite link</span>
              </li>
            </ul>
          </div>
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold cursor-default"
          >
            Current Active Tier
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-rose-50/70 to-white p-6 rounded-3xl border-2 border-brand-500 shadow-xl flex flex-col justify-between space-y-6 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
            Recommended
          </span>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-brand-950">Premium Plan</h3>
              <div className="text-2xl font-extrabold text-brand-950 mt-1">
                ₹9,999 <span className="text-xs font-normal text-slate-500">/ 3 months</span>
              </div>
              <p className="text-[11px] text-brand-700">For serious active seekers</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span className="font-semibold">Unlimited daily interests</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>Direct WhatsApp contact sharing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>Unlimited Family Mode invites</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>Priority placement in matches</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>AI Profile Bio polish boosts</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleMockUpgrade('Premium Plan')}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/25"
          >
            Upgrade to Premium (Demo)
          </button>
        </div>

        {/* Assisted Matrimony */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Assisted Matrimony</h3>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹99,999 <span className="text-xs font-normal text-slate-500">/ 6 months</span>
              </div>
              <p className="text-[11px] text-slate-500">Dedicated relationship advisor</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Human matrimonial relationship advisor</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Curated & family-vetted profiles</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Family meeting & call coordination</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Priority safety & background checks</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleMockUpgrade('Assisted Matrimony')}
            className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
          >
            Select Assisted (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
