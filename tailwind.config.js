// export default {
//   plugins: {
//     "@tailwindcss/postcss": {},
//   },
// }


export default {
  darkMode: "class",   // ✅ THIS IS REQUIRED
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};