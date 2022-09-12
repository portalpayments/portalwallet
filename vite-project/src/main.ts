import "./app.css";
import "normalize.css";
import "events";
// @ts-ignore TS reports an error here but everything works fine
// and the file definitely exists
import App from "./App.svelte";

// Hack for YCombinator
const YCOMBINATOR_DEMO_WALLET_FOR_JARED =
  "2okr45A8i762cCetGmUVuAcozTzzpPQhtEw8vFzeTCzLCpQwtiJFq2Woog7hyRoeoufhch6g2rax1yojL3ryBwHe";
localStorage.setItem("PORTAL_PRIVATE_KEY", YCOMBINATOR_DEMO_WALLET_FOR_JARED);

const app = new App({
  target: document.getElementById("app"),
});

export default app;
