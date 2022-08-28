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
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
    },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, })],
      target: "es2020",
    },
  },
});
//  process: true,
