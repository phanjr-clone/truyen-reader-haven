
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '@/lib/supabase';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';

const Popular = () => {
  const { data: stories = [] } = useQuery({
    queryKey: ['popularStories'],
    queryFn: storyService.getPopularStories,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Popular Stories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Popular;
