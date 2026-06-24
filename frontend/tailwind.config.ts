import { Config } from "tailwindcss";

export default {
  content: [
    './index.html',
    './src/**/*.{tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      }
    }
  },
  plugins: [],
} satisfies Config;
