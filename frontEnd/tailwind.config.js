/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        textColor: "var(--color-text)",

        lightPrimary: "var(--color-primary-light)",
        lightSecondary: "var(--color-secondary-light)",
        lightAccent: "var(--color-accent-light)",
        lightBg: "var(--color-bg-light)",
        lightTextColor: "var(--color-text-light)",
      },
      // boxShadow: {
      //   "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      // },
    },
  },
  plugins: [],
};
