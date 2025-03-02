
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
  views?: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  story_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    email?: string;
    name?: string;
  };
}

export const storyService = {
  async getPopularStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('views', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  async getStoryById(id: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Increment views
    await supabase
      .from('stories')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
    
    return data;
  }
};

