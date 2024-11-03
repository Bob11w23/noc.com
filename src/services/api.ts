import axios from 'axios';
import { Article } from '../types/news';
import { useStore } from '../store/useStore';

const API_KEY = 'YOUR_NEWS_API_KEY';
const BASE_URL = 'https://newsapi.org/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const getTopNews = async (): Promise<Article[]> => {
  // Get published articles from store
  const store = useStore.getState();
  const publishedArticles = store.publishedArticles;

  const response = await api.get('/top-headlines?country=us');
  const apiArticles = response.data.articles.map(transformArticle);

  // Combine and sort by date, showing published articles first
  return [...publishedArticles, ...apiArticles].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

export const searchNews = async (query: string): Promise<Article[]> => {
  const store = useStore.getState();
  const publishedArticles = store.publishedArticles;

  // Filter published articles by title or content match
  const matchingPublished = publishedArticles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase()) ||
    article.overview?.toLowerCase().includes(query.toLowerCase())
  );

  const response = await api.get(`/everything?q=${query}`);
  const apiArticles = response.data.articles.map(transformArticle);

  // Combine results, prioritizing published articles
  return [...matchingPublished, ...apiArticles];
};

export const getPopularNews = async (): Promise<Article[]> => {
  const store = useStore.getState();
  const publishedArticles = store.publishedArticles;

  // Get most recent published articles
  const recentPublished = publishedArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  const response = await api.get('/top-headlines?country=us&category=general');
  const apiArticles = response.data.articles.map(transformArticle);

  return [...recentPublished, ...apiArticles];
};

const transformArticle = (article: any): Article => ({
  id: article.url,
  title: article.title,
  description: article.description,
  content: article.content,
  url: article.url,
  image: article.urlToImage,
  publishedAt: article.publishedAt,
  source: {
    name: article.source.name,
    url: article.url,
  },
  tags: [],
  liked: false,
  saved: false,
  read: false,
  highlights: [],
  notes: [],
});