// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
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

        background: "#030712", // 背景色（紺）
        "background-foreground": "#111827", // 背景上のテキスト色（濃いグレー）

        accent: "#f3f4f6", // アクセント色（薄いグレー、hover時など）
        "accent-foreground": "#1f2937", // アクセント上のテキスト色
      },
    },
  },
  plugins: [],
} satisfies Config;
