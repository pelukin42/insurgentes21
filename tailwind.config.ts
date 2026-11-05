import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "5%" },
    extend: {
      fontFamily: {
        body: ["'Open Sans'", "sans-serif"],
        accent: ["'Instrument Serif'", "serif"],
        manrope: ["'Manrope'", "sans-serif"],
        luxurious: ["'Luxurious Script'", "cursive"],
      },
      colors: {
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        border: "hsl(var(--border))",
        brand: { green: "#4A5338", orange: "#F0603A" },
      },
      borderRadius: { DEFAULT: "var(--radius)" },
      keyframes: { marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 60s linear infinite" },
    },
  },
  plugins: [animate],
} satisfies Config;
