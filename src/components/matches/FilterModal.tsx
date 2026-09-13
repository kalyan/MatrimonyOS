'use client';

import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { SEED_COMMUNITIES } from '@/lib/mock/seed-data';

export interface FilterState {
  minAge: number;
  maxAge: number;
  city: string;
  education: string;
  community: string;
  dietary: string;
  verifiedOnly: boolean;
}

interface Props {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export default function FilterModal({ initialFilters, onApply, onClose }: Props) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleReset = () => {
    const defaultFilters: FilterState = {
      minAge: 21,
      maxAge: 40,
      city: '',
      education: '',
      community: '',
      dietary: '',
      verifiedOnly: false,
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Filter Matches</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Age Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Age Range: <span className="text-brand-600 font-bold">{filters.minAge} – {filters.maxAge} years</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Min Age</span>
                <input
                  type="number"
                  min={18}
                  max={filters.maxAge}
                  value={filters.minAge}
                  onChange={(e) => setFilters({ ...filters, minAge: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max Age</span>
                <input
                  type="number"
                  min={filters.minAge}
                  max={60}
                  value={filters.maxAge}
                  onChange={(e) => setFilters({ ...filters, maxAge: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Location</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Cities (India & Abroad)</option>
              <option value="Bengaluru">Bengaluru, Karnataka</option>
              <option value="Guwahati">Guwahati, Assam</option>
              <option value="Kolkata">Kolkata, West Bengal</option>
              <option value="Pune">Pune, Maharashtra</option>
              <option value="Chennai">Chennai, Tamil Nadu</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
              <option value="Chandigarh">Chandigarh, Punjab</option>
              <option value="Kochi">Kochi, Kerala</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Delhi">Delhi NCR</option>
            </select>
          </div>

          {/* Community */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Community / Language</label>
            <select
              value={filters.community}
              onChange={(e) => setFilters({ ...filters, community: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Communities</option>
              {SEED_COMMUNITIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Dietary Habits */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dietary Habit</label>
            <select
              value={filters.dietary}
              onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="jain">Jain</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Verified Profiles Only</span>
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition shadow-md shadow-brand-500/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
