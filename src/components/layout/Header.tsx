'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Heart, Users, Shield, User, Menu, X, Sparkles, MessageCircle, LogOut } from 'lucide-react';

export default function Header() {
  const { profile, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  Matrimony<span className="text-brand-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  18+ Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Find Meaningful Connections</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link href="/how-it-works" className="hover:text-brand-600 transition-colors font-semibold text-brand-700">
              How It Works
            </Link>
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

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition flex items-center space-x-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  profile && (
                    <Link
                      href={`/profile/${profile.id}`}
                      className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-brand-600 transition"
                    >
                      <div className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 overflow-hidden bg-slate-200 flex-shrink-0">
                        {profile.primary_photo_url ? (
                          <img
                            src={profile.primary_photo_url}
                            alt={profile.first_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-100 text-brand-700 font-bold text-xs">
                            {profile.first_name[0]}
                          </div>
                        )}
                      </div>
                      <span className="hidden sm:inline font-bold">{profile.first_name}</span>
                    </Link>
                  )
                )}

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                >
                  Register (18+)
                </Link>
              </div>
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
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-brand-600 font-bold"
            >
              How It Works & Information Flow
            </Link>
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
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Membership Plans
            </Link>
            <Link
              href="/privacy-center"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-brand-600"
            >
              Privacy & Safety Center
            </Link>
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-purple-600 font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 py-1"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-brand-600 py-1"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
