import { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-gray-600',
    'text-red-600',
    'text-gray-400',
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-gray-600',
    'bg-red-600',
    'bg-gray-600',
  ],
  plugins: [],
} satisfies Config;
