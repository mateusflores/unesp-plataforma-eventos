import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
=======
import tailwindcss from '@tailwindcss/vite';
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [react(), tailwindcss()],
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
