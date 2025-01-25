import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#F5EBE6',
        secondary: '#E8D5C4',
      },
    },
  },
  plugins: [],
};

export default config;
