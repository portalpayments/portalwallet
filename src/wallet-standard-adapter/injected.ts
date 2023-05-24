// Register our wallet implementation with the wallet standard, and attach it to the window so dapps can find it.
// From https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
import { log, stringify } from "../backend/functions";
import { registerWallet } from "./register";
import { portalWalletStandardImplementation } from "./wallet-standard";

const main = async () => {
  try {
    registerWallet(portalWalletStandardImplementation);
    log("✅ Registered Portal wallet standard implementation");
    // https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
    // says we should make a global underneath window but that seems gross
    //
  } catch (thrownObject) {
    const error = thrownObject as Error;
    console.error(error);
    log(`🛑 Failed to register wallet: ${stringify(error)}`);
  }
};

main();
