
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'bg-gray': '#383737',
        'primary-gray':'#2C2B2B',
        'primary-yellow': "#E7D321",
        'secondary-gray': '#565656'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
}
