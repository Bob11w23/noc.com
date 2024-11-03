import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { Popular } from './pages/Popular';
import { Saved } from './pages/Saved';
import { Article } from './pages/Article';
import { Developer } from './pages/Developer';
import { useStore } from './store/useStore';

const queryClient = new QueryClient();

function App() {
  const { settings } = useStore();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 pb-16 transition-colors duration-200`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/developer" element={<Developer />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;