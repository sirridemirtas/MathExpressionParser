import { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    'text-blue-200',
    'text-green-200',
    'text-purple-200',
    'text-gray-200',
    'text-red-200',
    'text-gray-400',
    'bg-blue-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-gray-200',
    'bg-red-200',
    'bg-gray-200',
  ],
  plugins: [],
} satisfies Config;
