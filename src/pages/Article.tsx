import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Share2, Highlighter, MessageSquarePlus, Volume2, ChevronLeft, ChevronRight, SidebarIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cleanTextForSpeech } from '../utils/textCleaner';

export const Article: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState('');
  const [note, setNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { savedArticles, publishedArticles, addHighlight, addNote, toggleSavedArticle, settings } = useStore();
  const speechRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const articleContentRef = React.useRef<HTMLDivElement>(null);

  const article = [...savedArticles, ...publishedArticles].find((a) => a.id === id);
  const isSaved = savedArticles.some(a => a.id === id);
  const hasAnnotations = article && (article.highlights.length > 0 || article.notes.length > 0);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      setVoicesLoaded(true);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else {
      setVoicesLoaded(true);
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[settings.fontSize];

    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [settings.fontSize, isPlaying]);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">Article not found</h1>
        </div>
      </div>
    );
  }

  const handleHighlight = () => {
    if (selectedText) {
      addHighlight(article.id, selectedText);
      setSelectedText('');
    }
  };

  const handleAddNote = () => {
    if (note.trim()) {
      addNote(article.id, note.trim());
      setNote('');
      setShowNoteInput(false);
    }
  };

  const handleSpeak = () => {
    if (!voicesLoaded || !articleContentRef.current) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Get the visible text content from the article
    const titleText = article.title;
    const descriptionText = article.description;
    const contentText = cleanTextForSpeech(articleContentRef.current.innerHTML);
    
    const textToRead = `${titleText}.... ${descriptionText}... ${contentText}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Configure voice settings for a more natural, human-like voice
    utterance.rate = 0.85; // Slightly slower for better articulation
    utterance.pitch = 0.95; // More natural pitch
    utterance.volume = 1.0;

    // Try to find the best voice for narration
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      // Prioritize high-quality voices known for natural speech
      voice.name.toLowerCase().includes('premium') ||
      voice.name.toLowerCase().includes('enhanced') ||
      voice.name.toLowerCase().includes('neural') ||
      voice.name.toLowerCase().includes('daniel') ||
      (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('wavenet')) ||
      (voice.name.toLowerCase().includes('english') && voice.name.toLowerCase().includes('us'))
    ) || voices.find(voice => 
      // Fallback to standard voices
      voice.name.toLowerCase().includes('male') ||
      (voice.name.toLowerCase().includes('english') && voice.name.toLowerCase().includes('us'))
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Add event listeners for more precise control
    utterance.onboundary = (event) => {
      // Adjust timing between words for more natural flow
      if (event.name === 'word') {
        const word = event.target.text.substr(event.charIndex, event.charLength);
        if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
          // Add slight pause after sentences
          utterance.rate = 0.75;
          setTimeout(() => {
            utterance.rate = 0.85;
          }, 100);
        }
      }
    };

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    speechRef.current = utterance;
  };

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description,
      url: window.location.href
    };

    try {
      await navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
      );
      alert('Link copied to clipboard!');
    } catch (error) {
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          alert('Unable to share. Link could not be copied to clipboard.');
        }
      } catch (shareError) {
        console.error('Error sharing:', shareError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${hasAnnotations ? 'w-80' : 'w-0'} z-20`}
      >
        <div className="h-full overflow-y-auto p-4">
          {article.highlights.length > 0 && (
            <>
              <h3 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                Highlights
              </h3>
              {article.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded mb-2 dark:text-yellow-100 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  "{highlight}"
                </div>
              ))}
            </>
          )}

          {article.notes.length > 0 && (
            <>
              <h3 className="font-semibold mt-6 mb-4 dark:text-white flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4" />
                Notes
              </h3>
              {article.notes.map((note, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded mb-2 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {note}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${isSidebarOpen && hasAnnotations ? 'ml-80' : 'ml-0'}`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft className="w-6 h-6 dark:text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold dark:text-white">Article</h1>
            </div>
            {hasAnnotations && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                title={isSidebarOpen ? "Hide annotations" : "Show annotations"}
              >
                {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>
            )}
            <button
              onClick={() => toggleSavedArticle(article)}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isSaved ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isPlaying ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">{article.title}</h2>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span>{article.source.name}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>

            {article.image && settings.showImages && (
              <img src={article.image} alt={article.title} className="w-full rounded-lg mb-6" />
            )}

            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{article.description}</p>
              <div 
                ref={articleContentRef}
                className="text-gray-800 dark:text-gray-200"
                onMouseUp={() => setSelectedText(window.getSelection()?.toString() || '')}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>

          <div className="fixed bottom-20 right-4 flex flex-col gap-2">
            {selectedText && (
              <button
                onClick={handleHighlight}
                className="p-3 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-colors"
              >
                <Highlighter className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
            >
              <MessageSquarePlus className="w-6 h-6" />
            </button>
          </div>

          {showNoteInput && (
            <div className="fixed bottom-40 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                className="mt-2 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};