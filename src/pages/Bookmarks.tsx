
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookmarkService } from '@/lib/bookmarks';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';

const Bookmarks = () => {
  const { user } = useAuth();
  
  const { data: bookmarkedStories = [] } = useQuery({
    queryKey: ['bookmarkedStories', user?.id],
    queryFn: () => bookmarkService.getBookmarkedStories(user!.id),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarkedStories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Bookmarks;
