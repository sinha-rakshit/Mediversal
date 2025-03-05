/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["PlusJakartaSans-Medium"],
        jakartaBold: ["PlusJakartaSans-Bold"],
        jakartaRegular: ["PlusJakartaSans-Regular"],
      },
    },
  },
  plugins: [],
};

