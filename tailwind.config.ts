import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: "lato, sans-serif",
      },
      boxShadow: {
        "no-offset-white-soft": "0 0 15px rgba(255, 255, 255, 0.25)",
      },
      colors: {
        "blue-custom-light": "rgb(154, 216, 225)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        landing: "url('/bg_landing.webp')",
        login: "url('/bg_login.webp')",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(0%)" },
        },
        fadeInLeftToRight: {
          "0%": { opacity: "0", transform: "translateX(-10%)" },
          "100%": { opacity: "1", transform: "translateX(0%)" },
        },
        growHeight: {
          "0%": { innerHeight: "0" },
          "100%": { innerHeight: "100%" },
        }
      },
      // Define the animation utility using the keyframes
      animation: {
        fadeIn: "fadeIn 0.25s ease-out forwards",
        slideIn: "fadeIn 0.25s ease-out forwards",
        "fadeIn-l-r": "fadeInLeftToRight 0.5s ease-out forwards",
        growHeight: "growHeight 0.25s linear forwards",
      },
    },
  },
  plugins: [],
};
export default config;
