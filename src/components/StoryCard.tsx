
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Bookmark, BookmarkMinus, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookmarkService } from '@/lib/bookmarks';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from './ui/card';
import { format } from 'date-fns';

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  categories: string[];
  cover?: string;
  created_at?: string;
  views?: number;
}

const StoryCard = ({ id, title, author, categories, cover, created_at, views }: StoryCardProps) => {
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
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/story/${id}`}>
        <div className="aspect-[3/4] relative overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Book className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/story/${id}`}>
          <h3 className="font-semibold leading-none tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{author}</p>
        </Link>
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category) => (
            <span
              key={category}
              className="text-xs bg-secondary/50 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex justify-between items-center bg-muted/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {created_at ? format(new Date(created_at), 'MMM d, yyyy') : 'Recent'}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleBookmark}
        >
          {isBookmarked ? (
            <BookmarkMinus className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
