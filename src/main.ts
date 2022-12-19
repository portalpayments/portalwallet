import "./app.scss";
import "normalize.css";
import "events";
// @ts-ignore TS reports an error here but everything works fine
// and the file definitely exists
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
