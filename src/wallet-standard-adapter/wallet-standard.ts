import {
  SolanaSignAndSendTransaction,
  SolanaSignMessage,
  SolanaSignTransaction,
  type SolanaSignMessageOutput,
  type SolanaSignMessageInput,
  type SolanaSignTransactionMethod,
  type SolanaSignTransactionOutput,
} from "@solana/wallet-standard-features";
import type { Wallet as WalletStandard, WalletAccount } from "@wallet-standard/base";
import type { StandardConnectMethod, StandardConnectOutput } from "@wallet-standard/features";
import { StandardConnect, StandardDisconnect, StandardEvents } from "@wallet-standard/features";
import { icon as ICON } from "./icon";
import { SOLANA_CHAINS, SOLANA_MAINNET_CHAIN } from "./solana-chains";
import { log, runWithTimeout, sleep, stringify } from "../backend/functions";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { MIKES_WALLET, MINUTES, SECONDS } from "src/backend/constants";
import { convertSolanaMessageToString } from "./util";
const ANY_ORIGIN = "*";
import base58 from "bs58";
import {
  // BaseWalletAdapter,
  // isVersionedTransaction,
  // WalletAccountError,
  // WalletConfigError,
  // WalletConnectionError,
  // WalletDisconnectedError,
  // WalletDisconnectionError,
  // WalletError,
  // WalletNotConnectedError,
  // WalletNotReadyError,
  // WalletPublicKeyError,
  // WalletReadyState,
  // WalletSendTransactionError,
  WalletSignMessageError,
  // WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import type { SolanaChain } from "./types";

const NAME = "Portal";
const VERSION = "1.0.0";

// TODO: temp wallet address until we add the UI
const TEMP_PUBLIC_KEY = new PublicKey(MIKES_WALLET);

// Questions: how doI make the 'Connect' event run? It doesn't ever seem to run.
//

// Check also /home/mike/Code/portal/wallet-adapter/node_modules/.pnpm/@solana+wallet-standard-wallet-adapter-base@1.0.2_@solana+web3.js@1.74.0_bs58@4.0.1/node_modules/@solana/wallet-standard-wallet-adapter-base/lib/esm/adapter.js

const makeWalletAccount = (publicKey: PublicKey): WalletAccount => {
  return {
    address: publicKey.toBase58(),
    publicKey: publicKey.toBytes(),
    chains: [SOLANA_MAINNET_CHAIN],
    features: [SolanaSignAndSendTransaction, SolanaSignTransaction, SolanaSignMessage],
  };
};

// See constructor() in https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts
const activeWalletAccount = makeWalletAccount(TEMP_PUBLIC_KEY);

// The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
// https://github.com/wallet-standard/wallet-standard
// Methods borrowed from window.solana since the docs are non-existent:
// https://github.com/solana-labs/wallet-standard/issues/17
// See /home/mike/Code/portal/portal-standard-wallet/src/window.ts
// (which is not our code but rather a clone of https://github.com/solana-labs/wallet-standard)
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts

const sendMessageToContentScript = (message: any) => {
  // Send message to the content script
  window.postMessage(message, ANY_ORIGIN);
};

// TODO: not sure if neccessary, but somehow this script needs to get
// active public key and Ghost example doesn't show how
export const getPublicKey = (): Promise<Uint8Array | null> => {
  log(`Running getPublicKey....`);

  return new Promise((resolve, reject) => {
    // Be ready to handle replies
    const handler = (event: MessageEvent) => {
      const { topic, publicKey } = event.data;
      if (topic === "replyGetPublicKey") {
        window.removeEventListener("message", handler);
        if (!publicKey) {
          resolve(null);
        }
        const publicKeyDecoded = base58.decode(publicKey);
        resolve(publicKeyDecoded);
      }
    };
    window.addEventListener("message", handler);

    // Now send out the message that will hopefully get a reply
    sendMessageToContentScript({
      topic: "getPublicKey",
      url: window.location.href,
    });
  });
};

const connect: StandardConnectMethod = async ({
  // From typescript definition:
  // "request accounts that have already been authorized without prompting"
  silent,
} = {}): Promise<StandardConnectOutput> => {
  log("⚡ Connect. Sending message to content script...");
  sendMessageToContentScript({
    topic: "walletStandardConnect",
    isSilent: silent,
  });

  const accounts: Array<WalletAccount> = [activeWalletAccount];

  log(`Returning accounts`, accounts);
  return { accounts };
};

const disconnect = async () => {
  log("🔌 Disconnect");
};

const askUserToSignMessage = async (message: Uint8Array) => {
  log("In askUserToSignMessage(). Sending 'walletStandardSignMessage' message to content script...");

  // First, convert the Solana message to a string, but also 'message' is a confusing
  // variable name, since we already have window.postMessage() and 'message' is a different type of message
  const text = convertSolanaMessageToString(message);

  // Send message to the content script
  sendMessageToContentScript({
    topic: "walletStandardSignMessage",
    url: window.location.href,
    text,
  });
};

const signMessage = async (accountAndMessage: SolanaSignMessageInput) => {
  // log("Sign message", accountAndMessage);
  const outputs: Array<SolanaSignMessageOutput> = [];

  // A little weird, but the wallet-adapter test page expects
  // - a single input
  // - multiple outputs

  if (!accountAndMessage.account.features.includes("solana:signMessage")) {
    throw new Error("invalid feature");
  }

  if (!TEMP_PUBLIC_KEY) {
    throw new Error("invalid account");
  }

  // Make the wallet popup show an icon so the users clicks on it.
  // Give the user some time to approve, decline or do nothing
  await askUserToSignMessage(accountAndMessage.message);

  const getWalletStandardSignMessageReply = (): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        const { topic, isApproved, signature } = event.data;
        if (topic === "replyWalletStandardSignMessage") {
          window.removeEventListener("message", handler);
          if (!isApproved) {
            resolve(null);
          }
          const signatureDecoded = base58.decode(signature);
          resolve(signatureDecoded);
        }
      };
      window.addEventListener("message", handler);
    });
  };

  log(`Waiting for 'replyWalletStandardSignMessage' or a timeout...`);

  let signatureOrNull: Uint8Array | null;
  try {
    signatureOrNull = (await runWithTimeout(getWalletStandardSignMessageReply(), 30 * SECONDS)) as Uint8Array;
  } catch (error) {
    // odd no error message
    log(`The user did not sign the transaction in time`, stringify(error));
    signatureOrNull = null;
  }

  if (!signatureOrNull) {
    log(`🤔 User didn't sign.`);
    // Wallet Standard behaviour is to throw an error for this
    throw new WalletSignMessageError("Signature was not approved");
  }

  log(`😀 Woo, we have a signature!`);

  const output: SolanaSignMessageOutput = {
    signedMessage: accountAndMessage.message,
    signature: signatureOrNull,
  };

  outputs.push(output);

  return outputs;
};

const signTransaction: SolanaSignTransactionMethod = async (...inputs) => {
  log("Sign transaction arguments:", ...inputs);
  const outputs: SolanaSignTransactionOutput[] = [];
  for (const { transaction, account, chain } of inputs) {
    if (!account.features.includes("solana:signTransaction")) {
      throw new Error("invalid feature");
    }

    if (chain && !SOLANA_CHAINS.includes(chain as SolanaChain)) {
      throw new Error("invalid chain");
    }

    const parsedTransaction = Transaction.from(transaction);

    // if (!keyPair) {
    //   throw new Error("invalid account");
    // }

    // if (!confirm("Do you want to sign this transaction?")) throw new Error("signature declined");

    // parsedTransaction.partialSign(keypair);

    // outputs.push({
    //   signedTransaction: new Uint8Array(parsedTransaction.serialize({ requireAllSignatures: false })),
    // });
  }

  return outputs;
};

// Portal's implementation of the wallet standard
export const PortalWalletStandardImplementation: WalletStandard = {
  name: NAME,
  version: VERSION,
  icon: ICON,
  // Copied from https://github.com/solana-labs/wallet-standard
  chains: SOLANA_CHAINS.slice(),
  features: {
    [StandardConnect]: {
      version: "1.0.0",
      connect,
    },
    [StandardDisconnect]: {
      version: "1.0.0",
      disconnect,
    },
    [StandardEvents]: {
      version: "1.0.0",
      on: async (eventName) => {
        log("On", eventName);
        // oddly the first time we connect the page triggers 'change'
        if (eventName === "connect" || eventName === "change") {
          await connect();
          return;
        }
        log(`No event handler implemented for ${eventName}`);
        // TODO: add other events
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
      signTransaction,
    },
    [SolanaSignMessage]: {
      version: "1.0.0",
      signMessage,
    },
    // We can also add a 'portal:' name space if we want, but there's no need right now
  },
  accounts: [activeWalletAccount],
};
