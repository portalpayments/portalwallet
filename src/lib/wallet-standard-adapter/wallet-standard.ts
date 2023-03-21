import {
  SolanaSignAndSendTransaction,
  SolanaSignMessage,
  SolanaSignTransaction,
} from "@solana/wallet-standard-features";
import type { Wallet as WalletStandard } from "@wallet-standard/base";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import { icon } from "./icon";

import { SOLANA_CHAINS } from "./solana-chains";
import { log } from "../../backend/functions";

// The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
// https://github.com/wallet-standard/wallet-standard
// Methods borrowed from window.solana since the docs are non-existent:
// https://github.com/solana-labs/wallet-standard/issues/17
// See /home/mike/Code/portal/portal-standard-wallet/src/window.ts
// (which is not our code but rather a clone of https://github.com/solana-labs/wallet-standard)
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts

// Portal's implementation of the wallet standard
export const PortalWalletStandardImplementation: WalletStandard = {
  version: "1.0.0",
  name: "Portal",
  icon,
  // Copied from https://github.com/solana-labs/wallet-standard
  chains: SOLANA_CHAINS.slice(),
  features: {
    [StandardConnect]: {
      version: "1.0.0",
      connect: async () => {
        log("Connect");
      },
    },
    [StandardDisconnect]: {
      version: "1.0.0",
      disconnect: async () => {
        log("Disconnect");
      },
    },
    [StandardEvents]: {
      version: "1.0.0",
      on: async () => {
        log("On");
      },
    },
    [SolanaSignAndSendTransaction]: {
      version: "1.0.0",
      supportedTransactionVersions: ["legacy", 0],
      signAndSendTransaction: async () => {
        log("Sign and send transaction");
      },
    },
    [SolanaSignTransaction]: {
      version: "1.0.0",
      supportedTransactionVersions: ["legacy", 0],
      signTransaction: async () => {
        log("Sign transaction");
      },
    },
    [SolanaSignMessage]: {
      version: "1.0.0",

      signMessage: async () => {
        log("Sign message");
      },
    },
    // We can also add a 'portal:' name space if we want, but there's no need right now
  },
  accounts: [],
};

// import { bytesEqual } from "./util.js";
// import type { Ghost } from "./types.js";
// import type { SolanaChain } from "./solana.js";
// import { Transaction, VersionedTransaction } from "@solana/web3.js";
// import bs58 from "bs58";
// import { GhostWalletAccount } from "./account.js";

// Here is where we implement the Solana Wallet Interface
// Weirdly, GhostWallet takes a ghost object in it's own constructor
// I think the 'ghost' object can be replaced by portal's functions
// export class GhostWallet implements WalletStandard {
//   readonly #listeners: {
//     [E in StandardEventsNames]?: StandardEventsListeners[E][];
//   } = {};
//   readonly #version = "1.0.0" as const;
//   readonly #name = "Ghost" as const;
//   readonly #icon = icon;
//   #account: GhostWalletAccount | null = null;
//   readonly #ghost: Ghost;

//   constructor(ghost: Ghost) {
//     if (new.target === GhostWallet) {
//       Object.freeze(this);
//     }

//     this.#ghost = ghost;

//     ghost.on("connect", this.#connected, this);
//     ghost.on("disconnect", this.#disconnected, this);
//     ghost.on("accountChanged", this.#reconnected, this);

//     this.#connected();
//   }

//   get version() {
//     return this.#version;
//   }

//   get name() {
//     return this.#name;
//   }

//   get icon() {
//     return this.#icon;
//   }

//   get chains() {
//     return SOLANA_CHAINS.slice();
//   }

//   // Return a map of features
//   get features(): StandardConnectFeature &
//     StandardDisconnectFeature &
//     StandardEventsFeature &
//     SolanaSignAndSendTransactionFeature &
//     SolanaSignTransactionFeature &
//     SolanaSignMessageFeature &
//     GhostFeature {
//     return {
//       [StandardConnect]: {
//         version: "1.0.0",
//         connect: this.#connect,
//       },
//       [StandardDisconnect]: {
//         version: "1.0.0",
//         disconnect: this.#disconnect,
//       },
//       [StandardEvents]: {
//         version: "1.0.0",
//         on: this.#on,
//       },
//       [SolanaSignAndSendTransaction]: {
//         version: "1.0.0",
//         supportedTransactionVersions: ["legacy", 0],
//         signAndSendTransaction: this.#signAndSendTransaction,
//       },
//       [SolanaSignTransaction]: {
//         version: "1.0.0",
//         supportedTransactionVersions: ["legacy", 0],
//         signTransaction: this.#signTransaction,
//       },
//       [SolanaSignMessage]: {
//         version: "1.0.0",
//         signMessage: this.#signMessage,
//       },
//       [GhostNamespace]: {
//         ghost: this.#ghost,
//       },
//     };
//   }

//   get accounts() {
//     return this.#account ? [this.#account] : [];
//   }

//   #on: StandardEventsOnMethod = (event, listener) => {
//     this.#listeners[event]?.push(listener) ||
//       (this.#listeners[event] = [listener]);
//     return (): void => this.#off(event, listener);
//   };

//   #emit<E extends StandardEventsNames>(
//     event: E,
//     ...args: Parameters<StandardEventsListeners[E]>
//   ): void {
//     // eslint-disable-next-line prefer-spread
//     this.#listeners[event]?.forEach((listener) => listener.apply(null, args));
//   }

//   #off<E extends StandardEventsNames>(
//     event: E,
//     listener: StandardEventsListeners[E]
//   ): void {
//     this.#listeners[event] = this.#listeners[event]?.filter(
//       (existingListener) => listener !== existingListener
//     );
//   }

//   #connected = () => {
//     const address = this.#ghost.publicKey?.toBase58();
//     if (address) {
//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       const publicKey = this.#ghost.publicKey!.toBytes();

//       const account = this.#account;
//       if (
//         !account ||
//         account.address !== address ||
//         !bytesEqual(account.publicKey, publicKey)
//       ) {
//         this.#account = new GhostWalletAccount({ address, publicKey });
//         this.#emit("change", { accounts: this.accounts });
//       }
//     }
//   };

//   #disconnected = () => {
//     if (this.#account) {
//       this.#account = null;
//       this.#emit("change", { accounts: this.accounts });
//     }
//   };

//   #reconnected = () => {
//     if (this.#ghost.publicKey) {
//       this.#connected();
//     } else {
//       this.#disconnected();
//     }
//   };

//   #connect: StandardConnectMethod = async ({ silent } = {}) => {
//     if (!this.#account) {
//       await this.#ghost.connect(silent ? { onlyIfTrusted: true } : undefined);
//     }

//     this.#connected();

//     return { accounts: this.accounts };
//   };

//   #disconnect: StandardDisconnectMethod = async () => {
//     await this.#ghost.disconnect();
//   };

//   #signAndSendTransaction: SolanaSignAndSendTransactionMethod = async (
//     ...inputs
//   ) => {
//     if (!this.#account) throw new Error("not connected");

//     const outputs: SolanaSignAndSendTransactionOutput[] = [];

//     if (inputs.length === 1) {
//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       const { transaction, account, chain, options } = inputs[0]!;
//       const { minContextSlot, preflightCommitment, skipPreflight, maxRetries } =
//         options || {};
//       if (account !== this.#account) throw new Error("invalid account");
//       if (!isSolanaChain(chain)) throw new Error("invalid chain");

//       const { signature } = await this.#ghost.signAndSendTransaction(
//         VersionedTransaction.deserialize(transaction),
//         {
//           preflightCommitment,
//           minContextSlot,
//           maxRetries,
//           skipPreflight,
//         }
//       );

//       outputs.push({ signature: bs58.decode(signature) });
//     } else if (inputs.length > 1) {
//       for (const input of inputs) {
//         outputs.push(...(await this.#signAndSendTransaction(input)));
//       }
//     }

//     return outputs;
//   };

//   #signTransaction: SolanaSignTransactionMethod = async (...inputs) => {
//     if (!this.#account) throw new Error("not connected");

//     const outputs: SolanaSignTransactionOutput[] = [];

//     if (inputs.length === 1) {
//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       const { transaction, account, chain } = inputs[0]!;
//       if (account !== this.#account) throw new Error("invalid account");
//       if (chain && !isSolanaChain(chain)) throw new Error("invalid chain");

//       const signedTransaction = await this.#ghost.signTransaction(
//         VersionedTransaction.deserialize(transaction)
//       );

//       outputs.push({ signedTransaction: signedTransaction.serialize() });
//     } else if (inputs.length > 1) {
//       let chain: SolanaChain | undefined = undefined;
//       for (const input of inputs) {
//         if (input.account !== this.#account) throw new Error("invalid account");
//         if (input.chain) {
//           if (!isSolanaChain(input.chain)) throw new Error("invalid chain");
//           if (chain) {
//             if (input.chain !== chain) throw new Error("conflicting chain");
//           } else {
//             chain = input.chain;
//           }
//         }
//       }

//       const transactions = inputs.map(({ transaction }) =>
//         Transaction.from(transaction)
//       );

//       const signedTransactions = await this.#ghost.signAllTransactions(
//         transactions
//       );

//       outputs.push(
//         ...signedTransactions.map((signedTransaction) => ({
//           signedTransaction: signedTransaction.serialize(),
//         }))
//       );
//     }

//     return outputs;
//   };

//   #signMessage: SolanaSignMessageMethod = async (...inputs) => {
//     if (!this.#account) throw new Error("not connected");

//     const outputs: SolanaSignMessageOutput[] = [];

//     if (inputs.length === 1) {
//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       const { message, account } = inputs[0]!;
//       if (account !== this.#account) throw new Error("invalid account");

//       const { signature } = await this.#ghost.signMessage(message);

//       outputs.push({ signedMessage: message, signature });
//     } else if (inputs.length > 1) {
//       for (const input of inputs) {
//         outputs.push(...(await this.#signMessage(input)));
//       }
//     }

//     return outputs;
//   };
// }
