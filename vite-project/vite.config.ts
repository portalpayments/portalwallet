import { build, defineConfig, optimizeDeps } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// See https://github.com/sveltejs/kit/issues/859
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "es2020",
  },
});
