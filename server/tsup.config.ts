// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // エントリーポイント
  outDir: 'dist',          // 出力先
  target: 'node18',        // Node.js バージョンに合わせて設定
  format: ['esm'],         // ESM出力（package.jsonに "type": "module" があるため）
  splitting: false,        // ESMで true にすると複数ファイルに分かれるが、単一にしたい場合は false
  sourcemap: true,         // ソースマップ付き（デバッグ用）
  clean: true,             // 出力ディレクトリをクリーンしてからビルド
  dts: false               // 型定義ファイルを出力したい場合は true（通常は外部共有用）
});
