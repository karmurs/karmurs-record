import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

export type AdminAuthResult = {
  configured: boolean;
  error: string | null;
  session: Session | null;
};

export async function getAdminSession(): Promise<AdminAuthResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { configured: false, error: null, session: null };
  }

  const { data, error } = await supabase.auth.getSession();

  return {
    configured: true,
    error: error?.message ?? null,
    session: data.session
  };
}

export async function signInAdmin(email: string, password: string): Promise<AdminAuthResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { configured: false, error: 'Supabase env is not configured.', session: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  return {
    configured: true,
    error: error?.message ?? null,
    session: data.session
  };
}

export async function signOutAdmin() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { configured: false, error: null };
  }

  const { error } = await supabase.auth.signOut();

  return {
    configured: true,
    error: error?.message ?? null
  };
}

export function onAdminAuthChange(onSession: (session: Session | null) => void) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return () => undefined;
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onSession(session);
  });

  return () => data.subscription.unsubscribe();
}

export { isSupabaseConfigured };
