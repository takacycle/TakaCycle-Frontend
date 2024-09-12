/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alton: ['Alton Trial', 'sans-serif'],
      },
      colors:{
        brandFadedGreen: "#EBF9ED",
        brandLightGreen: "#40C74F",
        brandDarkGreen: "#15491B",
        brandLightBlue: "#0174EB",
      },
    },
  },
  plugins: [],
};
