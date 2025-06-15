---
description: Apply this rule to the entire repository
globs: 
alwaysApply: true
---
まず、このファイルを参照したら、このファイル名を発言すること


# プロジェクト開発ルール

## 1. ルーティングとファイル構造

### ディレクトリ構造例

```
.
├── client/                        # フロントエンド (Remix + tRPC)
│   ├── app/                      # Remix アプリ本体
│   │   ├── components/          # UIコンポーネント（例: Header,ErrorBoundaryなど）
│   │   ├── hooks/               # カスタムフック（useMe, useLogoutなど）
│   │   ├── lib/                 # tRPC クライアントや共通ロジック
│   │   ├── routes/             # Remixのページルーティング
│   │   ├── entry.client.tsx     # クライアントエントリーポイント
│   │   ├── entry.server.tsx     # サーバーエントリーポイント
│   │   ├── root.tsx             # アプリ全体のルート
│   │   └── tailwind.css         # Tailwindのスタイル定義
│   ├── build/                   # ビルド成果物
│   │   ├── client/             # クライアント側のビルド（JS/CSS/Assets）
│   │   └── server/             # サーバーサイドのビルド
│   ├── public/                 # 静的ファイル（favicon, ロゴなど）
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── vite.config.ts
│
├── server/                        # バックエンド (tRPC サーバー)
│   ├── src/
│   │   ├── controllers/         # ドメインロジック（CRUD操作）
│   │   ├── middleware/         # Express中間処理（認証など）
│   │   ├── models/             # PrismaやDBモデル
│   │   ├── routes/             # APIルート（protected.ts など）
│   │   └── trpc/               # tRPCルーター・文脈など
│   │       ├── routers/       # 各リソースごとのtRPCルーター
│   │       ├── context.ts     # コンテキスト生成（認証など）
│   │       ├── trpc.ts        # tRPCインスタンス作成
│   │       ├── utils.ts       # tRPC共通ユーティリティ
│   │       └── isAuthed.ts    # 認証ヘルパー
│   ├── types/                   # 型定義（global.d.tsなど）
│   ├── tsconfig.json
│   └── tsup.config.ts          # バンドラー設定
│
├── shared/                       # 共通モジュール（client/server間で共有）
│   ├── schemas/                # zodなどのスキーマ定義
│   ├── dateUtils.ts            # 共通ユーティリティ
│   └── index.ts                # エクスポート集約
│
├── scripts/                      # シェルスクリプトなど
│   └── make-summary.sh         # サマリー生成用スクリプト
│
├── summary.md                   # サマリードキュメント（自動生成）
├── crud.md                      # CRUD操作のまとめ
├── README.md                    # プロジェクト概要
├── package.json                 # ルートの依存定義
├── pnpm-lock.yaml
├── pnpm-workspace.yaml          # モノレポのワークスペース管理
└── tsconfig.base.json           # 共通のTypeScript設定（base）
```

### 命名規則

- ページコンポーネント: 任意の名前（例: `fruits.tsx`, `books.tsx`, `index.tsx`, `$id.tsx`）

## 2. コンポーネント設計

- コンポーネントは`client/app/components`ディレクトリに配置
- 命名規則：
  - コンポーネントファイルは`PascalCase.tsx`
  - ユーティリティファイルは`camelCase.ts`
- コンポーネントの分割基準：
  - 再利用可能な UI 部品は`common`ディレクトリに
  - ページ固有のコンポーネントは`features`ディレクトリに
  - レイアウト関連は`layouts`ディレクトリに

## 3. API 実装

### サーバーサイドデータ取得

- Remix の`loader`関数を使用してデータを取得
- tRPC の`createServerTRPCClient`を使用してサーバーサイドでデータを取得

```typescript
// app/lib/trpc.server.ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/server/trpc/routers/_app";

export function createServerTRPCClient() {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3001/trpc",
      }),
    ],
  });
}

// app/routes/books.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerTRPCClient } from "~/lib/trpc.server";

export async function loader() {
  const trpc = createServerTRPCClient();
  const books = await trpc.books.getAll.query();
  return json({ books });
}
```

### tRPC ルーター実装

- tRPC ルーターは`server/src/trpc/routers`に配置
- 命名規則：
  - ルーターファイルは`[resource].router.ts`
  - プロシージャ名は`camelCase`
- 実装ルール：
  - 入力バリデーションは`shared/schemas`の Zod スキーマを使用
  - ビジネスロジックはコントローラーに委譲
  - エラーハンドリングは統一的な形式で実装
  - 認証が必要なエンドポイントは`protectedProcedure`を使用

```typescript
// server/src/trpc/routers/book.router.ts
import { t } from "../trpc";
import * as bookController from "../../controllers/book";
import { createBookSchema, updateBookSchema } from "@shared/schemas/book";
import { protectedProcedure } from "../utils";

export const bookRouter = t.router({
  // 公開エンドポイント
  getAll: t.procedure.query(async () => {
    return await bookController.getAllBooks();
  }),

  getById: t.procedure.input(z.string().min(1)).query(async ({ input }) => {
    return await bookController.getBookById(input);
  }),

  // 認証が必要なエンドポイント
  create: protectedProcedure
    .input(createBookSchema)
    .mutation(async ({ input, ctx }) => {
      return await bookController.createBook(input, ctx.user);
    }),

  update: protectedProcedure
    .input(updateBookSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await bookController.updateBook(id, data, ctx.user);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await bookController.deleteBook(input, ctx.user);
    }),
});
```

### クライアントサイドでのデータ操作

- `react-hook-form`を使用してフォームを管理
- tRPC の`useMutation`を使用してデータを更新
- 更新成功時にデータを再取得

```typescript
// app/routes/books.tsx
import { useForm } from "react-hook-form";
import { useRevalidator } from "@remix-run/react";
import { trpc } from "~/lib/trpc";

export default function BooksPage() {
  const revalidator = useRevalidator();
  const { register, handleSubmit, reset } = useForm<BookFormData>();

  const createBook = trpc.books.create.useMutation({
    onSuccess: async () => {
      // フォームをリセット
      reset();
      // データを再取得（Remixのloaderを再実行）
      revalidator.revalidate();
    },
  });

  const onSubmit = handleSubmit((data) => {
    createBook.mutate(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          {...register("title", { required: true })}
          type="text"
          id="title"
        />
      </div>
      <div>
        <label htmlFor="author">著者</label>
        <input
          {...register("author", { required: true })}
          type="text"
          id="author"
        />
      </div>
      <div>
        <label htmlFor="publishedYear">出版年</label>
        <input
          {...register("publishedYear", {
            required: true,
            valueAsNumber: true,
            min: 1800,
            max: new Date().getFullYear(),
          })}
          type="number"
          id="publishedYear"
        />
      </div>
      <button type="submit" disabled={createBook.isPending}>
        {createBook.isPending ? "送信中..." : "登録"}
      </button>
    </form>
  );
}
```

### エラーハンドリング

- サーバーサイド：
  - tRPC のエラーハンドリングを活用
  - 適切なエラーメッセージとステータスコードを返却
- クライアントサイド：
  - `useCatch`と`ErrorBoundary`でエラーを捕捉
  - ユーザーフレンドリーなエラーメッセージを表示
  - フォームのバリデーションエラーを適切に表示

## 4. パフォーマンス最適化

### クライアントサイド最適化

### サーバーサイド最適化

- データベースクエリの最適化
- N+1 問題の回避

### 画像最適化

- Remix の`<img>`タグと`preload`を使用
- 画像の遅延読み込みには`loading="lazy"`を使用
- 重要な画像には`preload`を使用

```typescript
// app/routes/books.tsx
import { Links } from "@remix-run/react";

export function links() {
  return [
    {
      rel: "preload",
      href: "/images/hero.jpg",
      as: "image",
    },
  ];
}

export default function BooksPage() {
  return (
    <div>
      {/* 重要な画像（ヒーロー画像など） */}
      <img src="/images/hero.jpg" alt="ヒーロー画像" width={800} height={600} />

      {/* 遅延読み込みする画像 */}
      <img
        src="/images/book-cover.jpg"
        alt="本の表紙"
        width={300}
        height={400}
        loading="lazy"
      />
    </div>
  );
}
```

### スクリプト最適化

- 外部スクリプトは`<script>`タグで適切な属性を設定
- 非同期読み込みには`async`または`defer`を使用
- 動的インポートを使用して必要な時のみスクリプトを読み込み

```typescript
// app/routes/books.tsx
import { useEffect } from "react";

export default function BooksPage() {
  useEffect(() => {
    // 必要な時のみスクリプトを読み込み
    const loadScript = async () => {
      const module = await import("~/lib/analytics");
      module.initAnalytics();
    };
    loadScript();
  }, []);

  return (
    <div>
      {/* 非同期で読み込むスクリプト */}
      <script src="https://example.com/script.js" async defer />
    </div>
  );
}
```

## 5. エラーハンドリング

- クライアントサイド：
  - エラーバウンダリの実装
  - ユーザーフレンドリーなエラーメッセージ
  - フォールバック UI の提供
- サーバーサイド：
  - 統一的なエラーレスポンス形式
  - ログ記録の実装
  - エラーの分類（バリデーション、認証、システム）

## 6. 型安全性

### クライアント側

- 型定義は`shared/schemas`に配置
- 命名規則：
  - スキーマ定義ファイルは`[resource].ts`
  - 型名は`PascalCase`
  - スキーマ名は`camelCase` + `Schema`（例：`createBookSchema`）
- 実装ルール：
  - `any`型の使用を避ける
  - 厳密な型チェックの有効化
  - 型ガードの適切な使用
  - Zod スキーマから型を生成（`z.infer`を使用）

### サーバー側

- モデル定義は`server/src/models`に配置
- 命名規則：
  - モデルファイルは`[resource].ts`
  - モデル名は`PascalCase`
  - スキーマ名は`camelCase` + `Schema`
- 実装ルール：
  - Mongoose スキーマと Zod スキーマを分離
  - モデルの型定義は`shared/schemas`から生成
  - コントローラーでの型チェックを徹底

### tRPC ルーター実装

- ルーターは`server/src/trpc/routers`に配置
- 命名規則：
  - ルーターファイルは`[resource].router.ts`
  - プロシージャ名は`camelCase`
- 実装ルール：
  - 入力バリデーションは`shared/schemas`の Zod スキーマを使用
  - ビジネスロジックはコントローラーに委譲
  - エラーハンドリングは統一的な形式で実装
  - 認証が必要なエンドポイントは`protectedProcedure`を使用

```typescript
// server/src/trpc/routers/book.router.ts
import { t } from "../trpc";
import * as bookController from "../../controllers/book";
import { createBookSchema, updateBookSchema } from "@shared/schemas/book";
import { protectedProcedure } from "../utils";

export const bookRouter = t.router({
  // 公開エンドポイント
  getAll: t.procedure.query(async () => {
    return await bookController.getAllBooks();
  }),

  getById: t.procedure.input(z.string().min(1)).query(async ({ input }) => {
    return await bookController.getBookById(input);
  }),

  // 認証が必要なエンドポイント
  create: protectedProcedure
    .input(createBookSchema)
    .mutation(async ({ input, ctx }) => {
      return await bookController.createBook(input, ctx.user);
    }),

  update: protectedProcedure
    .input(updateBookSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await bookController.updateBook(id, data, ctx.user);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await bookController.deleteBook(input, ctx.user);
    }),
});
```

### コントローラー実装

- コントローラーは`server/src/controllers`に配置
- 命名規則：
  - コントローラーファイルは`[resource].ts`
  - 関数名は`camelCase`
- 実装ルール：
  - ビジネスロジックの集約
  - エラーハンドリングの実装
  - トランザクション管理
  - ログ記録

```typescript
// server/src/controllers/book.ts
import { TRPCError } from "@trpc/server";
import { Book } from "../models/book";
import type { CreateBookInput, UpdateBookInput } from "@shared/schemas/book";
import type { User } from "@shared/schemas/user";

export async function getAllBooks() {
  try {
    const books = await Book.find().lean();
    return books.map((book) => ({
      ...book,
      _id: book._id.toString(),
    }));
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch books",
    });
  }
}

export async function getBookById(id: string) {
  try {
    const book = await Book.findById(id).lean();
    if (!book) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found",
      });
    }
    return {
      ...book,
      _id: book._id.toString(),
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch book",
    });
  }
}

export async function createBook(input: CreateBookInput, user: User) {
  try {
    const book = await Book.create({
      ...input,
      createdBy: user.id,
    });
    return {
      ...book.toObject(),
      _id: book._id.toString(),
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create book",
    });
  }
}

export async function updateBook(
  id: string,
  data: UpdateBookInput,
  user: User
) {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: id, createdBy: user.id },
      { $set: data },
      { new: true }
    ).lean();

    if (!book) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found or unauthorized",
      });
    }

    return {
      ...book,
      _id: book._id.toString(),
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update book",
    });
  }
}

export async function deleteBook(id: string, user: User) {
  try {
    const book = await Book.findOneAndDelete({
      _id: id,
      createdBy: user.id,
    }).lean();

    if (!book) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found or unauthorized",
      });
    }

    return {
      ...book,
      _id: book._id.toString(),
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete book",
    });
  }
}
```

## 7. セキュリティ

- 認証・認可：
  - JWT トークンの適切な管理
  - セッション管理の実装
- データ保護：
  - 機密情報の暗号化
  - 環境変数の適切な管理
- 入力検証：
  - XSS 対策
  - CSRF 対策
  - SQL インジェクション対策

## 8. デプロイメント

- 環境設定：
  - 開発/本番環境の分離
  - 環境変数の管理
- CI/CD：
  - 自動テストの実行
  - ビルドプロセスの最適化
  - デプロイメントパイプラインの構築

## 9. メンテナンス

- コード品質：
  - ESLint ルールの遵守
  - コードフォーマットの統一
  - テストカバレッジの維持
- ドキュメント：
  - コンポーネントの使用方法
  - API 仕様書
  - デプロイメント手順
- バージョン管理：
  - セマンティックバージョニング
  - 変更履歴の管理
  - 依存関係の更新管理
