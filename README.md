# Remix + tRPC + Express Fullstack App

このプロジェクトは、**Remix** をフロントエンドに、**Express + tRPC** をバックエンドに採用した、フルスタックWebアプリケーションです。

## 📁 ディレクトリ構成
```bash

 ├── client # Remix を使用したフロントエンドアプリ 
 ├── server # Express + tRPC を使用したバックエンドAPI 
 ├── package.json # ルートパッケージ（ワークスペース設定用）
 ├── pnpm-workspace.yaml
```


## 🚀 使用技術

- **Remix** - SSR対応のReactベースのフレームワーク
- **tRPC** - 型安全なAPI通信
- **Express** - 軽量なNode.jsサーバーフレームワーク
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **TypeScript** - 型安全なJavaScript

## 📦 セットアップ

```bash
# ルートディレクトリで依存関係をインストール
pnpm install
```

## 🔧 開発モードで起動
サーバー（Express）
```bash
cd server
pnpm dev
```

クライアント（Remix）
```bash
cd client
pnpm dev
```

クライアントとサーバーは tRPC を通して連携しています。

## ✨ 主なファイル構成
### クライアント側（client/）
```bash

app/routes/ : Remixのルーティング

app/lib/trpc.ts : tRPC クライアントの設定

app/hooks/useMe.ts : 認証状態を取得するカスタムフック

tailwind.css : Tailwind のスタイル定義
```

### サーバー側（server/）
```bash

src/trpc/ : tRPCルーターやcontextの定義

src/models/ : データモデル（例：User, Fruit）

src/middleware/auth.ts : Express ミドルウェア（認証処理）

```

## 📝 今後のTODO

・toast導入
・Mongoose のスキーマに変換ロジックを入れる
・パスワードの暗号化保存（Bcrypt）
