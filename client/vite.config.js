import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

export default ({ mode }) => {
  // Load .env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      https: {
        key: fs.readFileSync(path.resolve(env.VITE_SSL_KEY_FILE)),
        cert: fs.readFileSync(path.resolve(env.VITE_SSL_CRT_FILE)),
      },
      proxy: {
        '/api': {
          target: 'https://localhost:8443',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      global: 'globalThis',
    },
  });
};
