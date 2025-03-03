
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StoryForm } from "./StoryForm";
import type { Story } from "@/lib/supabase";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface StoryDialogProps {
  story?: Story;
  trigger?: React.ReactNode;
}

export function StoryDialog({ story, trigger }: StoryDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: chapters } = useQuery({
    queryKey: ['chapters', story?.id],
    queryFn: async () => {
      if (!story?.id) return [];
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', story.id)
        .order('order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!story?.id,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add Story</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{story ? 'Edit Story' : 'Create New Story'}</DialogTitle>
          <DialogDescription>
            {story ? 'Make changes to your story here.' : 'Add a new story to your collection.'}
          </DialogDescription>
        </DialogHeader>
        <StoryForm 
          story={story} 
          initialChapters={chapters}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
