import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

const githubAppName = process.env.VITE_GITHUB_APP_NAME;
const githubAppInstallUrl = process.env.VITE_GITHUB_APP_INSTALL_URL;
const githubApiUrl = process.env.VITE_GITHUB_API_URL;

if (!githubAppName) throw new Error("Missing VITE_GITHUB_APP_NAME");
if (!githubAppInstallUrl) throw new Error("Missing VITE_GITHUB_APP_INSTALL_URL");

export default defineConfig({
  plugins: [solid(), UnoCSS()],
  base: "/dashboard/",
  define: {
    "import.meta.env.VITE_GITHUB_APP_NAME": JSON.stringify(githubAppName),
    "import.meta.env.VITE_GITHUB_APP_INSTALL_URL": JSON.stringify(githubAppInstallUrl),
    "import.meta.env.VITE_GITHUB_API_URL": JSON.stringify(githubApiUrl ?? "https://api.github.com"),
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
