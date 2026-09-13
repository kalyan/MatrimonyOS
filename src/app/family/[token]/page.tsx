import React from 'react';
import FamilyPortalClient from './FamilyPortalClient';
export function generateStaticParams() {
  return [{ token: 'portal' }];
}

export default function FamilyPage() {
  return <FamilyPortalClient />;
}
