
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  categories: string[];
  cover?: string;
}

const StoryCard = ({ id, title, author, categories, cover }: StoryCardProps) => {
  return (
    <Link to={`/story/${id}`} className="story-card">
      <div className="aspect-[3/4] mb-4 overflow-hidden rounded-md bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Book className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="category-tag">
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
