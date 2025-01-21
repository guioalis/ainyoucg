import { Message } from '@/types';

const STORAGE_KEY = 'chat_messages';
const THEME_KEY = 'theme_preference';
const LANG_KEY = 'language_preference';

export function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): 'light' | 'dark' {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
}

export function saveLanguage(lang: string): void {
  localStorage.setItem(LANG_KEY, lang);
}

export function loadLanguage(): string {
  return localStorage.getItem(LANG_KEY) || 'zh-CN';
} 