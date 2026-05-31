import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration
// The proxy section forwards /auth and /api requests to the Spring Boot backend
// This avoids CORS issues during local development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /auth goes to backend
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Any request starting with /api goes to backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
