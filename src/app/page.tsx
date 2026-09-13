'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Share2,
  ChevronDown,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { SEED_PROFILES } from '@/lib/mock/seed-data';


export default function LandingPage() {
  const sampleCandidate = SEED_PROFILES[0]; // Priya Sharma

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="text-center pt-6 sm:pt-12 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-semibold shadow-sm animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>WhatsApp-First Matrimonial Experience</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Meaningful Connections. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
            Trusted by Families.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A modern, privacy-first matrimonial platform designed around people, preferences, and family involvement. Find verified profiles with explainable AI compatibility.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition flex items-center justify-center space-x-2"
          >
            <span>Create Your Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold text-sm transition shadow-sm"
          >
            Explore How It Works
          </Link>
          <Link
            href="/discover"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-sm transition shadow-sm"
          >
            Browse Demo Feed
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strictly 18+ & Verified</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Mutual Consent Contact Sharing</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-brand-600" />
            <span>Family Review Collaboration</span>
          </div>
        </div>
      </section>

      {/* Interactive Profile Card Preview */}
      <section className="max-w-xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Experience Preview</span>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80">
          <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={sampleCandidate.primary_photo_url}
              alt={sampleCandidate.first_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-slate-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>94% Compatibility</span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="font-bold text-lg">{sampleCandidate.first_name} {sampleCandidate.last_name}, {sampleCandidate.age}</div>
              <div className="text-xs text-slate-200">{sampleCandidate.profession} • {sampleCandidate.city}</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-900 flex items-center justify-between">
            <span className="font-semibold">Why this match: Both based in Bengaluru • Postgraduate education</span>
            <span className="text-brand-600 font-bold">Explainable AI</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How Matrimony OS Works</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            A purposeful 5-step journey built for matrimonial intent, family respect, and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold text-base flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Create & Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm 18+ age status, describe your background with AI bio polish, and specify partner preferences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold text-base flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Family Collaboration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Invite parents or siblings via WhatsApp. They get a private dashboard to review, leave notes, and recommend profiles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold text-base flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Consent-Based Introductions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send interest. Once accepted, structured icebreakers unlock. Contact details are shared only upon mutual consent.
            </p>
          </div>
        </div>
      </section>

      {/* Family Mode Differentiator Section */}
      <section className="bg-gradient-to-br from-amber-50 via-rose-50/50 to-orange-50 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <Users className="w-3.5 h-3.5" />
            <span>Family Mode — Major Differentiator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bring Your Family In As Partners, Not Spectators
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In Indian matrimony, family alignment is paramount. Generate a secure, one-click WhatsApp link for your mother, father, or sibling. They can view candidate profiles, leave private comments, and recommend candidates without accessing your private conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-white/90 rounded-2xl border border-amber-100 shadow-sm space-y-2">
            <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Audit Trail</span>
            </div>
            <p className="text-xs text-slate-500">
              See which family member recommended each match (e.g. &quot;Mother recommended Rajesh on Sept 14&quot;).
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border border-amber-100 shadow-sm space-y-2">
            <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Account Interference</span>
            </div>
            <p className="text-xs text-slate-500">
              Family members can never send interests or accept invitations on your behalf. You remain in complete control.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Safety Center Showcase */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Privacy & Safety By Default</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            No Harassment. No Public Scraping. No Open Messaging.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Matrimony OS is not a casual dating app. We built strict structural guardrails to protect your personal identity, contact numbers, and peace of mind.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>No direct unapproved DMs:</strong> Communication requires mutual interest acceptance.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Search Engine Privacy:</strong> User profiles carry strict `noindex, nofollow` headers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Consent-Locked Contacts:</strong> Phone numbers & WhatsApp links unlock only when both parties click Approve.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Safety Charter</div>
              <div className="text-[11px] text-slate-500">Zero tolerance for bad actors</div>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl">
              ✓ Continuous rate limiting against spam interests
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              ✓ Immediate one-tap block and confidential reporting
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              ✓ Active human moderation queue for flagged profiles
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Fair & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Membership Plans</h2>
          <p className="text-sm text-slate-500">Free to start. Upgrade whenever you want higher reach or family assistance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Free Member</h3>
              <div className="text-2xl font-extrabold text-slate-900">₹0</div>
              <p className="text-[11px] text-slate-500">Forever free for essential discovery</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>✓ Matrimonial profile & photos</li>
              <li>✓ Daily AI match recommendations</li>
              <li>✓ 5 interests sent per day</li>
              <li>✓ Receive & accept unlimited interests</li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full text-center py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-brand-50/50 p-6 rounded-2xl border-2 border-brand-500 shadow-xl space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Most Popular
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-brand-950">Premium Member</h3>
              <div className="text-2xl font-extrabold text-brand-950">₹9,999 <span className="text-xs font-normal text-slate-500">/ quarter</span></div>
              <p className="text-[11px] text-brand-700">For active matrimonial seekers</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li>✓ Unlimited interests & express alerts</li>
              <li>✓ Direct WhatsApp contact sharing unlock</li>
              <li>✓ Unlimited family member invites</li>
              <li>✓ AI Profile Bio Assistant boosts</li>
              <li>✓ Verified badge & priority ranking</li>
            </ul>
            <Link
              href="/pricing"
              className="block w-full text-center py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-xs text-white transition shadow-md shadow-brand-500/25"
            >
              Explore Premium
            </Link>
          </div>

          {/* Assisted Matrimony */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Assisted Matrimony</h3>
              <div className="text-2xl font-extrabold text-slate-900">₹99,999 <span className="text-xs font-normal text-slate-500">/ 6 months</span></div>
              <p className="text-[11px] text-slate-500">Dedicated relationship consultant</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>✓ Human matchmaking advisor</li>
              <li>✓ Handpicked & verified introductions</li>
              <li>✓ Family meeting coordination</li>
              <li>✓ Full privacy protection</li>
            </ul>
            <Link
              href="/pricing"
              className="block w-full text-center py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              View Assisted Details
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about Matrimony OS</p>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Is Matrimony OS a dating app?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. Matrimony OS is strictly a matrimonial platform for individuals and families seeking lifelong marriage. We do not support swiping, casual hookups, or open unsolicited messaging.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Can my parents use Matrimony OS?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes! You can generate a private Family Mode link via WhatsApp. Your parents can review matches, shortlist candidates, and share feedback with you directly from any smartphone browser without needing complex passwords.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Who can see my phone number and photos?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              By default, your phone number and WhatsApp details are completely hidden. Contact details are only unlocked when you and another member mutually agree to exchange contacts. You can also set photos to be visible only to accepted connections.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-brand-600 via-rose-600 to-amber-600 text-white shadow-xl max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Begin Your Matrimonial Journey?
        </h2>
        <p className="text-xs sm:text-sm text-rose-100 max-w-lg mx-auto">
          Create your verified profile in 3 minutes. Family-friendly, privacy-first, and powered by intelligent matching.
        </p>
        <div className="pt-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-rose-50 transition shadow-lg"
          >
            <span>Create Profile (Strictly 18+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
