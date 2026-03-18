import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  envDir: '../',
  server: {
    proxy: {
      '/send': 'http://localhost:3000'
    }
  }
});
