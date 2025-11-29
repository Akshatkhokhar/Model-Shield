import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy setup to route API calls to the FastAPI backend
  server: {
    proxy: {
      '/api': {
        // Target the port where your Uvicorn/FastAPI server is running
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Optional: rewrite the path if needed, but not necessary here
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});