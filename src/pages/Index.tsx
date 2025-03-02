import React from "react";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";

const FEATURED_STORIES = [
  {
    id: "1",
    title: "Những Ngày Xưa Ấy",
    author: "Nguyễn Nhật Ánh",
    categories: ["Romance", "Youth"],
    cover: "https://picsum.photos/400/600",
  },
  {
    id: "2",
    title: "Mắt Biếc",
    author: "Nguyễn Nhật Ánh",
    categories: ["Drama", "Romance"],
    cover: "https://picsum.photos/400/601",
  },
  {
    id: "3",
    title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
    author: "Nguyễn Nhật Ánh",
    categories: ["Youth", "Life"],
    cover: "https://picsum.photos/400/602",
  },
  {
    id: "4",
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    categories: ["Drama", "Youth"],
    cover: "https://picsum.photos/400/603",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Stories</h2>
            <p className="text-muted-foreground">
              Discover our collection of captivating stories
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {FEATURED_STORIES.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
