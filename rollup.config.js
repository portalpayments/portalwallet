// Rollup is only used directly by the service worker -
// The rest of the app uses Vite. Vite Service Worker / Extension support has some issues.
// see README.md

// Config came from https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js
export default {
  input: "./prebundle/service-worker.js",
  output: {
    dir: "dist",
  },
  // preserveEntrySignatures: false,
  // treeshake: true,
  // output: {
  //   entryFileNames: "[hash].js",
  //   chunkFileNames: "[hash].js",
  //   assetFileNames: "[hash][extname]",
  //   format: "es",
  //   dir: "build",
  //   plugins: [],
  // },
  // plugins: [
  //   {
  //     name: "node-resolve",
  //     version: "13.3.0",
  //   },
  //   {
  //     name: "babel",
  //   },
  //   {
  //     name: "terser",
  //   },
  // ],
};
