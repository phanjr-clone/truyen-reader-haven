
import { supabase } from './supabase';
import type { Bookmark } from './supabase';

export const bookmarkService = {
  async addBookmark(userId: string, storyId: string): Promise<Bookmark | null> {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, story_id: storyId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeBookmark(userId: string, storyId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, story_id: storyId });
    
    if (error) throw error;
  },

  async getBookmarkedStories(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('story_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.map(bookmark => bookmark.story_id) ?? [];
  },
};
