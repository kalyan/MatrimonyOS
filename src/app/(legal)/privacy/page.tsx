import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: September 2026</p>
      </div>

      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy By Default Architecture</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            We never expose personal phone numbers or direct contact details publicly. All profiles are shielded by default.
          </p>
        </div>

        <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect basic identity and matrimonial parameters such as full name, date of birth, gender, educational degrees, profession, city, mother tongue, dietary preferences, and user-provided photos.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. Search Engine Privacy (noindex)</h2>
        <p>
          All profile discovery pages, match feeds, and family collaboration routes carry HTTP `X-Robots-Tag: noindex, nofollow` headers to prevent search engines from indexing your matrimonial profiles.
        </p>

        <h2 className="text-sm font-bold text-slate-900">3. Contact Sharing & Controlled Communication</h2>
        <p>
          Your contact numbers and WhatsApp credentials remain encrypted and concealed until you affirmatively click &quot;Approve Contact Sharing&quot; on a mutual connection.
        </p>

        <h2 className="text-sm font-bold text-slate-900">4. Account Deletion & Data Rights</h2>
        <p>
          Users may delete their profile, photo assets, and interaction logs at any time directly through the Privacy & Safety Center or by contacting privacy@matrimonyos.com.
        </p>
      </div>
    </div>
  );
}
