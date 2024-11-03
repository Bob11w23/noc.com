import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings, Filter } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { getTopNews } from '../services/api';
import { useStore } from '../store/useStore';
import { SettingsModal } from '../components/SettingsModal';
import { Tag } from '../types/news';

type SortOption = 'best' | 'recent' | 'date';

export const Dashboard: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { publishedArticles } = useStore();

  const { data: apiArticles, isLoading } = useQuery({
    queryKey: ['topNews'],
    queryFn: getTopNews,
  });

  // Get unique tags from all articles
  const availableTags = React.useMemo(() => {
    const tags = new Map<string, Tag>();
    publishedArticles.forEach(article => {
      article.tags.forEach(tag => {
        tags.set(tag.id, tag);
      });
    });
    return Array.from(tags.values());
  }, [publishedArticles]);

  // Combine and sort all articles
  const articles = React.useMemo(() => {
    if (!apiArticles) return publishedArticles;
    let allArticles = [...publishedArticles, ...apiArticles];

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      allArticles = allArticles.filter(article =>
        article.tags.some(tag => selectedTags.includes(tag.id))
      );
    }

    // Sort based on selected option
    switch (sortBy) {
      case 'recent':
        return allArticles.sort((a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case 'date':
        return allArticles.sort((a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      case 'best':
      default:
        return allArticles.sort((a, b) => {
          // Prioritize articles with matching tags
          const aTagMatch = a.tags.some(tag => selectedTags.includes(tag.id)) ? 1 : 0;
          const bTagMatch = b.tags.some(tag => selectedTags.includes(tag.id)) ? 1 : 0;
          if (aTagMatch !== bTagMatch) return bTagMatch - aTagMatch;
          
          // Then by date
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
    }
  }, [apiArticles, publishedArticles, sortBy, selectedTags]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-full hover:bg-gray-200 relative"
          >
            <Filter className="w-6 h-6" />
            {selectedTags.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {selectedTags.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Sort By</h3>
            <div className="flex gap-2">
              {[
                { value: 'best', label: 'Best Match' },
                { value: 'recent', label: 'Most Recent' },
                { value: 'date', label: 'Oldest First' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    sortBy === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() =>
                    setSelectedTags(prev =>
                      prev.includes(tag.id)
                        ? prev.filter(id => id !== tag.id)
                        : [...prev, tag.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};