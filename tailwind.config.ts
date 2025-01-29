import type { Config } from "tailwindcss"

import tailwindcssForms from "@tailwindcss/forms"
import tailwindcssAnimate from "tailwindcss-animate"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [tailwindcssForms, tailwindcssAnimate],
} satisfies Config
