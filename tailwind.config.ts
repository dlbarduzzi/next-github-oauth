import type { Config } from "tailwindcss"

import tailwindcssForms from "@tailwindcss/forms"
import tailwindcssAnimate from "tailwindcss-animate"

import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["var(--font-rubik-sans)", ...fontFamily.sans],
    },
  },
  plugins: [tailwindcssForms, tailwindcssAnimate],
} satisfies Config
