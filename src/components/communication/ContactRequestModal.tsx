'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Check, MessageSquare, PhoneCall } from 'lucide-react';
import { Profile, Connection } from '@/lib/types';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

interface Props {
  targetProfile: Profile;
  connection: Connection;
  currentProfile: Profile;
  onApproveShare: () => void;
  onClose: () => void;
}

export default function ContactRequestModal({
  targetProfile,
  connection,
  currentProfile,
  onApproveShare,
  onClose,
}: Props) {
  const isProfileA = connection.profile_a_id === currentProfile.id;
  const iHaveShared = isProfileA ? connection.contact_shared_by_a : connection.contact_shared_by_b;
  const otherHasShared = isProfileA ? connection.contact_shared_by_b : connection.contact_shared_by_a;
  const bothShared = iHaveShared && otherHasShared;

  // Mock phone number for demo
  const targetPhone = '+919876543210';

  const handleOpenWhatsApp = () => {
    const url = WhatsAppService.createDirectWhatsAppChatUrl(
      targetPhone,
      targetProfile.first_name,
      currentProfile.first_name
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner mb-3">
            {bothShared ? <PhoneCall className="w-7 h-7" /> : <Lock className="w-7 h-7 text-emerald-600" />}
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {bothShared ? 'Mutual Contact Access Granted' : 'Mutual Consent Contact Sharing'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Matrimony OS protects contact details by default. Phone numbers & WhatsApp links require mutual consent from both individuals.
          </p>
        </div>

        {/* Status Stepper */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Your Contact Sharing Consent:</span>
            {iHaveShared ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Granted</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Pending Approval</span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{targetProfile.first_name}&apos;s Consent:</span>
            {otherHasShared ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Granted</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">Awaiting Approval</span>
            )}
          </div>
        </div>

        {/* Unlocked WhatsApp Direct CTA */}
        {bothShared ? (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] text-emerald-700 font-medium">Verified Phone / WhatsApp Number:</span>
              <div className="text-base font-bold text-emerald-950 tracking-wider mt-0.5">{targetPhone}</div>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3 rounded-xl bg-wa-green hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Start WhatsApp Conversation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {!iHaveShared ? (
              <button
                onClick={onApproveShare}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/20"
              >
                Approve & Share My Contact Details
              </button>
            ) : (
              <div className="text-center py-2 text-xs text-slate-500">
                You have shared your contact details. We will notify you once {targetProfile.first_name} also consents.
              </div>
            )}
          </div>
        )}

        <div className="mt-5 text-center text-[10px] text-slate-400">
          Consent can be revoked at any time in your Privacy & Safety Center.
        </div>
      </div>
    </div>
  );
}
