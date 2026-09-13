'use client';

import React from 'react';
import { X, CheckCircle2, MessageCircleQuestion, Sparkles, Compass } from 'lucide-react';
import { MatchScoreResult, Profile } from '@/lib/types';

interface Props {
  candidate: Profile;
  scoreResult: MatchScoreResult;
  onClose: () => void;
}

export default function CompatibilityModal({ candidate, scoreResult, onClose }: Props) {
  const { overallScore, factors, strongAlignment, thingsToDiscuss } = scoreResult;

  const factorList = [
    { label: 'Age Compatibility', score: factors.ageScore, max: 15 },
    { label: 'Location & Relocation', score: factors.locationScore, max: 15 },
    { label: 'Education Alignment', score: factors.educationScore, max: 15 },
    { label: 'Profession & Career', score: factors.professionScore, max: 15 },
    { label: 'Language & Background', score: factors.languageScore, max: 15 },
    { label: 'Lifestyle & Diet', score: factors.lifestyleScore, max: 10 },
    { label: 'Interests & Hobbies', score: factors.interestsScore, max: 15 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {overallScore}%
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Why this match with {candidate.first_name}?
            </h2>
            <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Deterministic Multi-Factor Compatibility Analysis</span>
            </p>
          </div>
        </div>

        {/* Strong Alignment Points */}
        {strongAlignment.length > 0 && (
          <div className="mb-5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Alignment Points</span>
            </h3>
            <ul className="space-y-1.5">
              {strongAlignment.map((item, idx) => (
                <li key={idx} className="text-xs text-emerald-950 flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Constructive Discussion Points */}
        {thingsToDiscuss.length > 0 && (
          <div className="mb-5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5 mb-2.5">
              <MessageCircleQuestion className="w-4 h-4 text-amber-600" />
              <span>Suggested Discussion Topics</span>
            </h3>
            <ul className="space-y-1.5">
              {thingsToDiscuss.map((item, idx) => (
                <li key={idx} className="text-xs text-amber-950 flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Factor Breakdown */}
        <div className="mb-6 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Compatibility Weighting Breakdown
          </div>
          {factorList.map((f, i) => {
            const pct = Math.round((f.score / f.max) * 100);
            return (
              <div key={i} className="text-xs">
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>{f.label}</span>
                  <span className="text-slate-500">
                    {f.score} / {f.max} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-rose-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical AI Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200 leading-relaxed">
          <span className="font-semibold text-slate-700">Matrimony OS Safety Principle:</span> Scoring is calculated deterministically from educational background, location, preferences, and lifestyle. We never make claims of psychological destiny or guaranteed outcome.
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
