import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite or Next.js environment variables safely
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;

const supabaseUrl = 
  metaEnv?.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof window !== 'undefined' && (window as unknown as { __SUPABASE_URL__?: string }).__SUPABASE_URL__) ||
  '';

const supabaseAnonKey = 
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof window !== 'undefined' && (window as unknown as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__) ||
  '';

const isValidSupabaseUrl = (value: string): boolean => {
  try {
    return new URL(value).hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
};

const isPublicSupabaseKey = (value: string): boolean =>
  value.startsWith('eyJ') || value.startsWith('sb_publishable_');

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(supabaseUrl) &&
  isPublicSupabaseKey(supabaseAnonKey)
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Could not initialize live Supabase client:', error);
  }
}

export const supabase = client;
export { supabaseUrl, supabaseAnonKey };
