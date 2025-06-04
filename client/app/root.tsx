// client/app/root.tsx

import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useLocation,
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

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-container {
            max-width: 32rem;
            width: 100%;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin: 1rem;
          }
          .error-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 1rem;
          }
          .error-message {
            color: #4b5563;
            margin-bottom: 1rem;
          }
          .error-details {
            background-color: #f3f4f6;
            border-radius: 0.25rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
          }
          .error-details p {
            font-size: 0.875rem;
            color: #1f2937;
            margin: 0;
          }
          .error-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            text-decoration: none;
            text-align: center;
          }
          .error-button:hover {
            background-color: #1d4ed8;
          }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <h2 className="error-title">アプリケーションエラー</h2>

          <p className="error-message">
            申し訳ありません。予期せぬエラーが発生しました。
          </p>

          <div className="error-details">
            <p>
              {error instanceof Error
                ? error.message
                : "不明なエラーが発生しました"}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="/" className="error-button">
              トップページに戻る
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // const location = useLocation();
  // テスト用のエラー発生
  // const shouldThrowError =
  //   new URL(
  //     location.pathname + location.search,
  //     "http://localhost"
  //   ).searchParams.get("error") === "true";
  // if (shouldThrowError) {
  //   throw new Error("ルートレベルでのテストエラーですよ");
  // }

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
