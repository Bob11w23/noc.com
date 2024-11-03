import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, User } from 'lucide-react';
import { RichTextEditor } from '../components/RichTextEditor';
import { useStore } from '../store/useStore';
import { Article, Tag } from '../types/news';

const DEFAULT_TAGS: Tag[] = [
  { id: 'good', name: 'Good News', color: '#22c55e' },
  { id: 'death', name: 'Death', color: '#ef4444' },
  { id: 'alarming', name: 'Alarming', color: '#eab308' },
  { id: 'tech', name: 'Technology', color: '#3b82f6' },
  { id: 'politics', name: 'Politics', color: '#8b5cf6' },
  { id: 'health', name: 'Health', color: '#ec4899' },
];

export const Developer: React.FC = () => {
  const navigate = useNavigate();
  const { settings, publishedArticles, publishArticle, updateArticle, deleteArticle, updateAuthor } = useStore();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [overview, setOverview] = useState('');
  const [image, setImage] = useState('');
  const [authorName, setAuthorName] = useState(settings.authorName || '');
  const [authorBio, setAuthorBio] = useState(settings.authorBio || '');
  const [authorAvatar, setAuthorAvatar] = useState(settings.authorAvatar || '');
  const [newTag, setNewTag] = useState({ name: '', color: '#000000' });
  const [customTags, setCustomTags] = useState<Tag[]>([]);

  if (!settings.isDeveloper) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center dark:text-white">Access denied. Developer mode not enabled.</p>
      </div>
    );
  }

  const resetForm = () => {
    setEditingArticle(null);
    setTitle('');
    setContent('');
    setOverview('');
    setImage('');
    setSelectedTags([]);
  };

  const handlePublish = () => {
    const article: Article = {
      id: editingArticle?.id || Date.now().toString(),
      title,
      description: overview,
      content,
      url: '',
      image,
      publishedAt: new Date().toISOString(),
      source: {
        name: settings.authorName || 'Developer',
        url: '',
      },
      tags: [...DEFAULT_TAGS, ...customTags].filter((tag) => selectedTags.includes(tag.id)),
      liked: false,
      saved: false,
      read: false,
      highlights: [],
      notes: [],
      overview,
      authorId: settings.authorId,
    };

    if (editingArticle) {
      updateArticle(article);
    } else {
      publishArticle(article);
    }
    resetForm();
  };

  const handleUpdateAuthor = () => {
    updateAuthor({
      name: authorName,
      bio: authorBio,
      avatar: authorAvatar,
    });
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setOverview(article.overview || '');
    setImage(article.image);
    setSelectedTags(article.tags.map(tag => tag.id));
  };

  const handleAddTag = () => {
    if (newTag.name && newTag.color) {
      const tag: Tag = {
        id: newTag.name.toLowerCase().replace(/\s+/g, '-'),
        name: newTag.name,
        color: newTag.color,
      };
      setCustomTags([...customTags, tag]);
      setNewTag({ name: '', color: '#000000' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft className="w-6 h-6 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold dark:text-white">Developer Dashboard</h1>
      </div>

      {/* Author Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <User className="w-6 h-6 dark:text-white" />
          <h2 className="text-xl font-bold dark:text-white">Author Profile</h2>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Author Name"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            placeholder="Author Bio"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
          
          <input
            type="url"
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            placeholder="Avatar URL"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          
          <button
            onClick={handleUpdateAuthor}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Update Author Profile
          </button>
        </div>
      </div>

      {/* Article Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {editingArticle ? 'Edit Article' : 'Create Article'}
        </h2>
        
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div>
            <h3 className="font-medium mb-2 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[...DEFAULT_TAGS, ...customTags].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                placeholder="New tag name"
                className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="w-12 h-10 p-1 border rounded-md"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 dark:text-white">Overview</h3>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Article overview..."
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2 dark:text-white">Content</h3>
            <div className="min-h-[400px]">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>

          <button
            onClick={handlePublish}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingArticle ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold dark:text-white">Published Articles</h2>
        {publishedArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold dark:text-white">{article.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this article?')) {
                      deleteArticle(article.id);
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};