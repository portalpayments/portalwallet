// Rollup is only used directly by the service worker -
// The rest of the app uses Vite. Vite Service Worker / Extension support has some issues.
// see README.md
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default {
  input: "./src/content-script.ts",
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
        "src/content-script.ts",
        "src/backend/functions.ts",
        "src/backend/constants.ts",
      ],
    }),
    nodeResolve(),
  ],
};
