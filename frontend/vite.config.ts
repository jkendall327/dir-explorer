import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy /api/* to your Rust API
      '/api': {
        target: 'http://127.0.0.1:3000', // your Rust server port
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // if your Rust routes don't have /api
      },
    },
  },
})
