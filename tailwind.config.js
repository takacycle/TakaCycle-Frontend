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
        brandGreen:"#3EA35F",
        brandLightGreen: "#EBF9ED",
        brandFadedGreen: "#E9FCCF",
        brandTextGreen: "#1F4520",
      },
    },
  },
  plugins: [],
};
