import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import type { Story } from "@/lib/supabase";
import { useStoryForm } from "./hooks/useStoryForm";
import { ChapterForm } from "./forms/ChapterForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoryFormProps {
  story?: Story;
  initialChapters?: any[];
  onSuccess?: () => void;
}

export function StoryForm({
  story,
  initialChapters = [],
  onSuccess,
}: StoryFormProps) {
  const {
    form,
    fields,
    append,
    remove,
    coverPreview,
    handleImageChange,
    onSubmit,
    mutation,
  } = useStoryForm({ story, initialChapters, onSuccess });

  return (
    <ScrollArea className="h-[70vh] overflow-scroll">
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                onClick={() =>
                  append({ title: "", content: "", order: fields.length })
                }
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Chapter
              </Button>
            </div>

            {fields.map((field, index) => (
              <ChapterForm
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
              />
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
            {story ? "Update Story" : "Create Story"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
