/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'primary-light': 'var(--color-primary-light)',
                'primary-dark': 'var(--color-primary-dark)',
                accent: 'var(--color-accent)',
                'accent-light': 'var(--color-accent-light)',
                warning: 'var(--color-warning)',
                error: 'var(--color-error)',
            }
        },
    },
    plugins: [],
}
