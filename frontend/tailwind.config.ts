import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ninersRed: "#C00000",
        ninersMaroon: "#6B0000",
        ninersGold: "#F7E37A",
        panelGray: "#5B5B5B",
      },
      boxShadow: {
        card: "0 8px 20px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
