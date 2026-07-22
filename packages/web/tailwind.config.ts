import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          pink: '#ff00ff',
          green: '#00ff00',
          purple: '#a855f7',
        },
      },
    },
  },
  plugins: [],
}
export default config
