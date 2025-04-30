現在のTRPCを使ったフルスタックのプロジェクトですが、詳しく解説してもらえませんか？
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
│   ├── trpc.server.ts
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
├── controllers
│   ├── fruit.ts
│   └── user.ts
├── index.ts
├── middleware
│   ├── auth.ts
│   └── csrf.ts
├── models
│   ├── fruit.ts
│   └── user.ts
└── trpc
    ├── context.ts
    ├── index.ts
    ├── routers
    │   ├── fruit.ts
    │   └── user.ts
    └── trpc.ts

9 directories, 26 files
```
-e 
# 📄 ファイルの中身
-e 
---
### ./client/app/routes/_index.tsx
```ts
// client/app/routes/_index.tsx

import { Link } from "@remix-run/react";
import { trpc } from "../lib/trpc";

export default function Index() {
  const { data: fruits, isLoading, error } = trpc.fruit.getFruits.useQuery();

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
            <div
              key={fruit._id.toString()}
              className="rounded border p-4 shadow-sm"
            >
              <Link
                to={`/fruits/${fruit._id}`}
                className="block hover:underline"
              >
                <h2 className="text-xl font-semibold">{fruit.name}</h2>
                <p>
                  Color:{" "}
                  <span style={{ color: fruit.color }}>{fruit.color}</span>
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
-e 
```
-e 
---
### ./client/app/routes/fruits.$id.tsx
```ts
// client/app/routes/fruits.$id.tsx
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerTRPCClient } from "../lib/trpc.server.js";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id || typeof id !== "string") {
    throw new Response("Invalid fruit ID", { status: 400 });
  }

  const trpc = createServerTRPCClient(request);
  const fruit = await trpc.fruit.getFruitById.query(id);
  return { fruit };
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
-e 
```
-e 
---
### ./client/app/lib/trpc.ts
```ts
// client/app/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/src/trpc'; 

export const trpc = createTRPCReact<AppRouter>();
-e 
```
-e 
---
### ./client/app/lib/trpc.server.ts
```ts
// client/lib/trpc.server.ts.ts

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../server/src/trpc";

export function createServerTRPCClient(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const csrfToken = cookie.match(/csrf-token=([^;]+)/)?.[1] ?? "";

  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3010/trpc",
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
              ...options?.headers,
              cookie,
              "x-csrf-token": csrfToken,
            },
          });
        },
      }),
    ],
  });

  return client;
}
-e 
```
-e 
---
### ./client/app/root.tsx
```ts
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
-e 
```
-e 
---
### ./server/src/index.ts
```ts
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
import mongoose from 'mongoose';


mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('🍃 Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
-e 
```
-e 
---
### ./server/src/trpc/index.ts
```ts
// server/src/trpc/index.ts
import { t } from "./trpc.js";
import { fruitRouter } from "./routers/fruit.js";
import { userRouter } from "./routers/user.js";

export const appRouter = t.router({
  fruit: fruitRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
-e 
```
-e 
---
### ./server/src/trpc/context.ts
```ts
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
-e 
```
-e 
---
### ./server/src/models/fruit.ts
```ts
// server/src/models/fruit.ts
import mongoose from 'mongoose';

const fruitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Fruit = mongoose.model('Fruit', fruitSchema);

export type FruitType = {
  _id: string;
  name: string;
  color: string;
  price: number;
};
-e 
```
