
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import { storyService, type Story } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORY_TYPES = ['All', 'Romance', 'Drama', 'Youth', 'Life', 'Adventure', 'Fantasy', 'Mystery'] as const;

const Index = () => {
  const [selectedType, setSelectedType] = useState<string>("All");

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories', selectedType],
    queryFn: () => selectedType === 'All' 
      ? storyService.getAllStories()
      : storyService.getStoriesByType(selectedType as Story['type'])
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Stories</h2>
              <p className="text-muted-foreground">
                Discover our collection of captivating stories
              </p>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {STORY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p>Loading stories...</p>
            ) : stories.length > 0 ? (
              stories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  id={story.id}
                  title={story.title}
                  author={story.author}
                  categories={[story.type]}
                  cover={story.cover_url}
                />
              ))
            ) : (
              <p>No stories found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
