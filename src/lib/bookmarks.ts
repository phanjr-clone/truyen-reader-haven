
import { supabase } from './supabase';
import type { Bookmark, Story } from './supabase';

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

  async getBookmarkedStories(userId: string): Promise<Story[]> {
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select(`
        stories:story_id (
          id,
          title,
          author,
          type,
          views,
          cover_url,
          created_at
        )
      `)
      .eq('user_id', userId);
    
    if (bookmarksError) throw bookmarksError;
    
    if (!bookmarks?.length) return [];

    return bookmarks.map(bookmark => bookmark.stories as Story);
  },
};
