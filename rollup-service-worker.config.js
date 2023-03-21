import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default {
  input: "./src/service-worker.ts",
  output: {
    dir: "dist",
    sourcemap: true,
  },
  // Used to include modules like localforage in our service worker bundle
  plugins: [
    typescript({
      compilerOptions: {
        // composite: true,
        module: "es2020",
        target: "es2020",
        moduleResolution: "Node",
      },
      include: [
        "src/service-worker.ts",
        "src/service-worker-helpers.ts",
        "src/service-worker-webcache.ts",
        "src/backend/types.ts",
        "src/backend/functions.ts",
        "src/backend/constants.ts",
        "src/backend/mint-to-currency-map.ts",
      ],
    }),
    nodeResolve(),
  ],
};
