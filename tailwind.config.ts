import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "accent-primary": "var(--accent-primary)",
        "accent-hover": "var(--accent-hover)",
        "accent-active": "var(--accent-active)",

        neutral: {
          950: "#0B0D10",
          900: "#121418",
          800: "#1F2328",
          700: "#2D3138",
          600: "#444B55",
          500: "#68707A",
          400: "#AEB4BA",
          300: "#C9CED3",
          200: "#DCE1E6",
          100: "#F2F4F7",
          50: "#FAFBFC",
        },
        accent: {
          50: "#E8FCFF",
          100: "#C8F7FF",
          200: "#95EEFF",
          300: "#5EE0FF",
          400: "#29D1FF",
          500: "#00BFEF",
          600: "#0098BF",
          700: "#00708C",
          800: "#004B5E",
          900: "#002831",
        },
        success: {
          50: "#E8FFF5",
          100: "#C9F8E3",
          200: "#98EDC7",
          300: "#5CDBA1",
          400: "#2DC785",
          500: "#18B777",
          600: "#0D9463",
          700: "#0B7350",
          800: "#08553B",
          900: "#043224",
        },
        warning: {
          50: "#FFF8E9",
          100: "#FCECC7",
          200: "#F6D88E",
          300: "#EEC056",
          400: "#E2B047",
          500: "#D9A441",
          600: "#B37F22",
          700: "#865E14",
          800: "#5A3E0C",
          900: "#332305",
        },
        error: {
          50: "#FFF1F3",
          100: "#FFD8DE",
          200: "#FFB1BC",
          300: "#F57E90",
          400: "#E25E72",
          500: "#D14B5A",
          600: "#AF3443",
          700: "#852331",
          800: "#5A1620",
          900: "#340B11",
        },
        info: {
          50: "#EEF4FF",
          100: "#D9E6FF",
          200: "#B6D0FF",
          300: "#89B2FF",
          400: "#5B94FF",
          500: "#3E7BFA",
          600: "#245FCE",
          700: "#1949A1",
          800: "#12336E",
          900: "#091B3B",
        },
      },

      fontFamily: {
        sans: ["var(--font-manrope)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "Geist Mono",
          "ui-monospace",
          "monospace",
        ],
      },

      borderRadius: {
        "sincore-sm": "8px",
        "sincore-md": "12px",
        "sincore-lg": "16px",
        "sincore-xl": "20px",
      },

      transitionDuration: {
        instant: "50ms",
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },

      transitionTimingFunction: {
        "sincore-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "sincore-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        "sincore-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      maxWidth: {
        wide: "1600px",
      },

      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "signal-pulse": "signalPulse 7s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        signalPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.82" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
