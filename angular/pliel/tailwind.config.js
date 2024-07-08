/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  //Linea añadida para ver si en producción se aplican correctamente los estilos
  purge: [
    './src/**/*.{html,ts}', 
    './public/index.html',
  ],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors:{
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      'gray': require('tailwindcss/colors').neutral,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      green: colors.green,
      pink: colors.pink,
      indigo: colors.indigo,
      purple: colors.purple,
      violet: colors.violet,
      cyan: colors.cyan,
      teal: colors.teal,
      emerald: colors.emerald,
      lime: colors.lime,
      amber: colors.amber,
      orange: colors.orange,
      rose: colors.rose,
      fuchsia: colors.fuchsia,
      sky: colors.sky,

      // Custom colors
      'fondo': '#EED6E7',

      'alerta': {
        warning: '#E9BA8A',
        success: '#C6EBBE',
        info: '#A8E3DD',
        error: '#E0685C',
      },
      'primary': {
        100: '#C8ADC0',
        200: '#AF92A7',
        300: '#7B5C72',
        400: '#65475C',
      },
      'secondary': {
        100: '#A8A1AE',
        200: '#6B6570',
        300: '#2E2532',
        400: '#201A23',
      },

      'alerta-dalt': {
        warning: '#939393',
        success: '#C0C0C0',
        info: '#C0C0C0',
        error: '#737373',
      },
      'primary-dalt': {
        100: '#A5A5A5',
        200: '#6A6A6A',
        300: '#343434',
        400: '#232323',
      },
      'secondary-dalt': {
        100: '#9F9F9F',
        200: '#676767',
        300: '#2B2B2B',
        400: '#1F1F1F',
      },

    },
    extend: {
      screens: {
        'md-lg': '900px',
      },
    },
  },
  plugins: [],
}

