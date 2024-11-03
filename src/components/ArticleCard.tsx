import React from 'react';
import { Heart, Bookmark, Share2, Volume2 } from 'lucide-react';
import { Article } from '../types/news';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { TagBadge } from './TagBadge';

interface Props {
  article: Article;
}

export const ArticleCard: React.FC<Props> = ({ article }) => {
  const { toggleLikedArticle, toggleSavedArticle, likedArticles, savedArticles, settings } = useStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const speechRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const isLiked = likedArticles.includes(article.id);
  const isSaved = savedArticles.some(a => a.id === article.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikedArticle(article.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedArticle(article);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.origin + `/article/${article.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!speechRef.current) {
      speechRef.current = new SpeechSynthesisUtterance(
        `${article.title}. ${article.description}. ${article.content}`
      );
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 0.8;
      const voices = speechSynthesis.getVoices();
      const deepVoice = voices.find(voice => voice.name.includes('Male'));
      if (deepVoice) speechRef.current.voice = deepVoice;
    }

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
      speechRef.current.onend = () => setIsPlaying(false);
    }
  };

  return (
    <Link to={`/article/${article.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
        {settings.showImages && article.image && (
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold flex-1 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {article.title}
          </h2>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} hover:scale-110 transition-transform`} />
            </button>
            <button
              onClick={handleSave}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isSaved ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''} hover:scale-110 transition-transform`} />
            </button>
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isPlaying ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Volume2 className="w-5 h-5 hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Share2 className="w-5 h-5 hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
        
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {article.source.name && (
              <>
                <span className="font-medium">{article.source.name}</span>
                <span>•</span>
              </>
            )}
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          {(article.highlights.length > 0 || article.notes.length > 0) && (
            <div className="flex items-center gap-2 text-xs">
              {article.highlights.length > 0 && (
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  {article.highlights.length} highlights
                </span>
              )}
              {article.notes.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {article.notes.length} notes
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};