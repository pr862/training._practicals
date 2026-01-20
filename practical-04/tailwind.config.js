/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      keyframes: {
        colorChange: {
          '0%': { color: '#3498db' },
          '50%': { color: '#e74c3c' },
          '100%': { color: '#2ecc71' },
        },
        scaleText: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        rotateText: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '100%': { transform: 'rotate(-10deg)' },
        },
        fadeText: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        flipText: {
          '0%,100%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
        },
        dotSpin: {
          '0%,39%,100%': { transform: 'scale(0.6)' },
          '40%': { transform: 'scale(1.4)' },
        },
        bounceCustom: {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-60px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-30px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        colorFade: 'colorChange 3s infinite alternate',
        scaleAnim: 'scaleText 2s infinite alternate ease-in-out',
        rotateAnim: 'rotateText 3s infinite alternate ease-in-out',
        fadeAnim: 'fadeText 2s infinite alternate',
        flipAnim: 'flipText 3s infinite alternate ease-in-out',
        dotSpin: 'dotSpin 1.2s infinite ease-in-out both', 
        bounceBtn: 'bounceCustom 0.8s cubic-bezier(0.28,0.84,0.42,1)',
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
        '1100': '1100ms',
      },
    },
  },
  plugins: [],
}
