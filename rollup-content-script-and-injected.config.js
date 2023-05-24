import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import nodePolyfills from "rollup-plugin-polyfill-node";

const log = console.log;

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default [
  // This script run on the page
  // It recieves events from both the service worker (using chrome ports)
  // and the injected page (using window.postMessage() and window.addEventListener() )
  {
    input: "./src/wallet-standard-adapter/content-script.ts",
    output: {
      dir: "dist",
      sourcemap: true,
    },
    plugins: [
      typescript({
        compilerOptions: {
          module: "es2020",
          target: "es2020",
          lib: ["es2022", "dom"],
          moduleResolution: "Node",
        },
        include: [],
      }),
      alias({
        entries: [
          {
            find: "node-fetch",
            replacement: "just-use-native-fetch",
          },
        ],
      }),
      nodeResolve({
        preferBuiltins: false,
      }),
      commonjs(),
      nodePolyfills({}),
    ],
  },
  // This script is injected into the page by the service worker
  // it creates and registers a Solana wallet adapter for use by dApps
  // It talks to the content script using window.postMessage() and window.addEventListener()
  {
    input: "./src/wallet-standard-adapter/injected.ts",
    output: {
      dir: "dist",
      sourcemap: true,
      // Default format creates a file that inclines "@solana/web3.js",
      // which in turn obliterates window.URL, setting it to '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
      format: "iife",
    },
    onwarn: (warning, warn) => {
      if (warning.code === "CIRCULAR_DEPENDENCY") {
        // A few of the node polyfills has a circular dependency and we need them to fix it
        return;
      }
      if (warning.code === "EVAL" && warning.id.includes("@solana/web3.js")) {
        // A few of the node polyfills has a circular dependency and we need them to fix it
        return;
      }
      warn(warning);
    },
    // Used to include modules like localforage in our service worker bundle
    plugins: [
      typescript({
        compilerOptions: {
          module: "es2020",
          target: "es2020",
          lib: ["es2022", "dom"],
          moduleResolution: "Node",
        },
        include: [
          // Yes we have to include the input file itself
          "src/wallet-standard-adapter/*",
          "src/backend/functions.ts",
          "src/backend/constants.ts",
          "src/backend/types.ts",
        ],
      }),
      alias({
        entries: [
          {
            find: "node-fetch",
            replacement: "just-use-native-fetch",
          },
        ],
      }),
      nodeResolve({
        preferBuiltins: false,
      }),
      commonjs(),
      nodePolyfills({}),
    ],
  },
];
