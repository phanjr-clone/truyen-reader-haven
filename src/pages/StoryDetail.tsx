import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const StoryDetail = () => {
  const { id } = useParams();
  
  const { data: story, isLoading: isLoadingStory } = useQuery({
    queryKey: ['story', id],
    queryFn: () => storyService.getStoryById(id!),
    enabled: !!id,
  });

  const { data: chapters = [], isLoading: isLoadingChapters } = useQuery({
    queryKey: ['chapters', id],
    queryFn: () => storyService.getChaptersByStoryId(id!),
    enabled: !!id,
  });

  if (isLoadingStory || isLoadingChapters) {
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
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-6 mt-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
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
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
          <p className="text-muted-foreground mb-8">By {story.author}</p>
          
          {chapters.length > 0 ? (
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="space-y-4">
                  <h2 className="text-2xl font-semibold">
                    Chapter {index + 1}: {chapter.title}
                  </h2>
                  <div className="mt-4">{chapter.content}</div>
                  {index < chapters.length - 1 && (
                    <Separator className="my-8" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">{story.content}</div>
          )}
        </article>
      </main>
    </div>
  );
};

export default StoryDetail;
