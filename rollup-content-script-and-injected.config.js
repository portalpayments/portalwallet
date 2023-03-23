import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import nodePolyfills from "rollup-plugin-polyfill-node";

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
          moduleResolution: "Node",
        },
        include: ["src/backend/functions.ts", "src/backend/constants.ts"],
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
    },
    // Used to include modules like localforage in our service worker bundle
    plugins: [
      typescript({
        compilerOptions: {
          module: "es2020",
          target: "es2020",
          moduleResolution: "Node",
        },
        include: [
          "src/wallet-standard-adapter/injected.ts",
          "src/wallet-standard-adapter/wallet-standard.ts",
          "src/wallet-standard-adapter/register.ts",
          "src/wallet-standard-adapter/icon.ts",
          "src/wallet-standard-adapter/util.ts",
          "src/wallet-standard-adapter/solana-chains.ts",
          "src/backend/functions.ts",
          "src/backend/constants.ts",
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
