'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MockRepository } from '@/lib/mock/mock-repository';

export default function ReportAbusePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    targetProfileNameOrId: '',
    reason: 'fake_profile',
    details: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    MockRepository.submitReport(
      'guest-reporter',
      form.targetProfileNameOrId || 'reported-user',
      form.reason as any,
      form.details
    );
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-rose-600">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="text-2xl font-extrabold text-slate-900">Report Abuse & Violations</h1>
        </div>
        <p className="text-xs text-slate-500">
          Submit confidential reports regarding fraud, harassment, impersonation, or violations of matrimonial guidelines.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Name or Link of the Member
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma or matrimonyos.com/profile/prof-1"
                value={form.targetProfileNameOrId}
                onChange={(e) => setForm({ ...form, targetProfileNameOrId: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Violation Category</label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="fake_profile">Fake Profile or Stolen Identity</option>
                <option value="harassment">Harassment or Abusive Behavior</option>
                <option value="scam_or_fraud">Financial Fraud, Dowry Demands or Scams</option>
                <option value="inappropriate_content">Inappropriate Photos or Content</option>
                <option value="unwanted_contact">Unwanted Contact</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description of Incident</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe the incident in detail..."
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Contact Email <span className="text-slate-400 font-normal">(Confidential for follow-up)</span>
              </label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20"
            >
              Submit Confidential Abuse Report
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Abuse Report Received</h3>
            <p className="text-xs text-slate-500">
              Our safety and moderation team will review this report within 12 hours. Thank you for protecting the community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
