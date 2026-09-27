import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (Vite format)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Checks whether Supabase environment variables are properly defined.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey.length > 20
  );
};

/**
 * Singleton Supabase Client instance or null if not yet configured.
 * This guarantees the application never crashes during development or preview
 * if the user has not yet plugged in their Supabase credentials.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Helper to obtain the active client or throw a descriptive error.
 */
export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado. Por favor define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tus variables de entorno.'
    );
  }
  return supabase;
};
