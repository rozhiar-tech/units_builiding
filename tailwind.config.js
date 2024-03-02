/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
          colors: {
            darkThemeBackground: '#070F2B',
            customGreen: '#38c172',
            // Add your custom colors here
          },
        },
      },
    plugins: []
}
