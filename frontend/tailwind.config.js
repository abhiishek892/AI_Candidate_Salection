/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        glassCard: "rgba(17, 24, 39, 0.7)",
        glassBorder: "rgba(255, 255, 255, 0.06)",
        accentPrimary: "#10B981", // Emerald-500
        accentSecondary: "#06B6D4", // Cyan-500
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
}
