module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        surfaceAlt: '#1A1A1A',
        gold: '#C9A84C',
        goldLight: '#E8C97A',
        goldSoft: '#F5E6C8',
        text: '#F5F5F5',
        textSub: '#A0A0A0',
        separator: 'rgba(201,168,76,0.2)',
      },
      boxShadow: {
        gold: '0 24px 120px rgba(201,168,76,0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
