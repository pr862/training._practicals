import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://music-web-43mv.onrender.com/playlists',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://music-web-43mv.onrender.com/playlists',
        changeOrigin: true
      }
    }
  }
})

