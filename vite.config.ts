import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wav}']
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync('./cert/localhost+2-key.pem'),
      cert: fs.readFileSync('./cert/localhost+2.pem'),
    }
  },
  // resolve: { preserveSymlinks: true },
});
