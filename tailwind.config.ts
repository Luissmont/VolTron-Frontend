import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./componentes/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'amethyst-dark': '#10002b',
                'amethyst-base': '#240046',
                'indigo-ink': '#3c096c',
                'indigo-velvet': '#5a189a',
                'royal-violet': '#7b2cbf',
                'lavender-purple': '#9d4edd',
                'mauve-magic': '#c77dff',
                'mauve-pastel': '#e0aaff',
            },
        },
    },
    plugins: [],
};
export default config;