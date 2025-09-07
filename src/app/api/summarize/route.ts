import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, results }: { query: string; results: SearchResult[] } = await request.json();

    if (!query || !results || results.length === 0) {
      return NextResponse.json(
        { error: 'クエリと検索結果が必要です' },
        { status: 400 }
      );
    }

    // 検索結果の内容を結合して要約用テキストを作成
    const combinedContent = results
      .slice(0, 10) // 最初の10件のみを使用
      .map(result => `【${result.title}】\n${result.content}`)
      .join('\n\n');

    // 簡易的なサマリ生成（実際のAI APIを使用する場合はここを置き換え）
    const summary = await generateSummary(query, combinedContent);

    return NextResponse.json({
      summary,
      query,
      sourceCount: results.length
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    
    return NextResponse.json(
      { error: 'サマリ生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

async function generateSummary(query: string, content: string): Promise<string> {
  // 簡易的なサマリ生成ロジック
  // 実際のプロジェクトではOpenAI GPT、Claude、Geminiなどを使用
  
  const sentences = content
    .split(/[。！？\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 15); // 最初の15文

  const keyTerms = extractKeyTerms(query, content);
  
  const summary = `「${query}」に関する検索結果のサマリ：

${keyTerms.length > 0 ? `主要キーワード: ${keyTerms.join('、')}\n\n` : ''}重要なポイント:
${sentences.slice(0, 5).map((sentence, index) => `${index + 1}. ${sentence.substring(0, 150)}${sentence.length > 150 ? '...' : ''}`).join('\n')}

${sentences.length > 5 ? `\nその他の関連情報として、${sentences.slice(5, 10).join('。')}。` : ''}

この情報は${new Date().toLocaleDateString('ja-JP')}時点での検索結果に基づいています。`;

  // 500文字程度に調整
  return summary.length > 500 ? summary.substring(0, 497) + '...' : summary;
}

function extractKeyTerms(query: string, content: string): string[] {
  // 簡易的なキーワード抽出
  const queryTerms = query.split(/[\s　]+/).filter(term => term.length > 1);
  const contentWords = content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w]{3,}/g) || [];
  
  const frequency: { [key: string]: number } = {};
  
  contentWords.forEach(word => {
    const normalized = word.toLowerCase();
    frequency[normalized] = (frequency[normalized] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .filter(([word, count]) => count > 2 && !queryTerms.includes(word))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}