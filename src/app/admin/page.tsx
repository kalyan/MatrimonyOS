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
} from 'lucide-react';
import { MockRepository } from '@/lib/mock/mock-repository';
import { Profile, ReportItem, Community } from '@/lib/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'communities'>('overview');
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

  const loadData = () => {
    setStats(MockRepository.getAdminStats());
    setProfiles(MockRepository.getProfiles());
    setReports(MockRepository.getReports());
    setCommunities(MockRepository.getCommunities());
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Matrimony OS Administrator</h1>
              <span className="text-[10px] uppercase font-bold bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                Governance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform governance, moderation queue, and user trust verification
            </p>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
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
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
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
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'communities'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Communities ({communities.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
              <div className="text-[10px] text-slate-500 font-medium">Total Users</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-600">{stats.verifiedUsers}</div>
              <div className="text-[10px] text-slate-500 font-medium">Verified 18+</div>
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
              <div className="text-2xl font-bold text-amber-600">{stats.mutualConnections}</div>
              <div className="text-[10px] text-slate-500 font-medium">Mutual Connections</div>
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
                  <span>Expressed Interest</span>
                  <span className="font-bold">64%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Mutual Connection Established</span>
                  <span className="font-bold">42%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Safety & Compliance Health</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% of accounts have verified 18+ declaration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero unapproved public contact scraping incidents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All profiles carry `noindex` search privacy headers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY */}
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
                  <th className="pb-3 px-2">Completeness</th>
                  <th className="pb-3 px-2">Verified</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((p) => (
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
                    <td className="py-3 px-2 font-bold text-slate-800">{p.completeness_score}%</td>
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
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleToggleVerify(p.id)}
                        className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded bg-purple-50"
                      >
                        {p.is_verified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS QUEUE */}
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
                    {rep.reason.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Report against {rep.reported?.first_name || 'Member'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      rep.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">&quot;{rep.details}&quot;</p>
              </div>

              {rep.status === 'open' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleResolveReport(rep.id, 'dismissed')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'resolved')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Take Action & Resolve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: COMMUNITIES */}
      {activeTab === 'communities' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-6">
          <form onSubmit={handleAddCommunity} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add regional community (e.g. Marwari, Sindhi, Konkani)..."
              value={newCommName}
              onChange={(e) => setNewCommName(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Community</span>
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {communities.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
              >
                <span className="font-bold text-slate-800">{c.name}</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
