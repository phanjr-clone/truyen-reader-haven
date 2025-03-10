import { createClient } from '@supabase/supabase-js';

// These are public keys - it's safe to expose them
const supabaseUrl = 'https://ifqpksmmxhirumjavejr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcXBrc21teGhpcnVtamF2ZWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NjY4NTQsImV4cCI6MjA1NDE0Mjg1NH0.6cr3NwaGy62Ipl4mJLe8zz95dKNqEEvDYeeBEZ7qRck';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Story {
  id: string;
  title: string;
  author: string;
  content?: string;
  cover_url?: string;
  type: 'Romance' | 'Drama' | 'Youth' | 'Life' | 'Adventure' | 'Fantasy' | 'Mystery';
  views: number;
  created_at?: string;
  updated_at?: string;
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

export interface Chapter {
  id: string;
  story_id: string;
  title: string;
  content: string;
  order: number;
  created_at?: string;
  image_url?: string;
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
  },

  async getAllStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getStoriesByType(type: Story['type']) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createChapter(storyId: string, chapter: Partial<Chapter>) {
    const { data, error } = await supabase
      .from('chapters')
      .insert([{ ...chapter, story_id: storyId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getChaptersByStoryId(storyId: string) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('story_id', storyId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateChapter(id: string, updates: Partial<Chapter>) {
    const { data, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteChapter(id: string) {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async searchStories(query: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
