'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Check, X, ArrowRight, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { Interest } from '@/lib/types';

export default function InterestsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [received, setReceived] = useState<Interest[]>([]);
  const [sent, setSent] = useState<Interest[]>([]);

  const loadInterests = () => {
    if (!profile) return;
    const data = MockRepository.getInterestsForProfile(profile.id);
    setReceived(data.received);
    setSent(data.sent);
  };

  useEffect(() => {
    loadInterests();
  }, [profile]);

  if (!profile) return null;

  const handleRespond = (interestId: string, status: 'accepted' | 'declined') => {
    MockRepository.respondToInterest(interestId, status);
    if (status === 'accepted') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
    loadInterests();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Interests & Requests</h1>
        <p className="text-xs text-slate-500">
          Consent-driven connection requests. Accept interest to unlock mutual communication.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'received'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Received Interests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-brand-700 text-[10px]">
            {received.filter((i) => i.status === 'pending').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'sent'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Sent Interests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
            {sent.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Received */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {received.length > 0 ? (
            received.map((item) => {
              const sender = item.sender;
              if (!sender) return null;
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        sender.primary_photo_url ||
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={sender.first_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/profile/${sender.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-brand-600 transition"
                        >
                          {sender.first_name} {sender.last_name}
                        </Link>
                        <span className="text-xs text-slate-400">
                          ({sender.age} yrs, {sender.city})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {sender.profession} • {sender.highest_education}
                      </div>
                      {item.custom_message && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          &quot;{item.custom_message}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleRespond(item.id, 'declined')}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespond(item.id, 'accepted')}
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm shadow-brand-500/25 flex items-center space-x-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Interest</span>
                        </button>
                      </>
                    ) : item.status === 'accepted' ? (
                      <Link
                        href="/connections"
                        className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected (View)</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Declined</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-600 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Received Interests Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your profile is active. As new matches review your background, their interest invitations will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sent */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sent.length > 0 ? (
            sent.map((item) => {
              const receiver = item.receiver;
              if (!receiver) return null;
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        receiver.primary_photo_url ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={receiver.first_name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <Link
                        href={`/profile/${receiver.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-brand-600 transition"
                      >
                        {receiver.first_name} {receiver.last_name}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {receiver.city} • {receiver.profession}
                      </div>
                    </div>
                  </div>

                  <div>
                    {item.status === 'accepted' ? (
                      <Link
                        href="/connections"
                        className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold"
                      >
                        Accepted! View Connection
                      </Link>
                    ) : item.status === 'pending' ? (
                      <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Awaiting Response</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Declined</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-3">
              <h3 className="font-bold text-slate-900 text-base">No Sent Interests</h3>
              <p className="text-xs text-slate-500">
                Explore recommended matches in Discover and express interest in profiles that align with your values.
              </p>
              <Link
                href="/discover"
                className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Discover Matches
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
