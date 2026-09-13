import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Refund & Cancellation Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: September 2026</p>
      </div>

      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
        <p>
          At Matrimony OS, we are committed to delivering exceptional matchmaking and family collaboration technology.
        </p>

        <h2 className="text-sm font-bold text-slate-900">1. Premium Membership Subscriptions</h2>
        <p>
          If you purchase a Premium Plan and are unsatisfied within seven (7) calendar days of initial activation, you may request a full refund provided that fewer than ten (10) connection requests or contacts have been utilized.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. Assisted Matrimony Services</h2>
        <p>
          Due to personalized dedicated human consultant time, Assisted Matrimony retainers may be canceled for a prorated refund prior to the commencement of curated candidate introductions.
        </p>

        <h2 className="text-sm font-bold text-slate-900">3. How to Request a Refund</h2>
        <p>
          Submit a request through our <Link href="/contact" className="text-brand-600 underline font-medium">Contact Desk</Link> with your registered user ID and payment reference number. Refunds are processed within 5–7 business days to the original payment source.
        </p>
      </div>
    </div>
  );
}
