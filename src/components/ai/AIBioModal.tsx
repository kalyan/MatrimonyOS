'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { AIService } from '@/lib/ai/ai-service';

interface Props {
  initialBio: string;
  name: string;
  profession?: string;
  city?: string;
  onApply: (newBio: string) => void;
  onClose: () => void;
}

export default function AIBioModal({
  initialBio,
  name,
  profession,
  city,
  onApply,
  onClose,
}: Props) {
  const [inputNotes, setInputNotes] = useState(initialBio);
  const [generatedBio, setGeneratedBio] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    setIsPolishing(true);
    try {
      const result = await AIService.polishBio({
        rawNotes: inputNotes,
        name,
        profession,
        city,
      });
      setGeneratedBio(result.bio);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-brand-600 mb-4">
          <Sparkles className="w-5 h-5 fill-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">AI Profile Bio Assistant</h2>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Provide rough notes, hobbies, or personality points. Our assistant will format them into a respectful, articulate matrimonial description without inventing facts.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Raw Thoughts & Background Points:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. software engineer in Bangalore, love weekend hikes, reading books, close family from Delhi, looking for someone open-minded..."
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <button
            onClick={handlePolish}
            disabled={isPolishing || !inputNotes.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {isPolishing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isPolishing ? 'Polishing Bio...' : 'Polish Profile Description'}</span>
          </button>

          {generatedBio && (
            <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-200 animate-fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-900 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  <span>Enhanced Bio Preview</span>
                </span>
                <span className="text-[10px] text-brand-700 font-medium bg-brand-100 px-2 py-0.5 rounded-full">
                  Respectful & Truthful
                </span>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {generatedBio}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onApply(generatedBio);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <span>Apply to My Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
