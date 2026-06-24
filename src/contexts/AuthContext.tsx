import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, RecruiterProfile, JobSeekerProfile, UserRole, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  createRecruiterProfile: (data: Partial<RecruiterProfile>) => Promise<void>;
  updateRecruiterProfile: (data: Partial<RecruiterProfile>) => Promise<void>;
  createJobSeekerProfile: (data: Partial<JobSeekerProfile>) => Promise<void>;
  updateJobSeekerProfile: (data: Partial<JobSeekerProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    recruiterProfile: null,
    jobSeekerProfile: null,
    loading: true,
    error: null,
  });

  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return profile;
  }, []);

  const fetchRecruiterProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('recruiters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }, []);

  const fetchJobSeekerProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('job_seeker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          let recruiterProfile = null;
          let jobSeekerProfile = null;

          if (profile.role === 'recruiter') {
            recruiterProfile = await fetchRecruiterProfile(session.user.id);
          } else if (profile.role === 'job_seeker') {
            jobSeekerProfile = await fetchJobSeekerProfile(session.user.id);
          }

          setState({
            user: profile,
            recruiterProfile,
            jobSeekerProfile,
            loading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        let recruiterProfile = null;
        let jobSeekerProfile = null;

        if (profile.role === 'recruiter') {
          recruiterProfile = await fetchRecruiterProfile(session.user.id);
        } else if (profile.role === 'job_seeker') {
          jobSeekerProfile = await fetchJobSeekerProfile(session.user.id);
        }

        setState({
          user: profile,
          recruiterProfile,
          jobSeekerProfile,
          loading: false,
          error: null,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          recruiterProfile: null,
          jobSeekerProfile: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, fetchRecruiterProfile, fetchJobSeekerProfile]);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('User creation failed');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          email,
          role,
        });

      if (profileError) throw profileError;

      if (role === 'recruiter') {
        const { error: recruiterError } = await supabase
          .from('recruiters')
          .insert({
            user_id: user.id,
            company_name: `${fullName}'s Company`,
          });
        if (recruiterError) throw recruiterError;
      } else if (role === 'job_seeker') {
        const { error: seekerError } = await supabase
          .from('job_seeker_profiles')
          .insert({
            user_id: user.id,
          });
        if (seekerError) throw seekerError;
      }

      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({
        user: null,
        recruiterProfile: null,
        jobSeekerProfile: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const createRecruiterProfile = async (data: Partial<RecruiterProfile>) => {
    if (!state.user) return;

    try {
      const { data: profile, error } = await supabase
        .from('recruiters')
        .insert({ ...data, user_id: state.user.id })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, recruiterProfile: profile }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const updateRecruiterProfile = async (data: Partial<RecruiterProfile>) => {
    if (!state.recruiterProfile) return;

    try {
      const { error } = await supabase
        .from('recruiters')
        .update(data)
        .eq('id', state.recruiterProfile.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        recruiterProfile: prev.recruiterProfile
          ? { ...prev.recruiterProfile, ...data }
          : null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const createJobSeekerProfile = async (data: Partial<JobSeekerProfile>) => {
    if (!state.user) return;

    try {
      const { data: profile, error } = await supabase
        .from('job_seeker_profiles')
        .insert({ ...data, user_id: state.user.id })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, jobSeekerProfile: profile }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const updateJobSeekerProfile = async (data: Partial<JobSeekerProfile>) => {
    if (!state.jobSeekerProfile) return;

    try {
      const { error } = await supabase
        .from('job_seeker_profiles')
        .update(data)
        .eq('id', state.jobSeekerProfile.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        jobSeekerProfile: prev.jobSeekerProfile
          ? { ...prev.jobSeekerProfile, ...data }
          : null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        createRecruiterProfile,
        updateRecruiterProfile,
        createJobSeekerProfile,
        updateJobSeekerProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
