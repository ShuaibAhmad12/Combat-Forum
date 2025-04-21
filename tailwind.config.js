// In tailwind.config.js
module.exports = {
    // other config...
    plugins: [
      require('@tailwindcss/typography'),
      // other plugins...
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              'h1, h2, h3, h4, h5, h6': {
                display: 'block',
                visibility: 'visible',
              },
              // You can customize other typography aspects here
            }
          }
        }
      }
    }
  }