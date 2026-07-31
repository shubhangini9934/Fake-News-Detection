/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 45px rgba(14, 165, 233, 0.18)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(249, 115, 22, 0)" }
        }
      },
      animation: {
        marquee: "marquee 48s linear infinite",
        pulseBorder: "pulseBorder 2.4s infinite"
      }
    }
  },
  plugins: []
};
