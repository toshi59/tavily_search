'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Settings, Save, RotateCcw, Key, Database, Info, AlertCircle } from 'lucide-react';

interface SettingsData {
  maxResults: number;
  searchDepth: 'basic' | 'advanced';
  includeAnswer: boolean;
  autoSaveHistory: boolean;
  apiKeyStatus: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    maxResults: 20,
    searchDepth: 'basic',
    includeAnswer: false,
    autoSaveHistory: true,
    apiKeyStatus: 'unknown'
  });

  const [isLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // ローカルストレージから設定を読み込み
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    setSettings(prev => ({ ...prev, ...savedSettings }));
    
    // APIキーの状態を確認
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    try {
      const response = await fetch('/api/settings/api-key-status');
      const data = await response.json();
      setSettings(prev => ({ ...prev, apiKeyStatus: data.status }));
    } catch {
      setSettings(prev => ({ ...prev, apiKeyStatus: 'error' }));
    }
  };

  const saveSettings = async () => {
    setSaveLoading(true);
    setSaveMessage('');

    try {
      // ローカルストレージに設定を保存
      const settingsToSave = {
        maxResults: settings.maxResults,
        searchDepth: settings.searchDepth,
        includeAnswer: settings.includeAnswer,
        autoSaveHistory: settings.autoSaveHistory
      };
      
      localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
      setSaveMessage('設定が保存されました');
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('設定の保存に失敗しました');
    } finally {
      setSaveLoading(false);
    }
  };

  const resetSettings = () => {
    if (confirm('設定をデフォルトに戻しますか？')) {
      const defaultSettings = {
        maxResults: 20,
        searchDepth: 'basic' as const,
        includeAnswer: false,
        autoSaveHistory: true,
        apiKeyStatus: settings.apiKeyStatus
      };
      
      setSettings(defaultSettings);
      localStorage.removeItem('appSettings');
      setSaveMessage('設定をリセットしました');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const updateApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setSaveMessage('APIキーを入力してください');
      return;
    }

    setSaveLoading(true);
    try {
      // 実際の実装では、APIキーの更新は環境変数を通じて行うため、
      // ここではユーザーに.env.localファイルの更新を案内
      setSaveMessage('APIキーを更新するには、.env.localファイルのTAVILY_API_KEYを更新してサーバーを再起動してください');
      setShowApiKeyInput(false);
      setApiKeyInput('');
    } catch {
      setSaveMessage('APIキーの更新に失敗しました');
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const clearHistory = () => {
    if (confirm('検索履歴をすべて削除しますか？')) {
      localStorage.removeItem('searchHistory');
      setSaveMessage('検索履歴を削除しました');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const getApiKeyStatusIcon = () => {
    switch (settings.apiKeyStatus) {
      case 'valid':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'invalid':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const getApiKeyStatusText = () => {
    switch (settings.apiKeyStatus) {
      case 'valid':
        return '有効';
      case 'invalid':
        return '無効';
      default:
        return '不明';
    }
  };

  return (
    <Layout currentPage="settings">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            設定
          </h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            アプリケーションの動作を設定できます
          </p>
        </div>

        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg border ${
            saveMessage.includes('失敗') || saveMessage.includes('エラー')
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <div className="flex items-center gap-2">
              <Info size={16} />
              {saveMessage}
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* APIキー設定 */}
          <section className="bg-[var(--color-secondary)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <Key size={20} />
              APIキー設定
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--color-foreground)]">Tavily API キー</span>
                    {getApiKeyStatusIcon()}
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      ({getApiKeyStatusText()})
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Web検索機能に必要なAPIキー
                  </p>
                </div>
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showApiKeyInput ? 'キャンセル' : '更新'}
                </button>
              </div>

              {showApiKeyInput && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">重要な注意事項</p>
                      <p>APIキーを更新するには、プロジェクトルートの<code>.env.local</code>ファイルを編集し、サーバーを再起動してください。</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="新しいAPIキーを入力..."
                      className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md text-sm"
                    />
                    <button
                      onClick={updateApiKey}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      確認
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 検索設定 */}
          <section className="bg-[var(--color-secondary)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <Settings size={20} />
              検索設定
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                  最大検索結果数
                </label>
                <select
                  value={settings.maxResults}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-foreground)]"
                >
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                  <option value={30}>30件</option>
                  <option value={50}>50件</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                  検索の詳細度
                </label>
                <select
                  value={settings.searchDepth}
                  onChange={(e) => setSettings(prev => ({ ...prev, searchDepth: e.target.value as 'basic' | 'advanced' }))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-foreground)]"
                >
                  <option value="basic">基本検索</option>
                  <option value="advanced">詳細検索</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[var(--color-foreground)]">
                    回答を含める
                  </label>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    検索結果に要約回答を含める
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeAnswer}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeAnswer: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>
            </div>
          </section>

          {/* データ管理 */}
          <section className="bg-[var(--color-secondary)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <Database size={20} />
              データ管理
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[var(--color-foreground)]">
                    検索履歴の自動保存
                  </label>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    検索結果を自動的に履歴に保存
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSaveHistory}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSaveHistory: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <Database size={16} />
                  検索履歴をクリア
                </button>
              </div>
            </div>
          </section>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save size={16} />
                  設定を保存
                </>
              )}
            </button>
            
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={16} />
              リセット
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}