import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0a0a0a",
          50: "#18181b",
          100: "#141416",
          200: "#111113",
          300: "#0e0e10",
          400: "#0c0c0d",
          500: "#0a0a0a",
          600: "#080808",
          700: "#060606",
          800: "#040404",
          900: "#020202",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FAF6E8",
          100: "#F5ECCB",
          200: "#ECD99B",
          300: "#E3C76B",
          400: "#D4AF37",
          500: "#BF9927",
          600: "#9A7B1C",
          700: "#735B13",
          800: "#4D3C0B",
          900: "#2B2105",
        },
        champagne: "#F5E6C8",
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "marquee": "marquee 45s linear infinite",
        "marquee-reverse": "marquee-reverse 45s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5ECCB 0%, #D4AF37 50%, #9A7B1C 100%)",
        "gold-glow": "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(10,10,10,0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
