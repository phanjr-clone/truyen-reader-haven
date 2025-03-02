
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
      const { coverFile, ...storyData } = values;
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

      if (isEditing) {
        const { error } = await supabase
          .from('stories')
          .update({ ...storyData, cover_url })
          .eq('id', story.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([{ ...storyData, cover_url }]);
        if (error) throw error;
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
