import "./app.css";
import "normalize.css";
import "events";
import App from "./App.svelte";

// Hack for YCombinator
const YCOMBINATOR_DEMO_WALLET_FOR_JARED =
  "2okr45A8i762cCetGmUVuAcozTzzpPQhtEw8vFzeTCzLCpQwtiJFq2Woog7hyRoeoufhch6g2rax1yojL3ryBwHe";
localStorage.setItem("PORTAL_PRIVATE_KEY", YCOMBINATOR_DEMO_WALLET_FOR_JARED);

const app = new App({
  target: document.getElementById("app"),
});

export default app;
