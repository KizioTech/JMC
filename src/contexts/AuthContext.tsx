import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (!error && data) {
        setRole(data.role);
        return data.role;
      } else {
        setRole(null);
        return null;
      }
    } catch {
      setRole(null);
      return null;
    }
  };

  const handleAuthError = async (error: any) => {
    // Handle refresh token errors
    if (error?.status === 400 || error?.message?.includes('refresh_token')) {
      console.warn('Invalid session detected, clearing...');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setRole(null);
      return true;
    }
    return false;
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        const handled = await handleAuthError(error);
        if (handled) {
          setLoading(false);
          return;
        }
        throw error;
      }
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        if (data.session.user) {
          await fetchRole(data.session.user.id);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing session:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session with error handling
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          await handleAuthError(error);
          if (mounted) setLoading(false);
          return;
        }

        if (session && mounted) {
          setSession(session);
          setUser(session.user);
          if (session.user) {
            await fetchRole(session.user.id);
          }
        } else if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await supabase.auth.signOut();
        if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          await handleAuthError({ status: 400, message: 'refresh_token' });
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Try to refresh session periodically (every 30 minutes)
    const refreshInterval = setInterval(() => {
      if (session) {
        refreshSession();
      }
    }, 30 * 60 * 1000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName ?? '' },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear even if API fails
      setSession(null);
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        role, 
        loading, 
        signIn, 
        signUp, 
        signOut,
        refreshSession 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};