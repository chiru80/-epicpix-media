import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", "class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts}",
    "./scripts/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: "hsl(var(--accent))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        epicpix: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eaeaea",
          300: "#d4d4d4",
          400: "#9e9e9e",
          500: "#6b6b6b",
          600: "#525252",
          700: "#3d3d3d",
          800: "#282828",
          900: "#171717",
          950: "#0c0c0c",
        },
      },
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius-lg, 8px)",
        md: "var(--radius-md, 4px)",
        sm: "var(--radius-sm, 2px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%, 70%, 100%": { opacity: "1" },
          "20%, 40%, 60%": { opacity: "0.9" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out",
        "border-beam": "border-beam 2s infinite",
        "marquee": "marquee var(--duration, 25s) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration, 25s) linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
