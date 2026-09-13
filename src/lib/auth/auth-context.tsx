'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { MockRepository } from '../mock/mock-repository';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  loginAsDemo: (profileId: string, role?: UserRole) => void;
  logout: () => void;
  refreshProfile: () => void;
  updateCurrentProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = () => {
    try {
      const currentUserId = MockRepository.getCurrentUserId();
      const userProfile = MockRepository.getProfileByUserId(currentUserId) || MockRepository.getProfiles()[0];

      if (userProfile) {
        setUser({
          id: userProfile.user_id,
          email: `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`,
          role: 'member',
        });
        setProfile(userProfile);
      }
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const loginAsDemo = (profileId: string, role: UserRole = 'member') => {
    const targetProfile = MockRepository.getProfileById(profileId);
    if (targetProfile) {
      MockRepository.setCurrentUserId(targetProfile.user_id);
      setUser({
        id: targetProfile.user_id,
        email: `${targetProfile.first_name.toLowerCase()}@example.com`,
        role,
      });
      setProfile(targetProfile);
    } else if (role === 'admin') {
      // Special admin user
      MockRepository.setCurrentUserId('admin-user');
      setUser({
        id: 'admin-user',
        email: 'admin@matrimonyos.internal',
        role: 'admin',
      });
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => {
    if (profile) {
      const refreshed = MockRepository.getProfileById(profile.id);
      if (refreshed) setProfile(refreshed);
    }
  };

  const updateCurrentProfile = (updates: Partial<Profile>) => {
    if (!profile) return;
    const updated = MockRepository.updateProfile(profile.id, updates);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        loginAsDemo,
        logout,
        refreshProfile,
        updateCurrentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
