/* eslint-env node */
/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  // prefix: "",
  content: ["./index.html", "./src/**/*.{js,ts,vue}", "./playground/**/*.vue"],
  darkMode: ["class"], // or 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("error", ["&[data-error=true]", "[data-error=true] &"]);
    }),
  ],
};
