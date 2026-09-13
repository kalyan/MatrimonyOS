'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, loginAsDemo, user } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (mode === 'signin') {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      if (email.toLowerCase() === 'kalyanjit@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } else {
      const res = await signUpWithEmail(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
        return;
      }
      setSuccessMessage(
        'Account registered successfully! Please proceed to complete your profile details. Administrator activation is required before profile is published.'
      );
      setTimeout(() => {
        router.push('/onboarding');
      }, 2000);
    }
  };

  const handleAdminQuickFill = () => {
    setEmail('kalyanjit@gmail.com');
    setPassword('AdminPassword2026!');
    setMode('signin');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'signin' ? 'Sign in to Matrimony OS' : 'Create Your Account'}
        </h1>
        <p className="text-xs text-slate-500">
          Privacy-first matrimonial platform with verified profiles and family collaboration.
        </p>
      </div>

      {/* Supabase Status Indicator */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">Supabase Authentication</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
          {isSupabaseConfigured ? 'Live Backend Connected' : 'Demo Hybrid Mode'}
        </span>
      </div>

      {/* Sign In / Sign Up Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Fill Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleAdminQuickFill}
            className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Fill Admin (kalyanjit@gmail.com)</span>
          </button>
        </div>

        {/* Informational Policy Notice */}
        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">🔒 Admin Verification Policy:</p>
          <p>
            To protect user trust and family safety, all registered profiles must be reviewed and activated by our platform administrator before appearing in candidate matching feeds.
          </p>
        </div>
      </div>

      {/* Alternative Quick Demo Switcher */}
      <div className="text-center space-y-2 text-xs text-slate-500">
        <p>Looking to test drive without typing?</p>
        <button
          onClick={() => {
            loginAsDemo('prof-1', 'member');
            router.push('/home');
          }}
          className="text-brand-600 font-bold hover:underline"
        >
          Instant Guest Demo Mode
        </button>
      </div>
    </div>
  );
}
