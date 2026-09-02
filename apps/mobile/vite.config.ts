import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solid(),
    UnoCSS(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        importScripts: ["/push-handler.js"],
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "ship-feed",
        short_name: "ship-feed",
        description: "Card-driven autonomous development",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
  build: {
    sourcemap: false,
  },
});
