import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

const appUrl = process.env.VITE_APP_URL;
const githubAppName = process.env.VITE_GITHUB_APP_NAME;
const githubAppInstallUrl = process.env.VITE_GITHUB_APP_INSTALL_URL;

if (!appUrl) throw new Error("Missing VITE_APP_URL");
if (!githubAppName) throw new Error("Missing VITE_GITHUB_APP_NAME");
if (!githubAppInstallUrl) throw new Error("Missing VITE_GITHUB_APP_INSTALL_URL");

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
    "import.meta.env.VITE_GITHUB_APP_NAME": JSON.stringify(githubAppName),
    "import.meta.env.VITE_GITHUB_APP_INSTALL_URL": JSON.stringify(githubAppInstallUrl),
  },
  server: {
    port: 5175,
  },
  build: {
    outDir: "../../docs",
    emptyOutDir: false,
  },
});
