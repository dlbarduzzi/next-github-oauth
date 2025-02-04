import type { Config } from "tailwindcss"

import tailwindcssForms from "@tailwindcss/forms"
import tailwindcssAnimate from "tailwindcss-animate"

import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      mono: ["var(--font-geist-mono)", ...fontFamily.mono],
    },
    extend: {
      keyframes: {
        "loading-dots": {
          "0%, 80%, 100%": {
            opacity: "0",
          },
          "40%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "loading-dots": "loading-dots 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssForms, tailwindcssAnimate],
} satisfies Config
