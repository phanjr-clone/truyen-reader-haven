import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      type: story?.type || "Romance",
      chapters: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
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
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Chapters</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', content: '', order: fields.length })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Chapter
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Chapter {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`chapters.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Chapter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`chapters.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your chapter content here..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`chapters.${index}.order`}
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} value={index} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Content</FormLabel>
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
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {story ? 'Update Story' : 'Create Story'}
        </Button>
      </form>
    </Form>
  );
}
