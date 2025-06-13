import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key'
);

if (!isConfigured) {
  console.warn('Supabase credentials not configured, falling back to localStorage');
}

// Create dummy client for TypeScript compatibility when not configured
const dummyClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    eq: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    }),
    order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
  })
// eslint-disable-next-line @typescript-eslint/no-explicit-any  
} as any;

// Only create client if properly configured
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummyClient;

// Database types
export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          member_id: string;
          date: string;
          status: 'present' | 'late' | 'absent' | 'holiday';
          timestamp: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          date: string;
          status: 'present' | 'late' | 'absent' | 'holiday';
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          date?: string;
          status?: 'present' | 'late' | 'absent' | 'holiday';
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}