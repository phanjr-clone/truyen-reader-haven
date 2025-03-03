
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Story } from '@/lib/supabase';
import type { StoryFormValues } from '../schemas/story-schema';

interface UseStorySubmitProps {
  story?: Story;
  onSuccess?: () => void;
  onReset?: () => void;
}

export function useStorySubmit({ story, onSuccess, onReset }: UseStorySubmitProps) {
  const queryClient = useQueryClient();
  const isEditing = !!story;

  return useMutation({
    mutationFn: async (values: StoryFormValues & { coverFile?: File | null }) => {
      const { coverFile, chapters, ...storyData } = values;
      let cover_url = story?.cover_url;

      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('story-covers')
          .upload(filePath, coverFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('story-covers')
          .getPublicUrl(filePath);

        cover_url = publicUrl;
      }

      let storyId = story?.id;

      if (isEditing) {
        const { error } = await supabase
          .from('stories')
          .update({ ...storyData, cover_url })
          .eq('id', story.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('stories')
          .insert([{ ...storyData, cover_url }])
          .select()
          .single();
        if (error) throw error;
        storyId = data.id;
      }

      // Handle chapters if they exist
      if (chapters && chapters.length > 0 && storyId) {
        const chaptersWithStoryId = chapters.map(chapter => ({
          ...chapter,
          story_id: storyId
        }));

        const { error: chaptersError } = await supabase
          .from('chapters')
          .insert(chaptersWithStoryId);

        if (chaptersError) throw chaptersError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast.success(isEditing ? 'Story updated successfully' : 'Story created successfully');
      onSuccess?.();
      if (!isEditing) {
        onReset?.();
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} story: ${error.message}`);
    },
  });
}

