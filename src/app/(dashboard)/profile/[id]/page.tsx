import React from 'react';
import ProfileDetailClient from './ProfileDetailClient';
import { SEED_PROFILES } from '@/lib/mock/seed-data';

export function generateStaticParams() {
  return SEED_PROFILES.map((p) => ({
    id: p.id,
  }));
}

export default function ProfilePage() {
  return <ProfileDetailClient />;
}
