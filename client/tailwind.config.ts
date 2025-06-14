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
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        border: "hsl(var(--border))",

        background: "hsl(var(--background))",
        "background-foreground": "hsl(var(--background-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",

        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",

        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",

      },
    },
  },
  plugins: [],
} satisfies Config;
