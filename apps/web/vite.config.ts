import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

const githubAppName = process.env.VITE_GITHUB_APP_NAME || "wrikka-ship-bot";
const githubAppInstallUrl = process.env.VITE_GITHUB_APP_INSTALL_URL || `https://github.com/apps/${githubAppName}/installations/new`;
const githubApiUrl = process.env.VITE_GITHUB_API_URL || "https://api.github.com";

export default defineConfig({
  plugins: [solid(), UnoCSS()],
  base: "/dashboard/",
  define: {
    "import.meta.env.VITE_GITHUB_APP_NAME": JSON.stringify(githubAppName),
    "import.meta.env.VITE_GITHUB_APP_INSTALL_URL": JSON.stringify(githubAppInstallUrl),
    "import.meta.env.VITE_GITHUB_API_URL": JSON.stringify(githubApiUrl),
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: "../../docs/dashboard",
    sourcemap: false,
    emptyOutDir: false,
  },
});
