
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { storyFormSchema, type StoryFormValues } from "../schemas/story-schema";
import type { Story } from "@/lib/supabase";
import { useStoryImage } from "./useStoryImage";
import { useStorySubmit } from "./useStorySubmit";
import { useQueryClient } from "@tanstack/react-query";

interface UseStoryFormProps {
  story?: Story;
  initialChapters?: any[];
  onSuccess?: () => void;
}

export function useStoryForm({ story, initialChapters = [], onSuccess }: UseStoryFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: story?.title || "",
      author: story?.author || "",
      content: story?.content || "",
      type: story?.type || "Romance",
      chapters: initialChapters.map(chapter => ({
        title: chapter.title,
        content: chapter.content,
        order: chapter.order,
        imageUrl: chapter.image_url,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const { 
    coverFile, 
    coverPreview, 
    setCoverFile, 
    setCoverPreview, 
    handleImageChange 
  } = useStoryImage(story?.cover_url);

  const mutation = useStorySubmit({
    story,
    onSuccess,
    onReset: () => {
      form.reset();
      setCoverFile(null);
      setCoverPreview('');
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const onSubmit = (values: StoryFormValues) => {
    mutation.mutate({ ...values, coverFile });
  };

  return {
    form,
    fields,
    append,
    remove,
    coverPreview,
    handleImageChange,
    onSubmit,
    mutation,
  };
}
