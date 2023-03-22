import {
  SolanaSignAndSendTransaction,
  SolanaSignMessage,
  SolanaSignTransaction,
} from "@solana/wallet-standard-features";
import type {
  Wallet as WalletStandard,
  WalletAccount,
} from "@wallet-standard/base";
import type {
  StandardConnectMethod,
  StandardConnectOutput,
} from "@wallet-standard/features";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import { icon } from "./icon";

import { SOLANA_CHAINS } from "./solana-chains";
import { log } from "../../backend/functions";

const ANY_ORIGIN = "*";

// The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
// https://github.com/wallet-standard/wallet-standard
// Methods borrowed from window.solana since the docs are non-existent:
// https://github.com/solana-labs/wallet-standard/issues/17
// See /home/mike/Code/portal/portal-standard-wallet/src/window.ts
// (which is not our code but rather a clone of https://github.com/solana-labs/wallet-standard)
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts

const connect: StandardConnectMethod = async ({
  // From typescript definition:
  // "request accounts that have already been authorized without prompting"
  silent,
} = {}): Promise<StandardConnectOutput> => {
  log("Connect");
  // Send message to the content script
  window.postMessage(
    {
      source: "PORTAL_INJECTED_PAGE",
      message: {
        walletStandardMethod: "connect",
        isSilent: silent,
      },
    },
    ANY_ORIGIN
  );

  // Then start a timer waiting for the extension to respond

  const accounts: Array<WalletAccount> = [];
  return { accounts };
};

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
      connect,
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
