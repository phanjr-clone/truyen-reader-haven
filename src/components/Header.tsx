
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ScrollText } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">TruyenHaven</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link to="/latest" className="text-sm font-medium hover:text-primary transition-colors">
            Latest
          </Link>
          <Link to="/popular" className="text-sm font-medium hover:text-primary transition-colors">
            Popular
          </Link>
          <Button variant="ghost" size="icon">
            <ScrollText className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
