
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const StoryDetail = () => {
  const { id } = useParams();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  
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

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

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

  const currentChapter = chapters[currentChapterIndex];

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
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
            <p className="text-muted-foreground">By {story.author}</p>
          </CardContent>
        </Card>

        {chapters.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Chapter {currentChapterIndex + 1}: {currentChapter.title}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevChapter}
                  disabled={currentChapterIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextChapter}
                  disabled={currentChapterIndex === chapters.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {currentChapter.content}
            </article>
            {currentChapterIndex < chapters.length - 1 && (
              <Separator className="my-8" />
            )}
          </div>
        ) : (
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {story.content}
          </article>
        )}
      </main>
    </div>
  );
};

export default StoryDetail;
