// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    alpinejs({ entrypoint: "/src/entrypoint" }),
  ],

  output: "hybrid",
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ["react-dropzone"],
    },
  },
});
