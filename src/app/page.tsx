'use client';

import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search, Loader2, FileText, Sparkles } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

export default function Home() {
  const {
    query,
    setQuery,
    results,
    setResults,
    isLoading,
    setIsLoading,
    progress,
    setProgress,
    summary,
    setSummary,
    summaryLoading,
    setSummaryLoading,
  } = useSearch();

  useEffect(() => {
    // URLパラメータから検索クエリを取得（履歴からの再検索用）
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      // URLを清潔にする
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setResults([]);
    setSummary('');

    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        
        // 検索履歴に保存
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const newEntry = {
          id: Date.now(),
          query,
          timestamp: new Date().toISOString(),
          resultCount: data.results.length
        };
        searchHistory.unshift(newEntry);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 50))); // 最新50件まで保存

        // サマリを生成
        if (data.results.length > 0) {
          generateSummary(query, data.results);
        }
      } else {
        console.error('Search error:', data.error);
        alert('検索でエラーが発生しました: ' + data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('検索でエラーが発生しました。ネットワーク接続を確認してください。');
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }
  };

  const generateSummary = async (searchQuery: string, searchResults: { title: string; url: string; content: string }[]) => {
    setSummaryLoading(true);
    setSummary('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          results: searchResults
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        console.error('Summary generation error:', data.error);
        setSummary('サマリの生成中にエラーが発生しました。');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      setSummary('サマリの生成中にエラーが発生しました。');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <Layout currentPage="home">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            Tavily Web検索
          </h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            キーワードを入力してWeb上の情報を検索します
          </p>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索キーワードを入力してください..."
                className="w-full px-4 py-3 pl-12 border border-[var(--color-border)] rounded-lg bg-[var(--color-input)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent"
                disabled={isLoading}
              />
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-muted-foreground)]" 
                size={20} 
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  検索中...
                </>
              ) : (
                <>
                  <Search size={20} />
                  検索
                </>
              )}
            </button>
          </div>
        </form>

        {/* プログレスバー */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[var(--color-muted-foreground)] mb-2">
              <span>検索中...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[var(--color-muted)] rounded-full h-2">
              <div
                className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* サマリ表示エリア */}
        {(summary || summaryLoading) && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-[var(--color-primary)]" size={20} />
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                AI サマリ
              </h2>
              {summaryLoading && (
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={16} />
              )}
            </div>
            
            {summaryLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
                <div className="h-4 bg-blue-100 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-blue-100 rounded animate-pulse w-3/5"></div>
                <p className="text-sm text-[var(--color-muted-foreground)] italic">
                  検索結果を分析してサマリを生成しています...
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-[var(--color-foreground)] leading-relaxed">
                  {summary}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-200">
                  <FileText size={14} className="text-[var(--color-muted-foreground)]" />
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    {results.length}件の検索結果から生成
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 検索結果 */}
        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
              検索結果 ({results.length}件)
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-[var(--color-foreground)] mb-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-[var(--color-muted-foreground)] text-sm mb-2">
                    {result.url}
                  </p>
                  <p className="text-[var(--color-foreground)] leading-relaxed">
                    {result.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 初期状態のメッセージ */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto mb-4 text-[var(--color-muted-foreground)]" size={48} />
            <p className="text-[var(--color-muted-foreground)] text-lg">
              {query 
                ? `「${query}」の検索結果がありません` 
                : 'キーワードを入力して検索を開始してください'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
