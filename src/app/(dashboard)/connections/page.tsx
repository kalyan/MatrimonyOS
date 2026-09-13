'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ShieldCheck,
  Lock,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { Connection, Profile } from '@/lib/types';
import ContactRequestModal from '@/components/communication/ContactRequestModal';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export default function ConnectionsPage() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeChatConn, setActiveChatConn] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<{ [connId: string]: string[] }>({
    'conn-1': [
      'Namaste Rohan, pleased to connect with you on Matrimony OS.',
      'Namaste Priya! Thank you for accepting my interest. I admire your work in product management.',
    ],
  });
  const [inputMessage, setInputMessage] = useState('');

  const loadConnections = () => {
    if (!profile) return;
    const conns = MockRepository.getConnectionsForProfile(profile.id);
    setConnections(conns);
  };

  useEffect(() => {
    loadConnections();
  }, [profile]);

  if (!profile) return null;

  const handleApproveShare = (connectionId: string) => {
    MockRepository.shareContactInConnection(connectionId, profile.id);
    loadConnections();
    // Update local modal state if open
    if (selectedConnection && selectedConnection.id === connectionId) {
      const refreshed = MockRepository.getConnectionsForProfile(profile.id).find(
        (c) => c.id === connectionId
      );
      if (refreshed) setSelectedConnection(refreshed);
    }
  };

  const handleSendMessage = (connId: string) => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [connId]: [...(prev[connId] || []), inputMessage.trim()],
    }));
    setInputMessage('');
  };

  const icebreakerPrompts = [
    'What values or traditions are most meaningful to you and your family?',
    'How do you like to balance demanding career commitments with family time?',
    'What does an ideal weekend look like for you?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Mutual Connections</h1>
        <p className="text-xs text-slate-500">
          Profiles where both parties mutually expressed interest. Engage through structured prompts or request contact details.
        </p>
      </div>

      {connections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connection List Sidebar */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Connections ({connections.length})
            </span>
            {connections.map((conn) => {
              const other = conn.other_profile;
              if (!other) return null;
              const isSelected = activeChatConn?.id === conn.id;
              const isProfileA = conn.profile_a_id === profile.id;
              const bothShared = conn.contact_shared_by_a && conn.contact_shared_by_b;

              return (
                <div
                  key={conn.id}
                  onClick={() => setActiveChatConn(conn)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        other.primary_photo_url ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={other.first_name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-100"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {other.first_name} {other.last_name}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{other.profession}</div>
                      {bothShared && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Contacts Shared
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Connection & Communication Panel */}
          <div className="md:col-span-2">
            {activeChatConn && activeChatConn.other_profile ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden flex flex-col h-[520px]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeChatConn.other_profile.primary_photo_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                    <div>
                      <Link
                        href={`/profile/${activeChatConn.other_profile.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-brand-600 transition"
                      >
                        {activeChatConn.other_profile.first_name} {activeChatConn.other_profile.last_name}
                      </Link>
                      <div className="text-[11px] text-slate-500">
                        {activeChatConn.other_profile.city} • Mutual Connection
                      </div>
                    </div>
                  </div>

                  {/* Contact Sharing Button */}
                  <button
                    onClick={() => setSelectedConnection(activeChatConn)}
                    className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>
                      {activeChatConn.contact_shared_by_a && activeChatConn.contact_shared_by_b
                        ? 'View WhatsApp / Phone'
                        : 'Contact Exchange'}
                    </span>
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF9F6]">
                  <div className="text-center py-1">
                    <span className="text-[10px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      Mutual Connection Established • Controlled Matrimonial Interaction
                    </span>
                  </div>

                  {(messages[activeChatConn.id] || []).map((msg, idx) => {
                    const isMe = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs text-xs p-3 rounded-2xl ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {msg}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Icebreaker Prompts Picker */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex-shrink-0">
                    Icebreakers:
                  </span>
                  {icebreakerPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(prompt)}
                      className="text-[10px] bg-rose-50 text-brand-700 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 flex-shrink-0 whitespace-nowrap"
                    >
                      {prompt.slice(0, 35)}...
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a respectful message or choose an icebreaker..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(activeChatConn.id)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={() => handleSendMessage(activeChatConn.id)}
                    className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center h-[520px] flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select a Connection to Chat</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Choose any mutual connection from the left to start a conversation or request contact details.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Mutual Connections Yet</h3>
          <p className="text-xs text-slate-500">
            Once an interest is accepted by both you and another member, your mutual connection will appear here.
          </p>
          <Link
            href="/discover"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
          >
            Discover Candidates
          </Link>
        </div>
      )}

      {/* Contact Sharing Request Modal */}
      {selectedConnection && selectedConnection.other_profile && (
        <ContactRequestModal
          targetProfile={selectedConnection.other_profile}
          connection={selectedConnection}
          currentProfile={profile}
          onApproveShare={() => handleApproveShare(selectedConnection.id)}
          onClose={() => setSelectedConnection(null)}
        />
      )}
    </div>
  );
}
