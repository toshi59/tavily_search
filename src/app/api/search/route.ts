import { NextRequest, NextResponse } from 'next/server';
import { TavilySearchAPIClient } from '@tavily/core';

const client = new TavilySearchAPIClient({ apiKey: process.env.TAVILY_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: '検索クエリが必要です' },
        { status: 400 }
      );
    }

    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json(
        { error: 'Tavily APIキーが設定されていません' },
        { status: 500 }
      );
    }

    const response = await client.search({
      query: query,
      max_results: 20,
      search_depth: 'basic',
      include_answer: false,
      include_raw_content: false,
      include_images: false,
    });

    const results = response.results.map((result) => ({
      title: result.title || 'タイトルなし',
      url: result.url || '',
      content: result.content || '内容なし'
    }));

    return NextResponse.json({
      results,
      query
    });

  } catch (error) {
    console.error('Tavily search error:', error);
    
    let errorMessage = '検索中にエラーが発生しました';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'APIキーが無効です';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'APIの利用制限に達しました。しばらく後に再試行してください';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}