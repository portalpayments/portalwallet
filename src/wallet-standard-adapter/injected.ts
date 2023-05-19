// Register our wallet implementation with the wallet standard, and attach it to the window so dapps can find it.
// From https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
import { log, stringify } from "../backend/functions";
import { registerWallet } from "./register";
import { makePortalWalletStandardImplementation, getPublicKey } from "./wallet-standard";

const portalWalletStandardImplementation = makePortalWalletStandardImplementation();

const main = async () => {
  try {
    log("Registering wallet implementation...");
    registerWallet(portalWalletStandardImplementation);
    log("✅ success registering wallet implementation");

    // const publicKey = await getPublicKey();

    // log(`Public key is`, publicKey);

    log("Attached Portal wallet implementation to window");
    Object.defineProperty(window, "portal", {
      value: portalWalletStandardImplementation,
    });
    log("✅ success attaching Portal wallet implementation to window");
  } catch (thrownObject) {
    const error = thrownObject as Error;
    console.error(error);
    log(`🛑 Failed to attach wallet implementation to window: ${stringify(error)}`);
  }
};

main();
