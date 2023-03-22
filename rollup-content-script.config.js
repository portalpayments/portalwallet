import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import nodePolyfills from "rollup-plugin-polyfill-node";

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default [
  // This script injects a script into the page
  {
    input: "./src/content-script.ts",
    output: {
      dir: "dist",
      sourcemap: true,
    },
  },
  // This script is injected into the page
  {
    input: "./src/injected.ts",
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
          "src/injected.ts",
          "src/lib/wallet-standard-adapter/wallet-standard.ts",
          "src/lib/wallet-standard-adapter/register.ts",
          "src/lib/wallet-standard-adapter/icon.ts",
          "src/lib/wallet-standard-adapter/util.ts",
          "src/lib/wallet-standard-adapter/solana-chains.ts",
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
