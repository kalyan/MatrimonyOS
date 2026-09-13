'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  Users,
  Lock,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck,
  Send,
  HelpCircle,
  KeyRound,
  Compass,
  Smile,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activePersona, setActivePersona] = useState<'candidate' | 'family' | 'match' | 'admin'>('candidate');

  const STAGES = [
    {
      id: 0,
      title: '18+ Registration & Safety Gate',
      badge: 'Step 1: Onboarding',
      icon: ShieldCheck,
      color: 'emerald',
      summary: 'Strict eligibility confirmation, comprehensive background details, and AI bio polish.',
      description:
        'Every candidate begins with mandatory date-of-birth age validation (strictly 18+) and a formal matrimonial declaration. Candidates fill out verified details regarding their education, profession, family background, lifestyle habits, and partner preferences. The AI Bio Assistant helps polish their thoughts into an articulate matrimonial introduction without fabricating details.',
      dataState: {
        whoSees: 'Only Platform Administrator for safety review.',
        privacyState: 'Private & Hidden (Pending Review)',
        candidateControl: 'Full control to edit details, upload photos, and set privacy levels.',
      },
      highlights: [
        'Mandatory 18+ age verification gate',
        'Transparent matrimonial intent declaration',
        'AI Bio refinement with strict truthfulness guardrails',
        'Configurable photo visibility (blur or registered-only)',
      ],
    },
    {
      id: 1,
      title: 'Admin Verification & Moderation',
      badge: 'Step 2: Safety Charter',
      icon: UserCheck,
      color: 'purple',
      summary: 'Human-in-the-loop review by Platform Admin before profiles go live.',
      description:
        'To prevent fake accounts, bad actors, and spam, newly registered profiles remain in "pending_approval" status. Platform Administrator (kalyanjit@gmail.com) inspects submitted photos, credentials, and profile text. Only once approved does the profile become active and indexed into matrimonial discovery feeds.',
      dataState: {
        whoSees: 'Platform Admin (kalyanjit@gmail.com).',
        privacyState: 'Zero public exposure until human verification is complete.',
        candidateControl: 'Candidate can log in to dashboard and preview profile status.',
      },
      highlights: [
        'Profile quarantined in pending queue until approved',
        'Zero discovery visibility for unverified accounts',
        'Admin audit log with approval/rejection timestamp',
        'Community guidelines and anti-harassment enforcement',
      ],
    },
    {
      id: 2,
      title: 'Explainable AI Matchmaking',
      badge: 'Step 3: Discovery',
      icon: Sparkles,
      color: 'rose',
      summary: 'Deterministic 0–100 compatibility scoring across 7 transparent pillars.',
      description:
        'Once active, our explainable compatibility algorithm evaluates mutual fit across 7 weighted vectors: Age (15%), Location & Relocation (15%), Education (15%), Profession (15%), Mother Tongue & Culture (15%), Dietary & Lifestyle (10%), and Shared Interests (15%). Candidates are provided with clear "Why this match?" reasoning—highlighting strong alignment points and constructive topics for conversation.',
      dataState: {
        whoSees: 'Permitted registered candidates matching partner criteria.',
        privacyState: 'Protected Matrimonial Overview (Contact concealed).',
        candidateControl: 'Dynamic filters by age, city, education, and community.',
      },
      highlights: [
        'Transparent 0–100 score without superstitious claims',
        'Detailed "Strong Alignment" breakdowns',
        'Actionable "Suggested Topics to Discuss"',
        'Zero bot-generated fake profiles or fabricated interests',
      ],
    },
    {
      id: 3,
      title: 'Family Collaboration Hub',
      badge: 'Step 4: Family Mode',
      icon: Users,
      color: 'amber',
      summary: 'Engage parents and guardians via secure, parent-friendly WhatsApp links.',
      description:
        'Candidates can generate a private, secure invitation link for Parents, Guardians, or Siblings. Family members access a simplified, high-contrast Family Portal where they can view matches, submit recommendations (Highly Recommend, Good Match, Discuss Further, Pass), and leave private family notes. Candidate autonomy is preserved at all times.',
      dataState: {
        whoSees: 'Invited family member via unguessable 30-day token link.',
        privacyState: 'Private Family Channel (Notes invisible to matches).',
        candidateControl: 'Candidate can revoke family access tokens anytime.',
      },
      highlights: [
        'One-click WhatsApp invite link generation',
        'Parent-friendly portal with large text and simplified actions',
        'Confidential internal family reviews & notes',
        'Audit trail logged directly to candidate home feed',
      ],
    },
    {
      id: 4,
      title: 'Two-Way Consent Contact Shield',
      badge: 'Step 5: Privacy Guard',
      icon: Lock,
      color: 'indigo',
      summary: 'Double-locked contact exchange requiring mutual interest and affirmative consent.',
      description:
        'We never sell, distribute, or publicly display phone numbers or email addresses. When Candidate A expresses interest in Candidate B, Candidate B must accept. Even after acceptance, contact information remains concealed until both parties explicitly click "Share Contact Details". Either party can withdraw consent or block at any point.',
      dataState: {
        whoSees: 'Locked until mutual affirmative consent is exchanged.',
        privacyState: 'Double-locked cryptographic consent barrier.',
        candidateControl: 'One-tap block & report with instant feed removal.',
      },
      highlights: [
        'Phone numbers and email addresses concealed by default',
        'Two-step verification: Accept Interest ➔ Share Contact',
        'Full mutual consent audit logged in database',
        'Instant one-tap candidate block & report mechanism',
      ],
    },
    {
      id: 5,
      title: 'Direct WhatsApp Click-to-Chat',
      badge: 'Step 6: Real Connection',
      icon: MessageCircle,
      color: 'emerald',
      summary: 'Seamless, verified transition to direct WhatsApp conversations with icebreakers.',
      description:
        'Once contact details are unlocked by mutual consent, users can initiate conversation directly on WhatsApp via a secure WhatsApp intent link. The platform pre-populates courteous, culturally respectful matrimonial icebreakers so conversations begin smoothly without awkwardness.',
      dataState: {
        whoSees: 'The mutually connected candidate / parent.',
        privacyState: 'Direct end-to-end encrypted chat on WhatsApp.',
        candidateControl: 'Direct chat on familiar messaging app with zero subscription barriers.',
      },
      highlights: [
        'Direct WhatsApp intent link without manual dialing',
        'Pre-filled matrimonial icebreakers tailored to candidate profile',
        'No lock-in to proprietary chat systems',
        'End-to-end encrypted messaging via official WhatsApp application',
      ],
    },
  ];

  const currentStage = STAGES[activeStage];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Header */}
      <section className="text-center pt-4 sm:pt-10 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Transparent Platform Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          How Information Flows in{' '}
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
            Matrimony OS
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore the lifecycle of user profiles, safety gates, explainable AI matchmaking, and private family collaboration. Every step is engineered for trust, dignity, and privacy.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/20 transition flex items-center space-x-1.5"
          >
            <span>Create Verified Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            Sign In with Account
          </Link>
        </div>
      </section>

      {/* Stage Stepper Navigation */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">
                    {s.badge}
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {s.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detailed Stage Deep Dive */}
      <section className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {currentStage.badge}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
              <span>{currentStage.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {currentStage.summary}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={activeStage === 0}
              onClick={() => setActiveStage(activeStage - 1)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              &larr; Previous Step
            </button>
            <button
              disabled={activeStage === STAGES.length - 1}
              onClick={() => setActiveStage(activeStage + 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition flex items-center space-x-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description & Key Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-2">
                Operational Walkthrough
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentStage.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Guaranteed Platform Safeguards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStage.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy & Information State Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 space-y-5 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Data Governance State
                </span>
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Step 0{activeStage + 1}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Visibility Status</span>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentStage.dataState.privacyState}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Who Can View</span>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {currentStage.dataState.whoSees}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Candidate Authority</span>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {currentStage.dataState.candidateControl}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60">
              <Link
                href="/onboarding"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <span>Experience This Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Persona Perspective Simulator */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Stakeholder Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How Information Appears to Different Parties
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Switch between roles to see how sensitive matrimonial information is filtered and secured for each stakeholder.
          </p>
        </div>

        {/* Persona Buttons */}
        <div className="flex justify-center flex-wrap gap-2">
          <button
            onClick={() => setActivePersona('candidate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activePersona === 'candidate'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Candidate Seeking Match</span>
          </button>
          <button
            onClick={() => setActivePersona('family')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activePersona === 'family'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Family Member (Parent/Guardian)</span>
          </button>
          <button
            onClick={() => setActivePersona('match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activePersona === 'match'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Potential Match (Other User)</span>
          </button>
          <button
            onClick={() => setActivePersona('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activePersona === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin (Kalyanjit)</span>
          </button>
        </div>

        {/* Persona Content Display */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          {activePersona === 'candidate' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Candidate Perspective: Full Control & Privacy</h3>
                  <p className="text-xs text-slate-500">You control your story, who sees your photos, and when contact info is shared.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-brand-900">Curated Match Feed</div>
                  <p className="text-slate-600">Browse verified matches filtered by mutual age, education, city, and cultural criteria.</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-brand-900">Family Audit Trail</div>
                  <p className="text-slate-600">See recommendations and private notes left by your parents on prospective matches.</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-brand-900">Contact Exchange Shield</div>
                  <p className="text-slate-600">No stranger can call or text you without your explicit two-way consent.</p>
                </div>
              </div>
            </div>
          )}

          {activePersona === 'family' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Family Member Perspective: Collaborative Guidance</h3>
                  <p className="text-xs text-slate-500">Parents review matches, recommend candidates, and share thoughts without intruding.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-950">Simple Parent Portal</div>
                  <p className="text-slate-600">High legibility, no complex passwords; access via a secure 30-day token link sent on WhatsApp.</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-950">One-Tap Recommendations</div>
                  <p className="text-slate-600">Tag matches with "Highly Recommend", "Good Match", or "Discuss Further" with one tap.</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-950">Private Family Notes</div>
                  <p className="text-slate-600">Write feedback and discussion points visible exclusively to your daughter/son.</p>
                </div>
              </div>
            </div>
          )}

          {activePersona === 'match' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Potential Match Perspective: Dignified Discovery</h3>
                  <p className="text-xs text-slate-500">Other candidates see your verified attributes without access to private contacts.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-950">What Is Visible</div>
                  <p className="text-slate-600">First name, age, city, education, profession, community, dietary habits, and bio.</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-950">What Is Concealed</div>
                  <p className="text-slate-600">Phone numbers, email addresses, exact house address, and family notes remain hidden.</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-950">How Contact Occurs</div>
                  <p className="text-slate-600">Send an express interest. If mutually approved, you both unlock WhatsApp conversation.</p>
                </div>
              </div>
            </div>
          )}

          {activePersona === 'admin' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Platform Administrator Perspective: Community Safety</h3>
                  <p className="text-xs text-slate-500">Admin Kalyanjit governs registration queues, resolves user reports, and maintains integrity.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-purple-950">Pending Approvals Queue</div>
                  <p className="text-slate-600">Inspect every newly registered account; verify KYC photos and click "Approve & Activate".</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-purple-950">Safety Report Queue</div>
                  <p className="text-slate-600">Triage user reports regarding suspicious behavior, photo mismatch, or policy violations.</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1.5 text-xs">
                  <div className="font-bold text-purple-950">Community Taxonomy</div>
                  <p className="text-slate-600">Manage cultural, regional, and language taxonomy tables across India.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Information Access & Privacy Matrix */}
      <section className="max-w-5xl mx-auto space-y-4">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Data Visibility & Privacy Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A transparent overview of exactly who can view which matrimonial attributes.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Profile Attribute</th>
                <th className="py-3.5 px-4">Public Visitor</th>
                <th className="py-3.5 px-4">Registered Members</th>
                <th className="py-3.5 px-4">Mutual Consent Match</th>
                <th className="py-3.5 px-4">Invited Family</th>
                <th className="py-3.5 px-4">Platform Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold">First Name & Age</td>
                <td className="py-3 px-4 text-slate-400">Hidden</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Education & Career</td>
                <td className="py-3 px-4 text-slate-400">Hidden</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Primary Photos</td>
                <td className="py-3 px-4 text-slate-400">Hidden</td>
                <td className="py-3 px-4 text-amber-600 font-medium">Clear / Blurred (per user choice)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Clear (Unlocked)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Visible (KYC)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">WhatsApp Number & Phone</td>
                <td className="py-3 px-4 text-rose-600 font-bold">Concealed</td>
                <td className="py-3 px-4 text-rose-600 font-bold">Concealed</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Unlocked (Double-Consent)</td>
                <td className="py-3 px-4 text-slate-400">Hidden</td>
                <td className="py-3 px-4 text-slate-500 font-mono">Encrypted Store</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Family Recommendations & Notes</td>
                <td className="py-3 px-4 text-rose-600 font-bold">Concealed</td>
                <td className="py-3 px-4 text-rose-600 font-bold">Concealed</td>
                <td className="py-3 px-4 text-rose-600 font-bold">Concealed</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Family & Candidate Only</td>
                <td className="py-3 px-4 text-slate-400">Private</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Ready for Production CTA */}
      <section className="max-w-4xl mx-auto bg-gradient-to-r from-brand-600 via-rose-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Find Your Meaningful Connection?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100">
            Join verified Indian candidates and families on Matrimony OS. Safe, transparent, and built for lasting marriage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-xs sm:text-sm shadow-md hover:bg-rose-50 transition"
          >
            Start Registration (18+)
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-xs sm:text-sm backdrop-blur transition"
          >
            Already Have an Account? Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
