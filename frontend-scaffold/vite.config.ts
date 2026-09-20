import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  server: {
    port: 5173,
  },
});
