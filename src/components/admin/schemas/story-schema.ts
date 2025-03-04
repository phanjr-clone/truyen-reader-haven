
import * as z from "zod";

const chapterSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string(),
  order: z.number(),
});

export const storyFormSchema = z.object({
  title: z.string().min(2).max(100),
  author: z.string().min(2).max(100),
  content: z.string().optional(),
  type: z.enum(['Romance', 'Drama', 'Youth', 'Life', 'Adventure', 'Fantasy', 'Mystery']),
  chapters: z.array(chapterSchema).optional(),
});

export type StoryFormValues = z.infer<typeof storyFormSchema>;
export type ChapterFormValues = z.infer<typeof chapterSchema>;

