'use client';

import { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { saveTheme, loadTheme } from '@/utils/storage';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                text-gray-800 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors duration-200"
      title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
} 