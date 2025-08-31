# Tavily Web検索アプリ

Tavilyを使用したWeb検索アプリケーションです。Next.jsで構築されており、Vercelでのデプロイに最適化されています。

## 機能

- 🔍 **Web検索**: Tavily APIを使用したリアルタイム検索
- 📊 **プログレスバー**: 検索進行状況の視覚的表示
- 📋 **検索履歴**: 過去の検索を保存・再実行
- ⚙️ **設定管理**: 検索オプションやAPIキーの管理
- 📱 **レスポンシブデザイン**: モバイル・デスクトップ対応
- 🎨 **フラットデザイン**: モダンでクリーンなUI

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、Tavily APIキーを設定してください：

```env
TAVILY_API_KEY=your_actual_tavily_api_key_here
```

Tavily APIキーは[Tavily公式サイト](https://tavily.com)で取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは`http://localhost:3000`で利用できます。

## デプロイ（Vercel）

1. GitHubリポジトリを作成し、プロジェクトをプッシュ
2. Vercelアカウントでリポジトリを接続
3. 環境変数`TAVILY_API_KEY`をVercelの設定で追加
4. デプロイを実行

## 使用技術

- **Next.js 15**: Reactフレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: スタイリング
- **Tavily API**: Web検索エンジン
- **Lucide React**: アイコンライブラリ

## プロジェクト構造

```
src/
├── app/
│   ├── api/
│   │   ├── search/          # 検索API
│   │   └── settings/        # 設定API
│   ├── history/             # 検索履歴ページ
│   ├── settings/            # 設定ページ
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
└── components/
    └── Layout.tsx           # レイアウトコンポーネント
```

## カラーパレット

アプリケーションは以下のカラーパレットを使用：

- **Background**: #ffffff
- **Foreground**: #0f172a
- **Primary**: #1e40af
- **Secondary**: #f1f5f9
- **Muted**: #64748b
- **Border**: #e2e8f0

## 注意事項

- APIキーは`.env.local`ファイルに保存し、GitHubにコミットしないでください
- 検索履歴はブラウザのローカルストレージに保存されます
- API利用制限に注意してご使用ください
