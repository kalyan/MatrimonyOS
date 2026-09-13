import React from 'react';
import FamilyPortalClient from './FamilyPortalClient';
import { SEED_FAMILY_MEMBERS } from '@/lib/mock/seed-data';

export function generateStaticParams() {
  return [
    ...SEED_FAMILY_MEMBERS.map((m) => ({ token: m.invite_token })),
    { token: 'demo' },
  ];
}

export default function FamilyPage() {
  return <FamilyPortalClient />;
}
