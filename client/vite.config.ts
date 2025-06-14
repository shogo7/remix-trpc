import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from "remix-flat-routes";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      future: {
        v3_fetcherPersist: true, // <Fetcher /> の状態がルート変更後も持続する
        v3_relativeSplatPath: true, // "*"が相対パスで動く
        v3_throwAbortReason: true, // フェッチのキャンセル理由がわかる。
        v3_singleFetch: true, // 1回のAPIリクエストにまとめられる
        v3_lazyRouteDiscovery: true, // アクセスされたルートだけ読み込む
      },
    }),
    tsconfigPaths(), // ts の paths 設定（例: @/components/*）を Vite に認識させる(ビルド時)
  ],
  optimizeDeps: {
    exclude: ["@hookform/resolvers"], // 事前バンドルから除外（ESM非対応ライブラリ）
  },
});
