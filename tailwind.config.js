const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'bg-gray': '#383737',
        'primary-gray': '#2C2B2B',
        'primary-yellow': '#E7D321',
        'secondary-gray': '#252525',
        'secondary-yellow': '#F2E889',
        'shade-yellow' :'#FFF8B7',
        'shade-gray': '#848484'
      },
      fontFamily: {
        body: ['Raleway', 'Arial', 'sans-serif'],
        display: ['Ubuntu', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      height: ['hover', 'focus', 'group-hover'],
      width: ['hover', 'focus', 'group-hover'],
      filter: ['hover'],
      brightness: ['hover']
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtils = {
        '.flex-center': {
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.tracking-extrawide': {
          letterSpacing: '0.35em'
        }
      }

      addUtilities(newUtils)
    }),
  
  ],
}
