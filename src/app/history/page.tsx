'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { History, Trash2, Search, Calendar, RotateCcw } from 'lucide-react';

interface SearchHistoryItem {
  id: number;
  query: string;
  timestamp: string;
  resultCount: number;
}

export default function HistoryPage() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    // ローカルストレージから検索履歴を読み込み
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const clearHistory = () => {
    if (confirm('検索履歴をすべて削除しますか？')) {
      localStorage.removeItem('searchHistory');
      setSearchHistory([]);
    }
  };

  const deleteItem = (id: number) => {
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const repeatSearch = (query: string) => {
    // 検索クエリをURLパラメータとしてホームページに渡す
    window.location.href = `/?q=${encodeURIComponent(query)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout currentPage="history">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
              検索履歴
            </h1>
            <p className="text-[var(--color-muted-foreground)] text-lg">
              過去の検索履歴を確認・再実行できます
            </p>
          </div>
          {searchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              すべて削除
            </button>
          )}
        </div>

        {searchHistory.length > 0 ? (
          <div className="space-y-4">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
                      <Search size={16} className="text-[var(--color-muted-foreground)]" />
                      {item.query}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(item.timestamp)}
                      </span>
                      <span>{item.resultCount}件の結果</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => repeatSearch(item.query)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <RotateCcw size={14} />
                      再検索
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 size={14} />
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="mx-auto mb-4 text-[var(--color-muted-foreground)]" size={48} />
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
              検索履歴がありません
            </h2>
            <p className="text-[var(--color-muted-foreground)] mb-4">
              検索を実行すると、ここに履歴が表示されます
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search size={16} />
              検索を開始
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}