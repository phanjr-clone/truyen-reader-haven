
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import type { Story } from '@/lib/supabase';
import { storyFormSchema, type StoryFormValues } from './schemas/story-schema';
import { useStoryImage } from './hooks/useStoryImage';
import { useStorySubmit } from './hooks/useStorySubmit';

interface StoryFormProps {
  story?: Story;
  onSuccess?: () => void;
}

export function StoryForm({ story, onSuccess }: StoryFormProps) {
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: story?.title || "",
      author: story?.author || "",
      content: story?.content || "",
      type: story?.type || "Romance"
    },
  });

  const { coverFile, coverPreview, setCoverFile, setCoverPreview, handleImageChange } = 
    useStoryImage(story?.cover_url);

  const mutation = useStorySubmit({
    story,
    onSuccess,
    onReset: () => {
      form.reset();
      setCoverFile(null);
      setCoverPreview('');
    },
  });

  function onSubmit(values: StoryFormValues) {
    mutation.mutate({ ...values, coverFile });
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
          {story ? 'Update Story' : 'Create Story'}
        </Button>
      </form>
    </Form>
  );
}
