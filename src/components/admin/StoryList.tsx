
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash } from 'lucide-react';

const MOCK_STORIES = [
  {
    id: '1',
    title: 'Những Ngày Xưa Ấy',
    author: 'Nguyễn Nhật Ánh',
    status: 'published',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    status: 'draft',
    lastUpdated: '2024-03-14',
  },
];

const StoryList = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_STORIES.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.author}</TableCell>
              <TableCell>
                <span className={`capitalize ${story.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                  {story.status}
                </span>
              </TableCell>
              <TableCell>{story.lastUpdated}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoryList;
