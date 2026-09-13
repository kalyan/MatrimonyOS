'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Heart, Users, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Home', href: '/home', icon: Compass },
    { label: 'Discover', href: '/discover', icon: Sparkles },
    { label: 'Interests', href: '/interests', icon: Heart },
    { label: 'Family', href: '/family', icon: Users },
    { label: 'Connections', href: '/connections', icon: MessageSquare },
    { label: 'Profile', href: profile ? `/profile/${profile.id}` : '/profile/edit', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
