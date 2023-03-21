// Register our wallet implementation with the wallet standard, and attach it to the windo so dapps can find it.
// From https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md

import { log, stringify } from "./backend/functions";
import { PublicKey } from "@solana/web3.js";
import { registerWallet } from "./lib/wallet-standard-adapter/register";
import { PortalWalletStandardImplementation } from "./lib/wallet-standard-adapter/wallet-standard";

log("Registering wallet implementation");

// Register your wallet implementation using the Wallet Standard, passing the reference.
registerWallet(PortalWalletStandardImplementation);

// Attach the wallet implementation to the window, guarding against errors.
try {
  Object.defineProperty(window, "portal", {
    value: PortalWalletStandardImplementation,
  });
  log("Attached wallet implementation to window");
} catch (thrownObject) {
  const error = thrownObject as Error;
  console.error(error);
  log(`Failed to attach wallet implementation to window: ${stringify(error)}`);
}
