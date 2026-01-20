import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  build: {
    outDir: resolve(__dirname, '../../../dist/modules/portal'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
      '/assets': 'http://localhost:3000',
      '/public': 'http://localhost:3000',
      '/display': 'http://localhost:3000',
    },
  },
});
