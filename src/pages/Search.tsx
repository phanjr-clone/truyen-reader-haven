
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '@/lib/supabase';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';
import { useI18n } from '@/i18n/i18n';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useI18n();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories', 'search', query],
    queryFn: () => storyService.searchStories(query),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">
          {t('search.results')} "{query}"
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
