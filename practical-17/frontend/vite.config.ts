import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  preview: {
    allowedHosts: ['stylesphere-frontend.onrender.com'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
      '/public': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
      '/user': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
      '/admin': {
        target: 'https://stylesphere-4qp1.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
