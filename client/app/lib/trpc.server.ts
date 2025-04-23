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
        transformer: superjson, // ✅ ここに移動！
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
