export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  tags: Tag[];
  liked: boolean;
  saved: boolean;
  read: boolean;
  highlights: string[];
  notes: string[];
  overview?: string;
  bulletPoints?: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  showImages: boolean;
  accentColor: string;
  isDeveloper: boolean;
}