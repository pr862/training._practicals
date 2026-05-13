import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'https://training-practicals-2.onrender.com'
    }
  },
  optimizeDeps: {
    include: ['quill']
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
