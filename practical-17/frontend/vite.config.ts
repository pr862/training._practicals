import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = (env.VITE_API_BASE_URL || 'http://localhost:3500').replace(/\/$/, '');

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    preview: {
      allowedHosts: ['stylesphere-frontend.onrender.com'],
    },
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
        '/public': {
          target,
          changeOrigin: true,
        },
        '/uploads': {
          target,
          changeOrigin: true,
        },
        '/auth': {
          target,
          changeOrigin: true,
        },
        '/user': {
          target,
          changeOrigin: true,
        },
        '/admin': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
})
