// https://vitejs.dev/config/
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { getGitVersion } from "./build-tools";
import { log, stringify } from "./src/backend/functions";

const GIT_VERSION = getGitVersion();

// Config is based on metaplex + vite example from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

process.env.PORTAL_VERSION = GIT_VERSION;

const isMinifiying = Boolean(process.env.ZIP_FILE_NAME);

log(`Git version is: '${GIT_VERSION}', ${isMinifiying ? "producing minified build to send externally." : ""} `);

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
      "node-fetch": "just-use-native-fetch",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    target: "es2020",

    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
      output: {
        globals: ["chrome"],
      },
      onwarn: (warning, warn) => {
        // A few of the node polyfills use eval
        // Disable warnings as this is third party code
        if (warning.code === "EVAL" && warning?.frame?.includes('eval("require')) {
          return;
        }
        warn(warning);
      },
    },
    // From https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    commonjsOptions: {
      include: [],
    },
    minify: isMinifiying,
    // We use tsc/rollup to build the service worker, so don't destroy that built file.
    emptyOutDir: false,
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
