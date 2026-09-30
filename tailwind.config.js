/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                background: "rgb(var(--color-background) / <alpha-value>)",
                surface: "rgb(var(--color-surface) / <alpha-value>)",
                foreground: "rgb(var(--color-foreground) / <alpha-value>)",
                "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                accent: "rgb(var(--color-accent) / <alpha-value>)",
                muted: "rgb(var(--color-muted) / <alpha-value>)",
                border: "rgb(var(--color-border) / <alpha-value>)",
                brand: {
                    bg: "#0B0E14",
                    body: "#F5F4F0",
                    surface: "#141822",
                    "surface-border": "#232838",
                    "text-primary": "#F2EFE9",
                    "text-secondary": "#8A8D96",
                    "text-muted": "#5C5F68",
                    blue: "#1A85FF",
                    coral: "#FF6B4A",
                    success: "#3DDC84",
                },
            },
        },
    },
    plugins: [
        ({ addBase }) =>
            addBase({
                ":root": {
                    "--color-background": "242 255 240",
                    "--color-surface": "255 255 255",
                    "--color-foreground": "2 24 1",
                    "--color-primary": "29 249 21",
                    "--color-on-primary": "2 24 1",
                    "--color-secondary": "121 247 251",
                    "--color-accent": "56 192 250",
                    "--color-muted": "82 99 79",
                    "--color-border": "200 220 196",
                },
                ".dark": {
                    "--color-background": "11 18 10",
                    "--color-surface": "21 31 20",
                    "--color-foreground": "232 245 229",
                    "--color-primary": "29 249 21",
                    "--color-on-primary": "2 24 1",
                    "--color-secondary": "121 247 251",
                    "--color-accent": "56 192 250",
                    "--color-muted": "164 181 159",
                    "--color-border": "49 65 46",
                },
            }),
    ],
};