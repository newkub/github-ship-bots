import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

const appUrl = process.env.VITE_APP_URL || "https://github-ship-bots.newkubise.workers.dev";

export default defineConfig({
  plugins: [
    UnoCSS(),
    solid(),
    {
      name: "html-meta-url",
      transformIndexHtml(html) {
        return html.replace(/%VITE_APP_URL%/g, appUrl);
      },
    },
  ],
  base: "./",
  define: {
    "import.meta.env.VITE_APP_URL": JSON.stringify(appUrl),
  },
  server: {
    port: 5175,
  },
  build: {
    outDir: "../../docs",
    emptyOutDir: false,
  },
});
