
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoryDetail = () => {
  const { id } = useParams();
  
  const { data: story, isLoading } = useQuery({
    queryKey: ['story', id],
    queryFn: () => storyService.getStoryById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Link>
        </Button>
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
          <p className="text-muted-foreground mb-8">By {story.author}</p>
          <div className="mt-4">{story.content}</div>
        </article>
      </main>
    </div>
  );
};

export default StoryDetail;
