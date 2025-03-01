
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StoryForm } from "./StoryForm";
import type { Story } from "@/lib/supabase";
import { useState } from "react";

interface StoryDialogProps {
  story?: Story;
  trigger?: React.ReactNode;
}

export function StoryDialog({ story, trigger }: StoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add Story</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{story ? 'Edit Story' : 'Create New Story'}</DialogTitle>
        </DialogHeader>
        <StoryForm story={story} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
