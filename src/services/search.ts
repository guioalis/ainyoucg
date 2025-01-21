const SERPER_API_KEY = process.env.NEXT_PUBLIC_SERPER_API_KEY;
const SERPER_API_URL = 'https://google.serper.dev/search';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source?: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(SERPER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SERPER_API_KEY || '',
      },
      body: JSON.stringify({
        q: query,
        gl: 'cn', // 地区代码
        hl: 'zh-cn', // 语言
        num: 5 // 结果数量
      })
    });

    if (!response.ok) {
      throw new Error('搜索请求失败');
    }

    const data = await response.json();
    
    // 处理搜索结果
    const results: SearchResult[] = data.organic.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date,
      source: item.source
    }));

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export function formatSearchResults(results: SearchResult[]): string {
  return results.map((result, index) => {
    return `[${index + 1}] ${result.title}\n${result.snippet}\n来源: ${result.link}\n`;
  }).join('\n');
} 