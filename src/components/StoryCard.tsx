
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Bookmark, BookmarkMinus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookmarkService } from '@/lib/bookmarks';
import { useToast } from '@/hooks/use-toast';

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  categories: string[];
  cover?: string;
}

const StoryCard = ({ id, title, author, categories, cover }: StoryCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (user) {
        try {
          const bookmarkedStories = await bookmarkService.getBookmarkedStories(user.id);
          setIsBookmarked(bookmarkedStories.includes(id));
        } catch (error) {
          console.error('Error checking bookmark:', error);
        }
      }
    };

    checkBookmark();
  }, [user, id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the bookmark button
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to bookmark stories",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(user.id, id);
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Story removed from your bookmarks",
        });
      } else {
        await bookmarkService.addBookmark(user.id, id);
        setIsBookmarked(true);
        toast({
          title: "Bookmarked!",
          description: "Story added to your bookmarks",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group">
      <Link to={`/story/${id}`} className="block">
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
              <span key={category} className="text-xs bg-secondary px-2 py-1 rounded-full">
                {category}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleBookmark}
      >
        {isBookmarked ? (
          <BookmarkMinus className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default StoryCard;
