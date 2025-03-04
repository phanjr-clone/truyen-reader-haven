import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext, UseFormReturn } from "react-hook-form";
import type { StoryFormValues } from "../schemas/story-schema";

interface ChapterFormProps {
  index: number;
  onRemove: () => void;
}

export function ChapterForm({ index, onRemove }: ChapterFormProps) {
  const form = useFormContext();

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Chapter {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
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
  );
}
