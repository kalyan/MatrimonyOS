'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-16 text-slate-800">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Contact & Support</h1>
        <p className="text-xs text-slate-500">Reach our user trust, family assistance, and technical team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
          <Mail className="w-5 h-5 text-brand-600 mx-auto" />
          <div className="font-bold text-xs text-slate-900">Email Support</div>
          <div className="text-[11px] text-slate-500">support@matrimonyos.com</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
          <Phone className="w-5 h-5 text-emerald-600 mx-auto" />
          <div className="font-bold text-xs text-slate-900">WhatsApp Helpdesk</div>
          <div className="text-[11px] text-slate-500">+91 98765 00000</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
          <MapPin className="w-5 h-5 text-purple-600 mx-auto" />
          <div className="font-bold text-xs text-slate-900">Headquarters</div>
          <div className="text-[11px] text-slate-500">Bengaluru & Guwahati</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Send us a message</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Message Dispatched</h3>
            <p className="text-xs text-slate-500">Our family assistance team will respond within 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
