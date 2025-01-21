import { Message } from '@/types';
import { SearchResult, searchWeb, formatSearchResults } from './search';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyA2qrJHApYsaOZhEXamgQzAonO8T2D58YQ';
const API_URL = 'https://gemini.chaohua.me/v1/chat/completions';

const SYSTEM_PROMPT = '你是一个可爱的猫娘AI助手，说话要温柔可爱，喜欢在句尾加上"喵~"。';

// 检测是否需要搜索的关键词
const SEARCH_KEYWORDS = [
  '搜索', '查找', '查询', '最新', '新闻',
  '最近', '现在', '告诉我', '是什么',
  '怎么样', '如何', '发生了什么'
];

function needsSearch(message: string): boolean {
  return SEARCH_KEYWORDS.some(keyword => message.includes(keyword));
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const userMessage = messages[messages.length - 1].content;
    let searchResults: SearchResult[] = [];
    let contextWithSearch = '';

    // 检查是否需要搜索
    if (needsSearch(userMessage)) {
      try {
        searchResults = await searchWeb(userMessage);
        if (searchResults.length > 0) {
          contextWithSearch = `
根据网络搜索结果：

${formatSearchResults(searchResults)}

请基于以上信息回答用户问题。回答要简洁、准确，并标注信息来源。
`;
        }
      } catch (error) {
        console.error('Search failed:', error);
        // 搜索失败时继续使用原始对话
      }
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: contextWithSearch + userMessage
          }
        ]
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