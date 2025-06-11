// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // OSの設定に基づいてダークモードを制御
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        primary: "#3b82f6", // 青（例: 編集）
        "primary-foreground": "#ffffff",

        destructive: "#ef4444", // 赤（例: 削除）
        "destructive-foreground": "#ffffff",

        secondary: "#64748b", // グレー系
        "secondary-foreground": "#ffffff",

        muted: "#f3f4f6",
        "muted-foreground": "#4b5563",

        input: "#e5e7eb",
        ring: "#93c5fd",

        border: "#e2e8f0", // 汎用ボーダー色

        background: "#ffffff", // 背景色（白）- ライトモード用
        "background-foreground": "#111827", // 背景上のテキスト色（濃いグレー）

        accent: "#f3f4f6", // アクセント色（薄いグレー、hover時など）
        "accent-foreground": "#1f2937", // アクセント上のテキスト色

        // ステータス関連の色
        success: "#22c55e", // 緑色（成功）
        "success-foreground": "#ffffff",

        warning: "#f59e0b", // オレンジ/黄色（警告）
        "warning-foreground": "#ffffff",

        info: "#0ea5e9", // 青色（情報）
        "info-foreground": "#ffffff",

        // ダークモード用の色を定義
        "dark-primary": "#60a5fa", // 明るい青
        "dark-primary-foreground": "#ffffff",

        "dark-destructive": "#f87171", // 明るい赤
        "dark-destructive-foreground": "#ffffff",

        "dark-secondary": "#94a3b8", // 明るいグレー
        "dark-secondary-foreground": "#ffffff",

        "dark-muted": "#1f2937",
        "dark-muted-foreground": "#9ca3af",

        "dark-input": "#374151",
        "dark-ring": "#60a5fa",

        "dark-border": "#1f2937", // ダークモード用ボーダー色

        "dark-background": "#030712", // 背景色（紺）
        "dark-background-foreground": "#f3f4f6", // 背景上のテキスト色（明るいグレー）

        "dark-accent": "#1f2937",
        "dark-accent-foreground": "#f3f4f6",

        // ダークモード用ステータス色
        "dark-success": "#4ade80", // ダークモード用緑色（成功）
        "dark-success-foreground": "#ffffff",

        "dark-warning": "#fbbf24", // ダークモード用オレンジ/黄色（警告）
        "dark-warning-foreground": "#1f2937",

        "dark-info": "#38bdf8", // ダークモード用青色（情報）
        "dark-info-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
