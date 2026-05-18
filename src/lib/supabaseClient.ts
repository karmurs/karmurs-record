import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

let supabaseClient: SupabaseClient | null = null;

function normalizeSupabaseProjectUrl(url: string) {
  if (!url) {
    return '';
  }

  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch {
    return url;
  }
}

const supabaseUrl = normalizeSupabaseProjectUrl(rawSupabaseUrl);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  supabaseClient ??= createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
