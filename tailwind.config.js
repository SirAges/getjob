/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#53a65e",
                secondary: "#b8e3be",
                danger: "#f50000",
                background: "#ffffff",
                card: "#eaf8efcc",
                title: "#1f1f1f",
                body: "#353535"
            }
        }
    },
    plugins: []
};
