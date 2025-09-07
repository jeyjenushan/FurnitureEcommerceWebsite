import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';
import path from 'path';



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
   server: {
    port: 5173,
https: {
  key: fs.readFileSync('localhost+2-key.pem'),
  cert: fs.readFileSync('localhost+2.pem'),
},
    proxy: {
      '/api': {
     target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false
      }
    },
      define: {
    global: 'globalThis',
  }
  },
})

