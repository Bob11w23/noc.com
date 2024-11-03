import React from 'react';
import { Bookmark } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { useStore } from '../store/useStore';

export const Saved: React.FC = () => {
  const { savedArticles } = useStore();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Saved Articles</h1>
      </div>

      {savedArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Bookmark className="w-12 h-12 mb-2" />
          <p>No saved articles yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};