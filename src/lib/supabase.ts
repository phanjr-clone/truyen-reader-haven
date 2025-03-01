
import { createClient } from '@supabase/supabase-js';

// These are public keys - it's safe to expose them
const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Story {
  id: string;
  title: string;
  author: string;
  content?: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}
