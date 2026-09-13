'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { MockRepository } from '../mock/mock-repository';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isPendingApproval: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: string; user?: any }>;
  signInWithOtp: (email: string) => Promise<{ error?: string }>;
  loginAsDemo: (profileId: string, role?: UserRole) => void;
  logout: () => Promise<void>;
  refreshProfile: () => void;
  updateCurrentProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPendingApproval = Boolean(
    user && user.role !== 'admin' && profile && (profile.is_active === false || profile.account_status === 'pending_approval')
  );

  const resolveUserRole = (email?: string, metaRole?: string): UserRole => {
    if (!email) return 'member';
    if (email.toLowerCase() === 'kalyanjit@gmail.com' || metaRole === 'admin') {
      return 'admin';
    }
    if (metaRole === 'moderator') return 'moderator';
    return 'member';
  };

  const loadSession = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const authUser = session.user;
          const role = resolveUserRole(authUser.email, authUser.user_metadata?.role);

          const existingProfile =
            MockRepository.getProfileByUserId(authUser.id) ||
            MockRepository.getProfiles().find((p) => p.user_id === authUser.id);

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role,
          });

          if (existingProfile) {
            setProfile(existingProfile);
          } else if (role === 'admin') {
            setProfile(null);
          }
          setIsLoading(false);
          return;
        }
      }

      // Fallback to local session
      const currentUserId = MockRepository.getCurrentUserId();
      if (currentUserId === 'admin-kalyan') {
        setUser({
          id: 'admin-kalyan',
          email: 'kalyanjit@gmail.com',
          role: 'admin',
        });
        setProfile(null);
      } else {
        const userProfile = MockRepository.getProfileByUserId(currentUserId) || MockRepository.getProfiles()[0];
        if (userProfile) {
          setUser({
            id: userProfile.user_id,
            email: `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`,
            role: 'member',
          });
          setProfile(userProfile);
        }
      }
    } catch (err) {
      console.error('Error loading auth session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const authUser = session.user;
          const role = resolveUserRole(authUser.email, authUser.user_metadata?.role);
          const existingProfile = MockRepository.getProfileByUserId(authUser.id);

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role,
          });

          if (existingProfile) {
            setProfile(existingProfile);
          }
        } else {
          // If session was cleared
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        const role = resolveUserRole(data.user?.email, data.user?.user_metadata?.role);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role,
        });

        const userProfile = MockRepository.getProfileByUserId(data.user.id);
        if (userProfile) setProfile(userProfile);

        setIsLoading(false);
        return {};
      } else {
        // Local simulation if Supabase is unavailable
        if (email.toLowerCase() === 'kalyanjit@gmail.com') {
          loginAsDemo('', 'admin');
          setIsLoading(false);
          return {};
        }
        loginAsDemo('prof-1', 'member');
        setIsLoading(false);
        return {};
      }
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Authentication error occurred.' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              ...metadata,
              role: resolveUserRole(email, metadata.role),
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const role = resolveUserRole(data.user.email, data.user.user_metadata?.role);
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            role,
          });
        }

        setIsLoading(false);
        return { user: data.user };
      } else {
        // Local simulation
        const fakeUserId = `user-${Date.now()}`;
        setUser({
          id: fakeUserId,
          email: email.trim(),
          role: resolveUserRole(email, metadata.role),
        });
        setIsLoading(false);
        return {};
      }
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Signup failed.' };
    }
  };

  const signInWithOtp = async (email: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
        if (error) return { error: error.message };
        return {};
      }
      return { error: 'OTP is supported when live Supabase is active.' };
    } catch (err: any) {
      return { error: err.message || 'Failed to send OTP.' };
    }
  };

  const loginAsDemo = (profileId: string, role: UserRole = 'member') => {
    if (role === 'admin' || profileId === 'admin') {
      MockRepository.setCurrentUserId('admin-kalyan');
      setUser({
        id: 'admin-kalyan',
        email: 'kalyanjit@gmail.com',
        role: 'admin',
      });
      setProfile(null);
      return;
    }

    const targetProfile = MockRepository.getProfileById(profileId);
    if (targetProfile) {
      MockRepository.setCurrentUserId(targetProfile.user_id);
      setUser({
        id: targetProfile.user_id,
        email: `${targetProfile.first_name.toLowerCase()}@example.com`,
        role,
      });
      setProfile(targetProfile);
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
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
        isPendingApproval,
        signInWithEmail,
        signUpWithEmail,
        signInWithOtp,
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
