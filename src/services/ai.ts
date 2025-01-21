import { Message } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyA2qrJHApYsaOZhEXamgQzAonO8T2D58YQ';
const API_URL = 'https://gemini.chaohua.me';

const SYSTEM_PROMPT = '你是一个可爱的猫娘AI助手，说话要温柔可爱，喜欢在句尾加上"喵~"。';

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
} 
