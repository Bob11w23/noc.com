import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ onClose }) => {
  const { settings, updateSettings } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDeveloperAccess = () => {
    if (password === 'llovera.studios2024') {
      updateSettings({ isDeveloper: true });
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select
              value={settings.fontSize}
              onChange={(e) =>
                updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })
              }
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-300 p-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Show Images
            </label>
            <input
              type="checkbox"
              checked={settings.showImages}
              onChange={(e) => updateSettings({ showImages: e.target.checked })}
              className="rounded border-gray-300"
            />
          </div>

          {!settings.isDeveloper && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Developer Access
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 rounded-md border border-gray-300 p-2"
                />
                <button
                  onClick={handleDeveloperAccess}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Access
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};