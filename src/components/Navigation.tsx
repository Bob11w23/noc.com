import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Search, Flame, Bookmark, Code } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navigation: React.FC = () => {
  const { settings } = useStore();

  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/popular', icon: Flame, label: 'Popular' },
    { to: '/saved', icon: Bookmark, label: 'Saved' },
    ...(settings.isDeveloper
      ? [{ to: '/developer', icon: Code, label: 'Developer' }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};