import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Safety & Security Guidelines</h1>
        <p className="text-xs text-slate-500">Tips for safe matrimonial meetings and communications</p>
      </div>

      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Never Transfer Money</span>
          </div>
          <p className="text-[11px] text-rose-800">
            Never send money, gifts, wire transfers, or cryptocurrency to any prospective match, under any circumstances (including medical emergencies or visa travel claims).
          </p>
        </div>

        <h2 className="text-sm font-bold text-slate-900">1. Safe Initial Interactions</h2>
        <p>
          Begin communications using the platform&apos;s structured icebreakers. When you feel comfortable, proceed with a WhatsApp video call with family present.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. In-Person Meetings with Family</h2>
        <p>
          Always arrange initial in-person matrimonial meetings in well-lit public places (e.g. reputable cafés, restaurants, or family residences). Inform family members of your meeting location and schedule.
        </p>

        <h2 className="text-sm font-bold text-slate-900">3. Trust Your Instincts & Report</h2>
        <p>
          If someone exerts undue pressure, behaves inappropriately, or makes inconsistent claims about their employment or marital status, block them immediately and submit a confidential report.
        </p>
      </div>
    </div>
  );
}
