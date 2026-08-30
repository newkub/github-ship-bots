import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  base: "/ship-feed-bot/",
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
