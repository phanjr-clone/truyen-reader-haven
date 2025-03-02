
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Story } from '@/lib/supabase';

const formSchema = z.object({
  title: z.string().min(2).max(100),
  author: z.string().min(2).max(100),
  content: z.string().min(10),
  type: z.enum(['Romance', 'Drama', 'Youth', 'Life', 'Adventure', 'Fantasy', 'Mystery'])
});

interface StoryFormProps {
  story?: Story;
  onSuccess?: () => void;
}

export function StoryForm({ story, onSuccess }: StoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!story;
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string>(story?.cover_url || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: story?.title || "",
      author: story?.author || "",
      content: story?.content || "",
      type: story?.type || "Romance"
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const preview = URL.createObjectURL(file);
      setCoverPreview(preview);
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
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
          .update({ ...values, cover_url })
          .eq('id', story.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([{ ...values, cover_url }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast.success(isEditing ? 'Story updated successfully' : 'Story created successfully');
      onSuccess?.();
      if (!isEditing) {
        form.reset();
        setCoverFile(null);
        setCoverPreview('');
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} story: ${error.message}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Story title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Youth">Youth</SelectItem>
                  <SelectItem value="Life">Life</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your story content here..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Cover Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {coverPreview && (
            <div className="mt-2">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="max-w-[200px] rounded-md"
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {isEditing ? 'Update Story' : 'Create Story'}
        </Button>
      </form>
    </Form>
  );
}
