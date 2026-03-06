import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        background: "#0A0A0F",
        foreground: "#F0F0F5",
        primary: {
          DEFAULT: "#00E89D",
          dim: "#00C584",
        },
        secondary: "#7B61FF",
        muted: "#8888A0",
        border: "#1E1E2E",
      },
    },
  },
  plugins: [],
}

export default config
