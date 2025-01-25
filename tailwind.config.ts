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
        beige: {
          50: 'var(--color-beige-50)',
          100: 'var(--color-beige-100)',
          200: 'var(--color-beige-200)',
          300: 'var(--color-beige-300)',
          400: 'var(--color-beige-400)',
          500: 'var(--color-beige-500)',
          600: 'var(--color-beige-600)',
          700: 'var(--color-beige-700)',
          800: 'var(--color-beige-800)',
          900: 'var(--color-beige-900)',
        },
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      backgroundColor: {
        skin: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          accent: 'var(--bg-accent)',
          dark: 'var(--bg-dark)',
        },
      },
      textColor: {
        skin: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          light: 'var(--text-light)',
        },
      },
      borderColor: {
        skin: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
