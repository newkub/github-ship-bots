import { defineConfig, presetWind4, presetIcons } from "unocss";

export default defineConfig({
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
});
