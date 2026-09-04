import { defineConfig, presetWind4, transformerVariantGroup, transformerDirectives } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  },
  presets: [presetWind4({ dark: "class" })],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
