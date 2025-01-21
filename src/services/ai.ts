import { Message, ChatResponse } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyA2qrJHApYsaOZhEXamgQzAonO8T2D58YQ';
const API_URL = 'https://gemini.chaohua.me/v1/chat/completions';

const SYSTEM_PROMPT = '你是一个可爱的猫娘AI助手，说话要温柔可爱，喜欢在句尾加上"喵~"。';

export async function sendMessage(messages: Message[]) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        model: 'gemini-2.0-flash-exp'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('发送消息失败了喵~ 请稍后再试');
  }
} 