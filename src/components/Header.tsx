import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ScrollText, Settings, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { LoginDialog } from './auth/LoginDialog';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useI18n } from '@/i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">TruyenHaven</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link to="/popular" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.popular')}
          </Link>
          <ThemeToggle />
          <LanguageToggle />
          {user && (
            <>
              <Link to="/bookmarks">
                <Button variant="ghost" size="icon">
                  <ScrollText className="h-5 w-5" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && <LoginDialog />}
        </nav>
      </div>
    </header>
  );
}

export default Header;
