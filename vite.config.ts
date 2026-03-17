import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  server: {
    proxy: {
      '/send': 'http://localhost:3000'
    }
  }
});
