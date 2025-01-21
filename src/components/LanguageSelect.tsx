'use client';

import { useEffect } from 'react';
import { saveLanguage, loadLanguage } from '@/utils/storage';

const LANGUAGES = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',
};

interface LanguageSelectProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export default function LanguageSelect({ language, setLanguage }: LanguageSelectProps) {
  useEffect(() => {
    const savedLang = loadLanguage();
    setLanguage(savedLang);
  }, [setLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    saveLanguage(newLang);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className="p-2 rounded-lg bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-pink-500"
    >
      {Object.entries(LANGUAGES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
} 