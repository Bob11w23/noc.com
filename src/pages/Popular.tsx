import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { getPopularNews } from '../services/api';

export const Popular: React.FC = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['popularNews'],
    queryFn: getPopularNews,
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">Popular News</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};