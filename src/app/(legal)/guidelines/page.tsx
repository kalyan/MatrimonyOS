import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Community Guidelines</h1>
        <p className="text-xs text-slate-500">Standards of conduct on Matrimony OS</p>
      </div>

      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
        <p>
          Matrimony OS is dedicated to creating an atmosphere of mutual dignity, family respect, and cultural integrity.
        </p>

        <h2 className="text-sm font-bold text-slate-900">Expected Behavior:</h2>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Be respectful and authentic in all introductions and communication.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Respect other users&apos; response timelines and decline decisions gracefully without repeated pings.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Involve family members respectfully through the designated Family Mode links.</span>
          </li>
        </ul>

        <h2 className="text-sm font-bold text-slate-900 pt-2">Zero Tolerance Violations:</h2>
        <ul className="space-y-2">
          <li>• Commercial advertisements, job offers, or financial solicitation.</li>
          <li>• Demanding dowry, financial compensation, or deceptive matrimonial practices.</li>
          <li>• Creating fake profiles or impersonating another living or fictional person.</li>
        </ul>
      </div>
    </div>
  );
}
