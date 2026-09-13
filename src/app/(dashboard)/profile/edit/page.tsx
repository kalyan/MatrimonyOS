'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import AIBioModal from '@/components/ai/AIBioModal';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateCurrentProfile } = useAuth();
  const [showAiBio, setShowAiBio] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    profession: '',
    highest_education: '',
    city: '',
    state: '',
    about_me: '',
    annual_income_range: '',
    primary_photo_url: '',
    willing_to_relocate: true,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        profession: profile.profession || '',
        highest_education: profile.highest_education || '',
        city: profile.city || '',
        state: profile.state || '',
        about_me: profile.about_me || '',
        annual_income_range: profile.annual_income_range || '',
        primary_photo_url: profile.primary_photo_url || '',
        willing_to_relocate: profile.willing_to_relocate ?? true,
      });
    }
  }, [profile]);

  if (!profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile(form);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      router.push(`/profile/${profile.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center space-x-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">Edit Profile & Photos</h1>
        <div />
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile saved successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-5">
        {/* Photo URL preview */}
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <img
            src={form.primary_photo_url || profile.primary_photo_url}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 flex-shrink-0"
          />
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Primary Photo URL</label>
            <input
              type="url"
              value={form.primary_photo_url}
              onChange={(e) => setForm({ ...form, primary_photo_url: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        {/* Education & Profession */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Profession</label>
            <input
              type="text"
              value={form.profession}
              onChange={(e) => setForm({ ...form, profession: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Education</label>
            <input
              type="text"
              value={form.highest_education}
              onChange={(e) => setForm({ ...form, highest_education: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Income</label>
            <input
              type="text"
              value={form.annual_income_range}
              onChange={(e) => setForm({ ...form, annual_income_range: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* About Me & AI Assist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">About Me Description</label>
            <button
              type="button"
              onClick={() => setShowAiBio(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Polish with AI</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={form.about_me}
            onChange={(e) => setForm({ ...form, about_me: e.target.value })}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 leading-relaxed"
          />
        </div>

        {/* Relocation toggle */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            checked={form.willing_to_relocate}
            onChange={(e) => setForm({ ...form, willing_to_relocate: e.target.checked })}
            className="w-4 h-4 text-brand-600 rounded border-slate-300"
          />
          <span className="text-xs text-slate-700">Open to relocating after marriage</span>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/25"
        >
          Save Profile Changes
        </button>
      </form>

      {showAiBio && (
        <AIBioModal
          initialBio={form.about_me}
          name={profile.first_name}
          profession={form.profession}
          city={form.city}
          onApply={(newBio) => setForm({ ...form, about_me: newBio })}
          onClose={() => setShowAiBio(false)}
        />
      )}
    </div>
  );
}
