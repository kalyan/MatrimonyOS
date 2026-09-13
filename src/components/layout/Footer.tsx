'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 404 && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.info('[Dev] Contact message simulated locally. Cloudflare Pages Function functions/api/contact.ts handles edge delivery.');
          setStatus('success');
          setFormData({
            name: '',
            email: '',
            subject: 'General Inquiry',
            message: '',
          });
          return;
        }
        throw new Error(data.error || 'Unable to send your message. Please try again.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-soft space-y-10">
      {/* Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-brand-700 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
            <span>Support & Assistance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With Our Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have questions about verified profiles, assisted matchmaking, or family involvement?
            Send our dedicated team a message and we will respond promptly.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 space-y-1">
            <p>✓ Strictly confidential & privacy-first</p>
            <p>✓ Dedicated relationship & verification advisors</p>
            <p>✓ Average response turnaround under 24 hours</p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Message Delivered</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for reaching out. Your message has been received by our support team, and we will follow up with you promptly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="footer-contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="footer-contact-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label htmlFor="footer-contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email Address *
                  </label>
                  <input
                    id="footer-contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="footer-contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Inquiry Type
                </label>
                <select
                  id="footer-contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Assisted Matrimony">Assisted Matrimony</option>
                  <option value="Premium Membership">Premium Membership</option>
                  <option value="Profile Verification">Profile Verification</option>
                  <option value="Family Portal Support">Family Portal Support</option>
                  <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label htmlFor="footer-contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="footer-contact-message"
                  rows={3}
                  required
                  placeholder="How can our team assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50 resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage || 'Failed to submit message. Please try again.'}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Strictly confidential & encrypted.
                </span>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Navigation & Legal Links */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center space-x-2 font-bold text-slate-800">
          <Heart className="w-4 h-4 text-brand-600 fill-brand-600" />
          <span>Matrimony OS</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600">
          <Link href="/terms" className="hover:text-slate-900 transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link>
          <Link href="/guidelines" className="hover:text-slate-900 transition">Community Guidelines</Link>
          <Link href="/safety" className="hover:text-slate-900 transition">Safety Guidelines</Link>
          <Link href="/refund" className="hover:text-slate-900 transition">Refund Policy</Link>
          <Link href="/contact" className="hover:text-slate-900 transition">Contact Desk</Link>
          <Link href="/report-abuse" className="text-rose-600 hover:text-rose-700 transition">Report Abuse</Link>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400 gap-2">
        <p>© 2026 Matrimony OS. Built for meaningful connections and family trust.</p>
        <p className="font-semibold text-slate-600">Copyrights Flugelsoft Labs. All rights reserved.</p>
      </div>
    </footer>
  );
}
