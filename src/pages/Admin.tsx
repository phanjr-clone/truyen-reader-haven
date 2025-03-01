
import React from 'react';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import StoryList from '../components/admin/StoryList';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Story Management</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Story
          </Button>
        </div>
        <StoryList />
      </main>
    </div>
  );
};

export default Admin;
