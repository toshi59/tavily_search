import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'invalid',
        message: 'APIキーが設定されていません'
      });
    }

    if (apiKey === 'your_tavily_api_key_here') {
      return NextResponse.json({
        status: 'invalid',
        message: 'デフォルトのAPIキーが設定されています'
      });
    }

    // 簡単なバリデーション（実際のキーの形式に応じて調整）
    if (apiKey.length < 10) {
      return NextResponse.json({
        status: 'invalid',
        message: 'APIキーの形式が正しくありません'
      });
    }

    return NextResponse.json({
      status: 'valid',
      message: 'APIキーが設定されています'
    });

  } catch (error) {
    console.error('API key status check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'APIキーの状態確認中にエラーが発生しました'
    });
  }
}