import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, Settings, Tag } from '../types/news';

interface Author {
  name: string;
  bio: string;
  avatar: string;
}

interface State {
  savedArticles: Article[];
  likedArticles: string[];
  settings: Settings & {
    authorName?: string;
    authorBio?: string;
    authorAvatar?: string;
    authorId?: string;
  };
  publishedArticles: Article[];
  addSavedArticle: (article: Article) => void;
  removeSavedArticle: (articleId: string) => void;
  toggleSavedArticle: (article: Article) => void;
  toggleLikedArticle: (articleId: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addHighlight: (articleId: string, highlight: string) => void;
  addNote: (articleId: string, note: string) => void;
  publishArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (articleId: string) => void;
  updateAuthor: (author: Author) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      savedArticles: [],
      likedArticles: [],
      publishedArticles: [],
      settings: {
        theme: 'light',
        fontSize: 'medium',
        showImages: true,
        accentColor: '#3b82f6',
        isDeveloper: false,
        authorId: crypto.randomUUID(),
      },
      addSavedArticle: (article) =>
        set((state) => ({
          savedArticles: [...state.savedArticles, article],
        })),
      removeSavedArticle: (articleId) =>
        set((state) => ({
          savedArticles: state.savedArticles.filter((a) => a.id !== articleId),
        })),
      toggleSavedArticle: (article) =>
        set((state) => ({
          savedArticles: state.savedArticles.some(a => a.id === article.id)
            ? state.savedArticles.filter(a => a.id !== article.id)
            : [...state.savedArticles, article],
        })),
      toggleLikedArticle: (articleId) =>
        set((state) => ({
          likedArticles: state.likedArticles.includes(articleId)
            ? state.likedArticles.filter((id) => id !== articleId)
            : [...state.likedArticles, articleId],
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { 
            ...state.settings, 
            ...newSettings,
            isDeveloper: newSettings.isDeveloper ?? false
          },
        })),
      addHighlight: (articleId, highlight) =>
        set((state) => ({
          savedArticles: state.savedArticles.map((article) =>
            article.id === articleId
              ? { ...article, highlights: [...article.highlights, highlight] }
              : article
          ),
          publishedArticles: state.publishedArticles.map((article) =>
            article.id === articleId
              ? { ...article, highlights: [...article.highlights, highlight] }
              : article
          ),
        })),
      addNote: (articleId, note) =>
        set((state) => ({
          savedArticles: state.savedArticles.map((article) =>
            article.id === articleId
              ? { ...article, notes: [...article.notes, note] }
              : article
          ),
          publishedArticles: state.publishedArticles.map((article) =>
            article.id === articleId
              ? { ...article, notes: [...article.notes, note] }
              : article
          ),
        })),
      publishArticle: (article) =>
        set((state) => ({
          publishedArticles: [...state.publishedArticles, article],
        })),
      updateArticle: (article) =>
        set((state) => ({
          publishedArticles: state.publishedArticles.map((a) =>
            a.id === article.id ? article : a
          ),
        })),
      deleteArticle: (articleId) =>
        set((state) => ({
          publishedArticles: state.publishedArticles.filter((a) => a.id !== articleId),
        })),
      updateAuthor: (author) =>
        set((state) => ({
          settings: {
            ...state.settings,
            authorName: author.name,
            authorBio: author.bio,
            authorAvatar: author.avatar,
          },
        })),
    }),
    {
      name: 'news-storage',
      partialize: (state) => ({
        ...state,
        settings: { ...state.settings, isDeveloper: false },
      }),
    }
  )
);