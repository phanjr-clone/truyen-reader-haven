
import * as z from "zod";

export const storyFormSchema = z.object({
  title: z.string().min(2).max(100),
  author: z.string().min(2).max(100),
  content: z.string().min(10),
  type: z.enum(['Romance', 'Drama', 'Youth', 'Life', 'Adventure', 'Fantasy', 'Mystery'])
});

export type StoryFormValues = z.infer<typeof storyFormSchema>;
