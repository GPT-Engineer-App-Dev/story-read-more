import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchTerm, stories]);

  const fetchTopStories = async () => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );
      const storyIds = await response.json();
      const top100Ids = storyIds.slice(0, 100);
      const storyPromises = top100Ids.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (res) => res.json()
        )
      );
      const stories = await Promise.all(storyPromises);
      setStories(stories);
      setFilteredStories(stories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  };

  const filterStories = () => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top Stories</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {loading ? (
        <div>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full mb-4" />
          ))}
        </div>
      ) : (
        <ul>
          {filteredStories.map((story) => (
            <li key={story.id} className="mb-4">
              <h2 className="text-xl font-bold">{story.title}</h2>
              <p>Upvotes: {story.score}</p>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Read more
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;