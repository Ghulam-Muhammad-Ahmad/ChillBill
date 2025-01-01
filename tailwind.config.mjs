/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/flowbite/**/*.js',
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#C82121",  // Your primary color
        secondary: "#38AF79",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    function ({ addUtilities }) {
      const utilities = {
        '.custom-button-v1': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'background-color': '#C82121', // Using primary color
          'font-size': '1rem',
          'border-radius': '0.5rem',
          'padding': '0.5rem 1rem',
          'text-align': 'center',
          'color': 'white',
          'outline': 'none',
          '&:hover': {
            'background-color': '#38AF79', // Using secondary color on hover
          },
        },
      };
      addUtilities(utilities);
    },
  ],
};
