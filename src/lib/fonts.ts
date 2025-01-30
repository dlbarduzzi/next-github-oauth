import localFont from "next/font/local"

export const fontSans = localFont({
  src: [
    {
      path: "../fonts/Rubik.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../fonts/RubikItalic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-rubik-sans",
})
