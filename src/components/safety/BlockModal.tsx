'use client';

import React from 'react';
import { X, Ban, Shield } from 'lucide-react';
import { Profile } from '@/lib/types';
import { MockRepository } from '@/lib/mock/mock-repository';

interface Props {
  targetProfile: Profile;
  currentProfileId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function BlockModal({ targetProfile, currentProfileId, onSuccess, onClose }: Props) {
  const handleConfirmBlock = () => {
    MockRepository.blockProfile(currentProfileId, targetProfile.id);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner mb-3">
          <Ban className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          Block {targetProfile.first_name}?
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {targetProfile.first_name} will no longer be able to view your profile, send interests, or interact with you. Existing connections will be disconnected.
        </p>

        <div className="pt-5 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBlock}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20"
          >
            Block User
          </button>
        </div>
      </div>
    </div>
  );
}
