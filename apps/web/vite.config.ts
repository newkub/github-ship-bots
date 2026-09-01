import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [solid(), UnoCSS()],
  server: {
    port: 5174,
  },
  build: {
    sourcemap: false,
  },
});
