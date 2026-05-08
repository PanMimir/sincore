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

        // Cyberpunk palette – główne kolory projektu nullSec
        cyber: {
          black: "#0a0a0f",       // tło aplikacji
          dark: "#0f0f1a",        // karty, panele
          darker: "#13131f",      // nagłówki, sidebar
          gray: "#1a1a2e",        // obramowania, linie
          purple: "#8b5cf6",      // główny akcent (neon violet)
          "purple-bright": "#a78bfa", // hover, glow
          "purple-dim": "#4c1d95",    // tło tagów, subtelne akcenty
          cyan: "#06b6d4",        // drugorzędny akcent
          green: "#10b981",       // status "active", success
          red: "#ef4444",         // status "error", warning
          text: "#e2e8f0",        // główny tekst
          muted: "#64748b",       // tekst drugorzędny
        },
      },

      // Efekty glow – box-shadow z neonowym kolorem
      boxShadow: {
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-purple-sm": "0 0 10px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
      },

      // Czcionki – monospace dla klimatu terminala
      fontFamily: {
        // var(--font-mono) i var(--font-inter) są ustawiane przez next/font w layout.tsx
        mono: ["var(--font-mono)", "Fira Code", "Consolas", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },

      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
