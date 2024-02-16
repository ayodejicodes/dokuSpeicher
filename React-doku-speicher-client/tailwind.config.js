/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    extend: {
      colors: {
        lightBackground: "#eff2fd",
        darkBackground: "#121212",
        primaryBlue: "#b8c5f7",
        lightBlue: "#afb2e4",
        gray: "#9ea5ab",
        darkGray: "#2e3a47",
        accentBlue: "#363ac3",
        darkerBlue: "#489ace",
        accentRed: "#f5395f",
        pdfColor: "#FF8042",
        excelColor: "#00C49F",
        wordColor: "#FFBB28",
        txtColor: "#0088FE",
        imagesColor: "#8884d8",
      },
    },
  },
  plugins: [],
};
