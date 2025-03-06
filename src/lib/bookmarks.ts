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
      .select('story_id')
      .eq('user_id', userId);
    
    if (bookmarksError) throw bookmarksError;
    
    if (!bookmarks?.length) return [];

    const storyIds = bookmarks.map(bookmark => bookmark.story_id);
    
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('*')
      .in('id', storyIds);
    
    if (storiesError) throw storiesError;
    return stories || [];
  },
};
