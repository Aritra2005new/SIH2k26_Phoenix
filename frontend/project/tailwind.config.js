/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        ink: {
          50: '#fdfcfb',
          100: '#f8f4f1',
          200: '#f1e8e2',
          300: '#e2d1c3',
          400: '#a89589',
          500: '#806f65',
          600: '#66554c',
          700: '#4a3931',
          800: '#382a24',
          900: '#241a16'
        },

        plum: {
          50: '#f8f4f1',
          100: '#f1e8e2',
          200: '#e2d1c3',
          300: '#cdb8a8',
          400: '#aa9180',
          500: '#806a5b',
          600: '#4a3931',
          700: '#382a24',
          800: '#2d211c',
          900: '#241a16'
        },

        success: {
          50: '#edf7f0',
          500: '#4f8a61',
          600: '#3d704d',
          700: '#315b3e'
        },

        warning: {
          50: '#fff7e8',
          500: '#c28a32',
          600: '#a97322',
          700: '#8b5e18'
        },

        danger: {
          50: '#fdf0ee',
          500: '#c45c50',
          600: '#a9473d',
          700: '#8d3932'
        },

        info: {
          50: '#eef5f7',
          500: '#5d8d9b',
          600: '#477582',
          700: '#365f6a'
        },

        cream: '#fdfcfb'
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },

      boxShadow: {
        card: '0 16px 50px rgba(74,57,49,.10)',
        'card-hover': '0 20px 65px rgba(74,57,49,.16)',
        glow: '0 0 35px rgba(74,57,49,.16)'
      }
    }
  },

  plugins: []
}