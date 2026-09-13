import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: September 2026</p>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
        <strong>Notice:</strong> This copy serves as the production-ready operational policy for Matrimony OS MVP and requires statutory review by qualified legal counsel prior to formal incorporation.
      </div>

      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-sm font-bold text-slate-900">1. Eligibility & Strict 18+ Requirement</h2>
        <p>
          Matrimony OS is strictly intended for individuals who are at least eighteen (18) years of age seeking matrimonial alliances. Registration by minors is strictly prohibited and constitutes an intentional violation of these terms.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. Matrimonial Purpose vs. Casual Dating</h2>
        <p>
          The service is designed exclusively for genuine matrimonial matchmaking and family introductions. It may not be used for casual dating, commercial solicitation, harassment, or non-matrimonial interactions.
        </p>

        <h2 className="text-sm font-bold text-slate-900">3. Verification & Authenticity</h2>
        <p>
          Users warrant that all profile details (age, marital status, education, profession, family background) provided to the platform are accurate and truthful. Providing fraudulent certificates or impersonating another individual results in immediate account suspension.
        </p>

        <h2 className="text-sm font-bold text-slate-900">4. Privacy & Mutual Consent Contact Sharing</h2>
        <p>
          Users agree not to scrape, share, or publish private information from other members without explicit mutual consent. Direct phone and WhatsApp exchanges require affirmative consent from both parties.
        </p>
      </div>
    </div>
  );
}
