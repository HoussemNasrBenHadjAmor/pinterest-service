module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // display: ["Poppins"],
        // body: ["Poppins"],
        // sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        sans: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    // ...
  ],
};
