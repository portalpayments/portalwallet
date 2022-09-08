// https://vitejs.dev/config/
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Config is based on metaplex + vite examle from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
    // From https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    commonjsOptions: {
      include: [],
    },
    // Help debug issues during alpha testing
    minify: false,
  },
  optimizeDeps: {
    // From https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    disabled: false,
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
      target: "es2020",
    },
  },
});
