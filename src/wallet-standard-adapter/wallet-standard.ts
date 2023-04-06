import {
  SolanaSignAndSendTransaction,
  SolanaSignMessage,
  SolanaSignTransaction,
  type SolanaSignMessageOutput,
  type SolanaSignMessageInput,
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
import { Keypair, PublicKey } from "@solana/web3.js";
import { sign as naclSign } from "tweetnacl";
const ANY_ORIGIN = "*";

// TODO: temp wallet address until we add the UI

const keyPair = new Keypair();

const publicKey = keyPair.publicKey;

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

// The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
// https://github.com/wallet-standard/wallet-standard
// Methods borrowed from window.solana since the docs are non-existent:
// https://github.com/solana-labs/wallet-standard/issues/17
// See /home/mike/Code/portal/portal-standard-wallet/src/window.ts
// (which is not our code but rather a clone of https://github.com/solana-labs/wallet-standard)
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts

const sendMessageToContentScript = (message: any) => {
  // Send message to the content script
  window.postMessage(
    {
      topic: "walletStandardConnect",
    },
    ANY_ORIGIN
  );
};

const connect: StandardConnectMethod = async ({
  // From typescript definition:
  // "request accounts that have already been authorized without prompting"
  silent,
} = {}): Promise<StandardConnectOutput> => {
  log("Connect. Sending message to content script...");
  sendMessageToContentScript({
    topic: "walletStandardConnect",
    isSilent: silent,
  });

  const accounts: Array<WalletAccount> = [walletAccount];

  log(`Returning accounts`, accounts);
  return { accounts };
};

const signMessage = async () => {
  log("signMessage. Sending message to content script...");
  // Send message to the content script
  sendMessageToContentScript({
    topic: "walletStandardSignMessage",
  });
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
      on: async (eventName) => {
        log("On", eventName);
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
      signTransaction: async (args) => {
        log("Sign transaction arguments:", ...args);
      },
    },
    [SolanaSignMessage]: {
      version: "1.0.0",

      signMessage: async (accountAndMessage: SolanaSignMessageInput) => {
        log("Sign message", accountAndMessage);
        const outputs: Array<SolanaSignMessageOutput> = [];

        // A little weird, but the wallt-adapter test page expects
        // - a single input
        // - multiple outputs

        if (
          !accountAndMessage.account.features.includes("solana:signMessage")
        ) {
          throw new Error("invalid feature");
        }

        if (!keyPair) {
          throw new Error("invalid account");
        }

        // Make the wallet popup show an icon so the users clicks on it.
        // Give the user some time to approve, decline or do nothing
        signMessage();
        if (!confirm("Do you want to sign this message?")) {
          throw new Error("signature declined");
        }

        const signature = naclSign.detached(
          accountAndMessage.message,
          keyPair.secretKey
        );

        const output: SolanaSignMessageOutput = {
          signedMessage: accountAndMessage.message,
          signature,
        };

        outputs.push(output);

        return outputs;
      },
    },
    // We can also add a 'portal:' name space if we want, but there's no need right now
  },
  accounts: [walletAccount],
};
