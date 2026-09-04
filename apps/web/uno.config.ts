import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  },
  presets: [
    presetWind4({
      dark: "class",
      preflights: {
        reset: true,
        theme: "on-demand",
      },
    }),
    presetIcons(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
