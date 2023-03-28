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

import { SOLANA_CHAINS, SOLANA_MAINNET_CHAIN } from "./solana-chains";
import { log } from "../backend/functions";
import { MIKES_WALLET } from "src/backend/constants";
import { PublicKey } from "@solana/web3.js";

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
  log("Connect. Sending message to content script...");
  // Send message to the content script
  window.postMessage(
    {
      topic: "connect",
      isSilent: silent,
    },
    ANY_ORIGIN
  );

  const walletAddress = MIKES_WALLET;

  const publicKey = new PublicKey(walletAddress);

  // Then start a timer waiting for the extension to respond

  // See constructor() in https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts
  const walletAccount = {
    address: publicKey.toBase58(),
    publicKey: publicKey.toBytes(),
    chains: [SOLANA_MAINNET_CHAIN],
    features: [
      SolanaSignAndSendTransaction,
      SolanaSignTransaction,
      SolanaSignMessage,
    ],
    // Work around very odd typing with 'chains' property
    // TODO: fix properly
  } as WalletAccount;

  log(`Returning wallet account`, walletAccount);

  const accounts: Array<WalletAccount> = [walletAccount];
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
