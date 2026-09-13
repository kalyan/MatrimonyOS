'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ReportReason, Profile } from '@/lib/types';
import { MockRepository } from '@/lib/mock/mock-repository';

interface Props {
  reportedProfile: Profile;
  currentProfileId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReportModal({
  reportedProfile,
  currentProfileId,
  onSuccess,
  onClose,
}: Props) {
  const [reason, setReason] = useState<ReportReason>('fake_profile');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    MockRepository.submitReport(
      currentProfileId,
      reportedProfile.id,
      reason,
      details.trim()
    );

    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-rose-600 mb-4">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-900">Report Profile</h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Reporting <span className="font-semibold text-slate-700">{reportedProfile.first_name} {reportedProfile.last_name}</span>. Our moderation team reviews all safety reports within 12 hours.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="fake_profile">Fake Profile or Stolen Photos</option>
                <option value="harassment">Harassment or Abusive Behavior</option>
                <option value="inappropriate_content">Inappropriate Content or Messages</option>
                <option value="impersonation">Impersonation of Someone Else</option>
                <option value="scam_or_fraud">Scam, Commercial Solicitation or Fraud</option>
                <option value="unwanted_contact">Repeated Unwanted Contact</option>
                <option value="other">Other Violation of Guidelines</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Details</label>
              <textarea
                required
                rows={3}
                placeholder="Please describe what happened..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-800">
              Reports are confidential. The reported user will not be informed who filed this report.
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              ✓
            </div>
            <h3 className="font-bold text-slate-900 text-base">Report Received</h3>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for keeping Matrimony OS safe. Our moderators are investigating.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
