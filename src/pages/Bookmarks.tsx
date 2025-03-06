
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookmarkService } from '@/lib/bookmarks';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';
import { Skeleton } from '@/components/ui/skeleton';

const Bookmarks = () => {
  const { user } = useAuth();
  
  const { data: bookmarkedStories = [], isLoading } = useQuery({
    queryKey: ['bookmarkedStories', user?.id],
    queryFn: () => bookmarkService.getBookmarkedStories(user!.id),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookmarkedStories.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">No bookmarked stories yet.</p>
            ) : (
              bookmarkedStories.map((story) => (
                <StoryCard key={story.id} {...story} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
