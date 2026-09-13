'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Filter, Search, SlidersHorizontal, RotateCcw, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import MatchCard from '@/components/matches/MatchCard';
import FilterModal, { FilterState } from '@/components/matches/FilterModal';
import { Profile, MatchScoreResult } from '@/lib/types';

export default function DiscoverPage() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<{ profile: Profile; score: MatchScoreResult }[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    minAge: 21,
    maxAge: 40,
    city: '',
    education: '',
    community: '',
    dietary: '',
    verifiedOnly: false,
  });

  useEffect(() => {
    if (profile) {
      const recs = MockRepository.getRecommendations(profile.id);
      setRecommendations(recs);

      const interests = MockRepository.getInterestsForProfile(profile.id);
      setSentInterestIds(interests.sent.map((i) => i.receiver_id));
    } else {
      // Guest visitor: show all active verified candidates
      const activeProfiles = MockRepository.getProfiles().filter(
        (p) => p.is_active !== false && p.account_status !== 'pending_approval' && p.account_status !== 'banned'
      );
      setRecommendations(
        activeProfiles.map((p) => ({
          profile: p,
          score: {
            candidateId: p.id,
            overallScore: 85,
            factors: {
              ageScore: 12,
              locationScore: 12,
              educationScore: 12,
              professionScore: 12,
              languageScore: 12,
              lifestyleScore: 8,
              interestsScore: 12,
            },
            strongAlignment: ['Verified matrimonial member'],
            thingsToDiscuss: ['Connect to discuss lifestyle and partner preferences'],
          },
        }))
      );
      setSentInterestIds([]);
    }
  }, [profile]);

  const handleSendInterest = (candidateId: string) => {
    if (!profile) {
      window.location.href = '/login';
      return;
    }
    MockRepository.sendInterest(profile.id, candidateId);
    setSentInterestIds((prev) => [...prev, candidateId]);
  };

  // Filter and Search logic
  const filteredMatches = recommendations.filter(({ profile: candidate }) => {
    const candAge = candidate.age || 28;
    if (candAge < filters.minAge || candAge > filters.maxAge) return false;
    if (filters.city && candidate.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.dietary && candidate.dietary_habits !== filters.dietary) return false;
    if (filters.community && candidate.community_name !== filters.community) return false;
    if (filters.verifiedOnly && !candidate.is_verified) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(q);
      const matchProf = candidate.profession.toLowerCase().includes(q);
      const matchEdu = candidate.highest_education.toLowerCase().includes(q);
      const matchCity = candidate.city.toLowerCase().includes(q);
      if (!matchName && !matchProf && !matchEdu && !matchCity) return false;
    }

    return true;
  });

  const hasActiveFilters =
    filters.city || filters.community || filters.dietary || filters.verifiedOnly || filters.minAge > 21 || filters.maxAge < 40;

  return (
    <div className="space-y-6 pb-12">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, profession, education, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
              hasActiveFilters
                ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Active:</span>
            {filters.city && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                City: {filters.city}
              </span>
            )}
            {filters.community && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Community: {filters.community}
              </span>
            )}
            {filters.dietary && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Diet: {filters.dietary}
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Verified Only
              </span>
            )}
            <button
              onClick={() =>
                setFilters({
                  minAge: 21,
                  maxAge: 40,
                  city: '',
                  education: '',
                  community: '',
                  dietary: '',
                  verifiedOnly: false,
                })
              }
              className="text-rose-600 font-semibold hover:underline ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Discover Matches</h1>
          <p className="text-xs text-slate-500">
            Showing {filteredMatches.length} profiles sorted by explainable compatibility
          </p>
        </div>
      </div>

      {/* Matches Grid or Empty State */}
      {recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-brand-600 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Candidates Registered Yet</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Be among the first verified matrimonial candidates on Matrimony OS. Complete your profile to get discovered by compatible families.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <Link
              href="/onboarding"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
            >
              Register Candidate Profile
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              How It Works
            </Link>
          </div>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map(({ profile: candidate, score }) => (
            <MatchCard
              key={candidate.id}
              candidate={candidate}
              scoreResult={score}
              onSendInterest={handleSendInterest}
              isInterestSent={sentInterestIds.includes(candidate.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-soft max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Profiles Match These Filters</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your age boundaries, widening your city preferences, or clearing filters to see more profiles.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                minAge: 21,
                maxAge: 40,
                city: '',
                education: '',
                community: '',
                dietary: '',
                verifiedOnly: false,
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          initialFilters={filters}
          onApply={(newFilters) => setFilters(newFilters)}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}
