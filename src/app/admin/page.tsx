'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Search,
  Check,
  Plus,
  BarChart3,
  Sparkles,
  ShieldAlert,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { MockRepository } from '@/lib/mock/mock-repository';
import { Profile, ReportItem, Community } from '@/lib/types';
import { useAuth } from '@/lib/auth/auth-context';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'users' | 'reports' | 'communities'>('pending');
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    averageCompleteness: 0,
    interestsSent: 0,
    mutualConnections: 0,
    openReports: 0,
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCommName, setNewCommName] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const loadData = () => {
    setStats(MockRepository.getAdminStats());
    setProfiles(MockRepository.getProfiles());
    setReports(MockRepository.getReports());
    setCommunities(MockRepository.getCommunities());
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingProfiles = profiles.filter(
    (p) => p.is_active === false || p.account_status === 'pending_approval'
  );

  const handleActivateProfile = (profileId: string, name: string) => {
    MockRepository.activateProfile(profileId);
    loadData();
    setActionSuccessMessage(`Profile for ${name} has been approved & activated! It is now published in matching discovery.`);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleDeactivateProfile = (profileId: string, name: string) => {
    MockRepository.deactivateProfile(profileId);
    loadData();
    setActionSuccessMessage(`Profile for ${name} has been deactivated.`);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleToggleVerify = (profileId: string) => {
    const p = MockRepository.getProfileById(profileId);
    if (p) {
      MockRepository.updateProfile(profileId, { is_verified: !p.is_verified });
      loadData();
    }
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    MockRepository.updateReportStatus(reportId, status, 'Resolved by admin moderator');
    loadData();
  };

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) return;
    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: newCommName.trim(),
      code: newCommName.toLowerCase().replace(/\s+/g, '-'),
      is_active: true,
    };
    setCommunities((prev) => [...prev, newComm]);
    setNewCommName('');
  };

  // Helper to add a demo pending registration if empty
  const handleSimulateNewRegistration = () => {
    const fakeId = `prof-pending-${Date.now()}`;
    const newPending: Profile = {
      id: fakeId,
      user_id: `user-${Date.now()}`,
      first_name: 'Aniket',
      last_name: 'Roy',
      gender: 'male',
      date_of_birth: '1995-07-14',
      age: 31,
      height_cm: 178,
      marital_status: 'never_married',
      mother_tongue: 'Bengali',
      languages_spoken: ['Bengali', 'English', 'Hindi'],
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      citizenship: 'Indian',
      willing_to_relocate: true,
      highest_education: 'MBA & B.Tech',
      education_field: 'Operations Management',
      institution: 'IIM Calcutta',
      profession: 'Senior Supply Chain Director',
      industry: 'Logistics',
      employment_type: 'full_time',
      annual_income_range: '₹30 - ₹45 Lakhs',
      dietary_habits: 'non_vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
      interests: ['Photography', 'World Cinema', 'Swimming'],
      hobbies: ['Documentary filmmaking', 'Travel blogging'],
      family_values: 'moderate',
      about_me: 'Grounded professional passionate about operational excellence and creative arts. Looking for an educated, caring companion.',
      completeness_score: 92,
      profile_visibility: 'registered',
      photo_visibility: 'registered',
      contact_visibility: 'mutual_consent',
      is_verified: false,
      is_active: false,
      account_status: 'pending_approval',
      created_by_relation: 'self',
      primary_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = MockRepository.getProfiles();
    current.unshift(newPending);
    if (typeof window !== 'undefined') {
      localStorage.setItem('matrimony_os_profiles', JSON.stringify(current));
    }
    loadData();
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Matrimony OS Administrator</h1>
              <span className="text-[10px] uppercase font-bold bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                Master Governance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin Session: <span className="text-emerald-400 font-semibold">{user?.email || 'kalyanjit@gmail.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/home"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Candidate View
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
          >
            Auth Portal
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMessage && (
        <div className="flex items-center space-x-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'pending'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending Approvals</span>
          <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            pendingProfiles.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
          }`}>
            {pendingProfiles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Metrics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Users ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'reports'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reports Queue ({reports.filter((r) => r.status === 'open').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'communities'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Communities ({communities.length})</span>
        </button>
      </div>

      {/* TAB: PENDING ACTIVATIONS (PRIMARY WORKFLOW) */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
            <div>
              <h2 className="text-sm font-bold text-purple-950">Registration Verification Queue</h2>
              <p className="text-xs text-purple-800">
                Profiles registered by users require active administrator approval before they can appear in discovery and connect with candidates.
              </p>
            </div>
            <button
              onClick={handleSimulateNewRegistration}
              className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition self-start sm:self-auto flex items-center space-x-1 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate New Registrant</span>
            </button>
          </div>

          {pendingProfiles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All User Profiles are Activated</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No new profile submissions are currently awaiting approval. When new users complete onboarding, they will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={p.primary_photo_url}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Pending Approval
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {p.age} yrs • {p.gender}
                        </span>
                      </div>

                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">{p.profession}</span> • {p.highest_education}
                      </div>

                      <div className="text-slate-500">
                        {p.city}, {p.state} • Community: <span className="font-medium text-slate-700">{p.community_name || 'General'}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 max-w-xl italic mt-1">
                        &quot;{p.about_me}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions for Admin */}
                  <div className="flex items-center space-x-2 md:self-center self-end flex-shrink-0">
                    <Link
                      href={`/profile/${p.id}`}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center space-x-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>

                    <button
                      onClick={() => handleDeactivateProfile(p.id, `${p.first_name} ${p.last_name}`)}
                      className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleActivateProfile(p.id, `${p.first_name} ${p.last_name}`)}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Activate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
              <div className="text-[10px] text-slate-500 font-medium">Total Users</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-amber-600">{pendingProfiles.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Pending Review</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-600">{stats.verifiedUsers}</div>
              <div className="text-[10px] text-slate-500 font-medium">Verified Active</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-brand-600">{stats.averageCompleteness}%</div>
              <div className="text-[10px] text-slate-500 font-medium">Avg Completeness</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-indigo-600">{stats.interestsSent}</div>
              <div className="text-[10px] text-slate-500 font-medium">Interests Sent</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-rose-600">{stats.openReports}</div>
              <div className="text-[10px] text-slate-500 font-medium">Open Reports</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Conversion Funnel</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Registered Users</span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: '100%' }} />
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Profile Completion (&gt;80%)</span>
                  <span className="font-bold">88%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full" style={{ width: '88%' }} />
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Administrator Activated</span>
                  <span className="font-bold">{Math.round(((profiles.length - pendingProfiles.length) / Math.max(1, profiles.length)) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.round(((profiles.length - pendingProfiles.length) / Math.max(1, profiles.length)) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Safety & Governance Commitments</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Admin Review before candidate discovery publication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% of accounts carry verified 18+ declaration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero unapproved contact scraping or phone number leaks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter users by name, profession, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Location</th>
                  <th className="pb-3 px-2">Profession</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Verified</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((p) => {
                  const isPending = p.is_active === false || p.account_status === 'pending_approval';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={p.primary_photo_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">
                              {p.first_name} {p.last_name}
                            </div>
                            <div className="text-[10px] text-slate-400">{p.age} yrs • {p.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{p.city}, {p.state}</td>
                      <td className="py-3 px-2 text-slate-600">{p.profession}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isPending ? 'Pending Approval' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_verified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1.5">
                        {isPending ? (
                          <button
                            onClick={() => handleActivateProfile(p.id, `${p.first_name} ${p.last_name}`)}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1 rounded bg-emerald-50"
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeactivateProfile(p.id, `${p.first_name} ${p.last_name}`)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-rose-700 px-2 py-1 rounded bg-slate-100 hover:bg-rose-50"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleVerify(p.id)}
                          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded bg-purple-50"
                        >
                          {p.is_verified ? 'Revoke' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No registered user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: REPORTS QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {rep.reason.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Status: <span className="font-bold text-slate-700">{rep.status}</span>
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  Target Profile ID: {rep.reported_id}
                </div>
                <p className="text-xs text-slate-600 max-w-xl">{rep.details}</p>
              </div>

              {rep.status === 'open' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleResolveReport(rep.id, 'dismissed')}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'resolved')}
                    className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
                  >
                    Sanction & Resolve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB: COMMUNITIES */}
      {activeTab === 'communities' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-6">
          <form onSubmit={handleAddCommunity} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Add new regional/cultural community (e.g. Marwari, Sindhi)..."
              value={newCommName}
              onChange={(e) => setNewCommName(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300"
            />
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Community</span>
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {communities.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.region || 'All India'}</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
