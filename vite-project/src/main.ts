import "./app.css";
import "normalize.css";
import "events";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
