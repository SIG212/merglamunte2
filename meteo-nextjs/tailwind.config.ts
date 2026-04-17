import type { Config } from "tailwindcss";

export default {
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
                'alpine-emerald': '#059669',
                'alpine-slate': '#0f172a',
                'alpine-orange': '#f97316',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            borderRadius: {
                'bento': '2.5rem',
            },
        },
    },
    plugins: [],
} satisfies Config;
