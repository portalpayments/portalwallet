// Rollup is only used directly by the service worker -
// The rest of the app uses Vite. Vite Service Worker / Extension support has some issues.
// see README.md
import { nodeResolve } from "@rollup/plugin-node-resolve";

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default {
  input: "./prebundle/service-worker.js",
  output: {
    dir: "dist",
  },
  // Used to include modules like localforage in our service worker bundle
  plugins: [nodeResolve()],
};
