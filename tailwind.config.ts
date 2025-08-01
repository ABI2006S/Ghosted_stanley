import type { Config } from "tailwindcss"

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Retro colors for Stanley's Desktop
        retro: {
          gray: {
            100: "#f0f0f0",
            200: "#e0e0e0",
            300: "#c0c0c0",
            400: "#a0a0a0",
            500: "#808080",
            600: "#606060",
            700: "#404040",
            800: "#202020",
            900: "#000000",
          },
          green: {
            100: "#e0ffe0",
            200: "#c0ffc0",
            300: "#80ff80",
            400: "#40ff40",
            500: "#00ff00",
            600: "#00e000",
            700: "#00c000",
            800: "#00a000",
            900: "#008000",
          },
          blue: {
            100: "#e0e0ff",
            200: "#c0c0ff",
            300: "#8080ff",
            400: "#4040ff",
            500: "#0000ff",
            600: "#0000e0",
            700: "#0000c0",
            800: "#0000a0",
            900: "#000080",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "crt-flicker": {
          "0%": { opacity: "1" },
          "98%": { opacity: "1" },
          "99%": { opacity: "0.98" },
          "100%": { opacity: "1" },
        },
        "retro-blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "static-noise": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "10%": { transform: "translateX(-1px) translateY(1px)" },
          "20%": { transform: "translateX(1px) translateY(-1px)" },
          "30%": { transform: "translateX(-1px) translateY(1px)" },
          "40%": { transform: "translateX(1px) translateY(-1px)" },
          "50%": { transform: "translateX(-1px) translateY(-1px)" },
          "60%": { transform: "translateX(1px) translateY(1px)" },
          "70%": { transform: "translateX(-1px) translateY(-1px)" },
          "80%": { transform: "translateX(1px) translateY(1px)" },
          "90%": { transform: "translateX(-1px) translateY(1px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "crt-flicker": "crt-flicker 0.15s infinite linear alternate",
        "retro-blink": "retro-blink 1s infinite",
        "static-noise": "static-noise 0.1s infinite",
      },
      fontFamily: {
        retro: ["MS Sans Serif", "sans-serif"],
        terminal: ["Courier New", "monospace"],
      },
      boxShadow: {
        "retro-inset": "inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.7)",
        "retro-outset": "2px 2px 4px rgba(0,0,0,0.3), -2px -2px 4px rgba(255,255,255,0.7)",
        "retro-window": "2px 2px 10px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
