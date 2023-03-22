// Register our wallet implementation with the wallet standard, and attach it to the windo so dapps can find it.
// From https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md

import { log, stringify } from "./backend/functions";
import { registerWallet } from "./lib/wallet-standard-adapter/register";
import { PortalWalletStandardImplementation } from "./lib/wallet-standard-adapter/wallet-standard";

try {
  log("Registering wallet implementation...");
  registerWallet(PortalWalletStandardImplementation);
  log("✅ success registering wallet implementation");

  log("Attached Portal wallet implementation to window");
  Object.defineProperty(window, "portal", {
    value: PortalWalletStandardImplementation,
  });
  log("✅ success attaching Portal wallet implementation to window");
} catch (thrownObject) {
  const error = thrownObject as Error;
  console.error(error);
  log(
    `🛑 Failed to attach wallet implementation to window: ${stringify(error)}`
  );
}
