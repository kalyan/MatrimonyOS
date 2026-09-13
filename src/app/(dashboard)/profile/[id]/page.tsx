import React from 'react';
import ProfileDetailClient from './ProfileDetailClient';
export function generateStaticParams() {
  return [{ id: 'preview' }];
}

export default function ProfilePage() {
  return <ProfileDetailClient />;
}
