/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "progress-indeterminate": "progress-indeterminate 1.5s infinite cubic-bezier(0.65, 0.05, 0.36, 1)",
      },
    },
  },
}