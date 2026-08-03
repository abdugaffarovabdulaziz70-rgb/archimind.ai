import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-application-name': 'archimind-ai' },
  },
});

export function getFunctionUrl(slug: string): string {
  return `${supabaseUrl}/functions/v1/${slug}`;
}

export function getFunctionHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'x-client-info': 'archimind-ai',
  };
}
