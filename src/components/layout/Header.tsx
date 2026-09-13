'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Heart, Users, Shield, User, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import DemoSwitcherModal from '../common/DemoSwitcherModal';

export default function Header() {
  const { profile, user } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/home" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">Matrimony<span className="text-brand-600">OS</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Find Meaningful Connections</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link href="/discover" className="hover:text-brand-600 transition-colors">Discover</Link>
            <Link href="/interests" className="hover:text-brand-600 transition-colors">Interests</Link>
            <Link href="/connections" className="hover:text-brand-600 transition-colors">Connections</Link>
            <Link href="/family" className="flex items-center space-x-1 hover:text-brand-600 transition-colors">
              <span>Family Mode</span>
              <span className="text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.2 rounded-full font-semibold border border-brand-200">New</span>
            </Link>
            <Link href="/pricing" className="hover:text-brand-600 transition-colors">Plans</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-purple-600 font-semibold flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar: Demo Account Switcher & Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Switcher Pill */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-300"
              title="Switch demo user or role"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Demo:</span>
              <span className="truncate max-w-[90px] font-bold text-slate-900">
                {user?.role === 'admin' ? 'Admin' : profile?.first_name || 'Guest'}
              </span>
            </button>

            {/* Profile Avatar / Quick Link */}
            {profile && (
              <Link
                href={`/profile/${profile.id}`}
                className="w-9 h-9 rounded-full ring-2 ring-brand-500/30 overflow-hidden bg-slate-200 flex-shrink-0"
              >
                {profile.primary_photo_url ? (
                  <img
                    src={profile.primary_photo_url}
                    alt={profile.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-100 text-brand-700 font-bold text-sm">
                    {profile.first_name[0]}
                  </div>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm font-medium">
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Discover Matches
            </Link>
            <Link
              href="/interests"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Interests & Requests
            </Link>
            <Link
              href="/connections"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Mutual Connections
            </Link>
            <Link
              href="/family"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Family Collaboration Hub
            </Link>
            <Link
              href="/privacy-center"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Privacy & Safety Center
            </Link>
            <Link
              href="/referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Invite & Referrals
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-purple-600 font-semibold"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Demo Account Switcher Modal */}
      {showDemoModal && (
        <DemoSwitcherModal onClose={() => setShowDemoModal(false)} />
      )}
    </>
  );
}
