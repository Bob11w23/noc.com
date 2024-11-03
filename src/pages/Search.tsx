import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { searchNews } from '../services/api';
import { useStore } from '../store/useStore';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { publishedArticles } = useStore();

  const { data: apiArticles, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchNews(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  // Filter published articles based on search query
  const filteredPublished = publishedArticles.filter(article =>
    article.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    article.overview?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Combine and deduplicate results
  const articles = React.useMemo(() => {
    if (!apiArticles) return filteredPublished;
    const allArticles = [...filteredPublished, ...apiArticles];
    return Array.from(new Map(allArticles.map(article => [article.id, article])).values());
  }, [apiArticles, filteredPublished]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="sticky top-0 bg-gray-100 pt-4 pb-2 z-10">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {query.length > 0 ? (
        isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <SearchIcon className="w-12 h-12 mb-2" />
          <p>Enter a search term to find news</p>
        </div>
      )}
    </div>
  );
};