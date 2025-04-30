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
### ./package.json
```ts
{
  "name": "remix-trpc",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "client",
    "server",
    "shared"
  ],
  "scripts": {
    "dev": "pnpm --filter client dev & pnpm --filter server dev",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.31.1",
    "@typescript-eslint/parser": "^8.31.1",
    "eslint": "^8.38.0",
    "eslint-import-resolver-typescript": "^3.6.1",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
-e 
```
-e 
---
### ./pnpm-workspace.yaml
```ts
packages:
  - './client'
  - './server'
  - './shared'

-e 
```
-e 
---
### ./tsconfig.base.json
```ts
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler", // Client向け（serverでは上書き可）
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
        "@client/*": ["client/app/*"],
        "@server/*": ["server/src/*"],
        "@shared/*": ["shared/*"]
      },
  
    "noEmit": true
  }
}
-e 
```
-e 
---
### ./shared/tsconfig.json
```ts
{
    "extends": "../tsconfig.base.json",
    "include": ["**/*.ts", "dateUtils.ts"]
  }
  -e 
```
-e 
---
### ./shared/package.json
```ts
{
  "name": "shared",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "main": "index.ts",
  "dependencies": {
    "dayjs": "^1.11.13",
    "zod": "^3.24.2"
  }
}-e 
```
-e 
---
### ./client/package.json
```ts
{
  "name": "client",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "build": "remix vite:build",
    "dev": "remix vite:dev",
    "lint": "eslint --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .",
    "start": "remix-serve ./build/server/index.js",
    "typecheck": "tsc"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@remix-run/node": "^2.16.5",
    "@remix-run/react": "^2.16.5",
    "@remix-run/serve": "^2.16.5",
    "@tanstack/react-query": "^5.72.2",
    "@trpc/client": "^11.0.4",
    "@trpc/react-query": "^11.0.4",
    "@trpc/server": "^11.0.4",
    "@types/js-cookie": "^3.0.6",
    "isbot": "^4.1.0",
    "js-cookie": "^3.0.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.56.1",
    "sonner": "^2.0.3",
    "superjson": "^2.2.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@remix-run/dev": "^2.16.5",
    "@types/react": "^18.2.20",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.7.4",
    "@typescript-eslint/parser": "^6.7.4",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.38.0",
    "eslint-import-resolver-typescript": "^3.6.1",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.1.6",
    "vite": "^6.0.0",
    "vite-tsconfig-paths": "^4.2.1"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
-e 
```
-e 
---
### ./client/tsconfig.json
```ts
// client/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "types": ["@remix-run/node", "vite/client"],
    "moduleResolution": "Bundler", // Vite に最適な形式,
  },
}
-e 
```
-e 
---
### ./client/app/routes/_index.tsx
```ts
// client/app/routes/_index.tsx

import { Link } from "@remix-run/react";
import { trpc } from "../lib/trpc";
import { formatDate } from "@shared/dateUtils";

export default function Index() {
  const { data: fruits, isLoading, error } = trpc.fruit.getFruits.useQuery();
  const today = formatDate(new Date());


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
      <div>Today is {today}</div>
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
import type { AppRouter } from '@server/trpc'; 

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
import type { AppRouter } from "@server/trpc";

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
import Cookies from "js-cookie"; 
import { Toaster } from "sonner";

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
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
-e 
```
-e 
---
### ./server/package.json
```ts
{
  "name": "server",
  "version": "1.0.0",
  "description": "Fruit API server",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "type": "module",
  "main": "./dist/index.js",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@trpc/client": "^11.0.4",
    "@trpc/react-query": "^11.0.4",
    "@trpc/server": "^11.0.4",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.13.2",
    "nanoid": "^5.1.5",
    "superjson": "^2.2.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/cookie-parser": "^1.4.8",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^18.15.11",
    "ts-node-dev": "^2.0.0",
    "tsx": "^4.19.3",
    "typescript": "^5.0.4"

  }
}
-e 
```
-e 
---
### ./server/tsconfig.json
```ts
// server/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "typeRoots": ["./node_modules/@types", "./types"],
  },
  "include": ["src", "types"]
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
