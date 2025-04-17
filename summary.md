# 📁 プロジェクト構成 (tree)
```
./client/app
├── components
│   └── Header.tsx
├── entry.client.tsx
├── entry.server.tsx
├── hooks
│   ├── useLogout.ts
│   └── useMe.ts
├── lib
│   └── trpc.ts
├── root.tsx
├── routes
│   ├── _index.tsx
│   ├── fruits.$id.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── secret.tsx
└── tailwind.css
./server/src
├── db.json
├── index.ts
├── middleware
│   ├── auth.ts
│   └── csrf.ts
├── models
│   ├── fruit.ts
│   └── user.ts
└── trpc
    ├── a.ts
    ├── context.ts
    └── index.ts

7 directories, 22 files
```
-e 
# 📄 ファイル中身
-e \n---\n### ./client/app/entry.server.tsx\n```ts
/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from "node:stream";

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
-e \n```
-e \n---\n### ./client/app/entry.client.tsx\n```ts
// client/app/entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { trpc } from "./lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson"; 

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
      transformer: superjson,
    }),
  ],
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RemixBrowser />
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
});
-e \n```
-e \n---\n### ./client/app/components/Header.tsx\n```ts
// client/app/components/Header.tsx
import { Link } from '@remix-run/react';
import { useMe } from '../hooks/useMe';
import { useLogout } from '../hooks/useLogout';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading,  } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.clear(); 
  };

  return (
    <header className="bg-gray-900 p-4 shadow-sm mb-4 flex justify-between items-center">
      {isLoading ? (
        <span>読み込み中...</span>
      ) : user ? (
        <>
          <div className="flex items-center space-x-4">
            <span className="text-green-600 font-semibold">{user.username} さん、ようこそ！</span>
            <Link to="/secret" className="text-blue-400 hover:underline">
              Secretページ
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </>
      ) : (
        <span className="text-red-500">ログインしてください</span>
      )}
    </header>
  );
};

export default Header;
-e \n```
-e \n---\n### ./client/app/root.tsx\n```ts
// client/app/root.tsx

import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "./lib/trpc";
import "./tailwind.css";
import Header from "./components/Header";
import Cookies from "js-cookie"; // これを追加！

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3010/trpc",
        transformer: superjson,
        fetch(url, options) {
          const csrfToken = Cookies.get("csrf-token"); // クッキーから取得
          return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
              ...options?.headers,
              "x-csrf-token": csrfToken || "", 
            },
          });
        },
      }),
    ],
  });
  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
-e \n```
-e \n---\n### ./client/app/hooks/useLogout.ts\n```ts
// client/app/hooks/useLogout.ts
import { trpc } from '../lib/trpc';

export const useLogout = () => {
  return trpc.user.logout.useMutation();
};
-e \n```
-e \n---\n### ./client/app/hooks/useMe.ts\n```ts
// client/app/hooks/useMe.ts
import { trpc } from "../lib/trpc";

export const useMe = () => {
  return trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
};
-e \n```
-e \n---\n### ./client/app/lib/trpc.ts\n```ts
// client/app/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/src/trpc'; 

export const trpc = createTRPCReact<AppRouter>();
-e \n```
-e \n---\n### ./client/app/routes/login.tsx\n```ts
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();
  const mutation = trpc.user.login.useMutation();
  const queryClient = useQueryClient(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ username, password });
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      alert("ログイン成功！");
      navigate("/");
    } catch (err) {
      alert("ログイン失敗：" + (err as Error).message);
    }
  };


  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}
-e \n```
-e \n---\n### ./client/app/routes/fruits.$id.tsx\n```ts
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { appRouter } from "../../../server/src/trpc/index.js";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);

  if (!params.id || isNaN(id)) {
    throw new Response("Invalid fruit ID", { status: 400 });
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  try {
    const fruit = await helpers.getFruitById.fetch(id);
    return ({ fruit });
  } catch (error) {
    console.error(`Error loading fruit ${id}:`, error);
    throw new Response("Fruit not found", { status: 404 });
  }
}

export default function FruitDetail() {
  const { fruit } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to fruits list
      </Link>
      <div className="mt-4 p-6 border rounded shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{fruit.name}</h1>
        <p className="text-lg mb-2">
          Color: <span style={{ color: fruit.color }}>{fruit.color}</span>
        </p>
        <p className="text-lg mb-2">Price: {fruit.price} </p>
      </div>
    </div>
  );
}
-e \n```
-e \n---\n### ./client/app/routes/register.tsx\n```ts
// client/app/routes/register.tsx
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useNavigate } from "@remix-run/react";

export default function Register() {
  const navigate = useNavigate();
  const mutation = trpc.user.register.useMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ username, password });
      alert("登録完了！");
      navigate("/"); // トップページなどに遷移
    } catch (err) {
      alert("登録失敗：" + (err as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ユーザー登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}
-e \n```
-e \n---\n### ./client/app/routes/secret.tsx\n```ts
// client/app/routes/secret.tsx
import { useMe } from "../hooks/useMe";
import { Link } from "@remix-run/react";

export default function SecretPage() {
  const { data: me, isLoading, error } = useMe();

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">このページはログインが必要です。</p>
        <Link to="/login" className="text-blue-500 underline">
          ログインへ
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Secret Page 🔐</h1>
      <p>こんにちは、<span className="font-semibold">{me.username}</span> さん！</p>
      <p>このページはログインユーザーしか見れません。</p>
    </div>
  );
}
-e \n```
-e \n---\n### ./client/app/routes/_index.tsx\n```ts
// client/app/routes/_index.tsx

import { Link } from '@remix-run/react';
import { trpc } from '../lib/trpc';

export default function Index() {
  const { data: fruits, isLoading, error } = trpc.getFruits.useQuery();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end space-x-4 mb-4">
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>

      <h1 className="mb-4 text-2xl font-bold">Fruit List</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!fruits || fruits.length === 0 ? (
        <p>No fruits available</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fruits.map((fruit) => (
            <div key={fruit.id} className="rounded border p-4 shadow-sm">
              <Link to={`/fruits/${fruit.id}`} className="block hover:underline">
                <h2 className="text-xl font-semibold">{fruit.name}</h2>
                <p>
                  Color: <span style={{ color: fruit.color }}>{fruit.color}</span>
                </p>
                <p>Price: {fruit.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
-e \n```
-e \n---\n### ./server/src/middleware/csrf.ts\n```ts
// server/src/middleware/csrf.ts
import { randomBytes } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = randomBytes(32).toString('hex');

  // サーバーが CSRF トークンをクッキーにセット
  res.cookie('csrf-token', token, {
    httpOnly: false, // JS からアクセス可能にする
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  // 次の middleware / handler で使えるようにする
  (req as any).csrfToken = token;

  next();
}
-e \n```
-e \n---\n### ./server/src/middleware/auth.ts\n```ts
// server/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
      req.user = { id: decoded.id, username: decoded.username };
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }
  next();
}
-e \n```
-e \n---\n### ./server/src/db.json\n```ts
{
  "users": [
    {
      "id": "KVLnXSMduxpU3ObVsKPS7",
      "username": "shogo",
      "password": "aiueo"
    }
  ]
}
-e \n```
-e \n---\n### ./server/src/trpc/context.ts\n```ts
// server/src/trpc/context.ts
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export function createContext({ req, res }: CreateExpressContextOptions) {
  const csrfHeader = req.headers['x-csrf-token'];
  const csrfCookie = req.cookies['csrf-token'];


  if (req.method !== 'GET' && csrfHeader !== csrfCookie) {
    throw new Error('CSRF token mismatch');
  }

  return {
    req,
    res,
    user: req.user,
  };
}

export type Context = ReturnType<typeof createContext>;
-e \n```
-e \n---\n### ./server/src/trpc/a.ts\n```ts
import type { Request } from 'express';

const test = (req: Request) => {
  req.user // ← ここで補完が出れば成功！
};
-e \n```
-e \n---\n### ./server/src/trpc/index.ts\n```ts
// server/src/trpc/index.ts

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { fruits } from "../models/fruit.js";
import superjson from "superjson";
import * as userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import type { Context } from "./context.js";
import type { Response as ExpressResponse } from "express";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getFruits: t.procedure.query(() => {
    return fruits;
  }),
  getFruitById: t.procedure.input(z.number()).query((opts) => {
    const fruit = fruits.find((f) => f.id === opts.input);
    if (!fruit) throw new Error("Not found");
    return fruit;
  }),
  user: t.router({
    register: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        return await userModel.registerUser(input.username, input.password);
      }),
    login: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await userModel.loginUser(input.username, input.password);

        // JWT発行
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        // Cookieにセット
        const res = ctx.res as ExpressResponse;
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: false, // 本番ではtrueにする（HTTPSのみ）
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { id: user.id, username: user.username };
      }),
    logout: t.procedure.mutation(({ ctx }) => {
      const res = ctx.res as ExpressResponse;

      res.clearCookie("jwt", {
        httpOnly: true,
        secure: false, // 本番はtrue
        sameSite: 'strict',
      });

      return { success: true };
    }),

    me: t.procedure.query(({ ctx }) => {
      if (!ctx.user) throw new Error("未ログインです");
      return ctx.user;
    }),
  }),
});

export type AppRouter = typeof appRouter;
-e \n```
-e \n---\n### ./server/src/models/user.ts\n```ts
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const dbUrl = new URL('../db.json', import.meta.url); 

// Zodスキーマと型を一体化
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(1),
  password: z.string().min(1),
});
export type User = z.infer<typeof UserSchema>;

async function readDB(): Promise<{ users: User[] }> {
  try {
    const data = await fs.readFile(dbUrl, 'utf-8');
    if (!data.trim()) return { users: [] };

    const parsed = JSON.parse(data);
    // バリデーション（必要であれば）
    if (!Array.isArray(parsed.users)) return { users: [] };

    // データ型保証（オプション）
    const validatedUsers = parsed.users.map((u: any) => UserSchema.parse(u));
    return { users: validatedUsers };
  } catch (err: any) {
    if (err.code === 'ENOENT') return { users: [] };
    throw err;
  }
}

async function writeDB(data: { users: User[] }) {
  await fs.writeFile(dbUrl, JSON.stringify(data, null, 2), 'utf-8');
}

export async function registerUser(username: string, password: string): Promise<User> {
  const db = await readDB();

  if (db.users.find((u) => u.username === username)) {
    throw new Error('ユーザー名はすでに使われています');
  }

  const user = UserSchema.parse({
    id: nanoid(),
    username,
    password,
  });

  db.users.push(user);
  await writeDB(db);
  return user;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const db = await readDB();
  const user = db.users.find((u) => u.username === username && u.password === password);

  if (!user) {
    throw new Error('ユーザー名またはパスワードが間違っています');
  }

  return user;
}
-e \n```
-e \n---\n### ./server/src/models/fruit.ts\n```ts
export interface Fruit {
  id: number;
  name: string;
  color: string;
  price: number;
}

// Sample data
export const fruits: Fruit[] = [
  { id: 1, name: 'Apple', color: 'Red', price: 200 },
  { id: 2, name: 'Banana', color: 'Yellow', price: 100 },
  { id: 3, name: 'Grapes', color: 'Purple', price: 300 },
  { id: 4, name: 'Orange', color: 'Orange', price: 150 },
  { id: 5, name: 'Strawberry', color: 'Red', price: 400 }
];
-e \n```
-e \n---\n### ./server/src/index.ts\n```ts
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { appRouter } from './trpc/index.js';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { authMiddleware } from './middleware/auth.js';
import { csrfMiddleware } from './middleware/csrf.js';
import cookieParser from 'cookie-parser';
import { createContext } from './trpc/context.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3010;

app.use(cookieParser());
app.use(authMiddleware);
app.use(csrfMiddleware);


app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

app.listen(PORT, () => {
  console.log(`🚀 tRPC API running at http://localhost:${PORT}/trpc`);
});
-e \n```
