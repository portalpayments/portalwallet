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
import { log } from "../backend/functions";
import { PublicKey } from "@solana/web3.js";
import { convertSolanaMessageToString } from "./util";
import base58 from "bs58";
import {
  WalletConnectionError,
  WalletError,
  // WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { sendMessageAndMaybeGetReplyOrTimeout } from "./messaging-helpers";

const NAME = "Portal";
const VERSION = "1.0.0";

let activeAccounts: Array<WalletAccount> = [];

// An implementation of Wallet Standard, which connects to DApps that use Wallet Adapter.
// This file essentially sends messages to the rest of the wallet to do actual work,
// like signing transactions, getting public keys, etc. and then sends responses back to the dApp.

// Wallet Standard docs are not good: https://github.com/solana-labs/wallet-standard/issues/17
// - The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md
// - Best guide is the actual code of the demo wallet https://github.com/wallet-standard/wallet-standard/blob/master/packages/example/wallets/src/solanaWallet.ts

// Use wallet-adapter/packages/starter/example to test
// Inside that project @solana/wallet-standard-wallet-adapter-base/lib/esm/adapter.js
// is the file most of this connects to.

const makeAccount = (publicKey: PublicKey): WalletAccount => {
  return {
    address: publicKey.toBase58(),
    publicKey: publicKey.toBytes(),
    chains: [SOLANA_MAINNET_CHAIN],
    features: [SolanaSignAndSendTransaction, SolanaSignTransaction, SolanaSignMessage],
  };
};

const checkChainsAndFeature = (account: WalletAccount, feature: `${string}:${string}`) => {
  if (!account.features.includes(feature)) {
    throw new WalletError("invalid feature");
  }

  if (!account.publicKey) {
    throw new WalletError("invalid account");
  }
};

const connect: StandardConnectMethod = async ({
  // From type definition
  // "If this flag is used by the Wallet, the Wallet should not prompt the user, and should return only the accounts that the app is authorized to use.""
  silent = false,
} = {}): Promise<StandardConnectOutput> => {
  log(`⚡ Connect. Is silent is: ${silent}`);
  const reply = await sendMessageAndMaybeGetReplyOrTimeout(
    {
      topic: "getPublicKey",
      url: window.location.href,
    },
    "replyGetPublicKey"
  );

  if (!reply?.publicKey) {
    log(`Didn't get a public key from the front end`);
    // Wallet standard is to throw errors
    if (activeAccounts.length) {
      log(
        `User didn't respond to this connect request, but it looks like we already connected via a different request.`
      );
      return { accounts: activeAccounts };
    }
    throw new WalletConnectionError(`Did not accept connection`);
  }
  const publicKeyDecoded = base58.decode(reply.publicKey);
  const publicKey = new PublicKey(publicKeyDecoded);

  activeAccounts.push(makeAccount(publicKey));

  log(`Returning accounts`, activeAccounts);
  return { accounts: activeAccounts };
};

const disconnect = async () => {
  log("🔌 Disconnect");
  activeAccounts = [];
  return { accounts: activeAccounts };
};

const signMessage = async (accountAndMessage: SolanaSignMessageInput) => {
  // log("Sign message", accountAndMessage);
  const outputs: Array<SolanaSignMessageOutput> = [];

  // A little weird, but the wallet-adapter test page expects
  // - a single input
  // - multiple outputs

  checkChainsAndFeature(accountAndMessage.account, "solana:signMessage");

  // First, convert the Solana message to a string, but also 'message' is a confusing
  // variable name, since we already have window.postMessage() and 'message' is a different type of message
  const text = convertSolanaMessageToString(accountAndMessage.message);

  // Send message to the content script
  const reply = await sendMessageAndMaybeGetReplyOrTimeout(
    {
      topic: "walletStandardSignMessage",
      url: window.location.href,
      text,
    },
    "replyWalletStandardSignMessage"
  );

  if (!reply.isApproved) {
    log(`🤔 User didn't sign.`);
    // Wallet Standard behaviour is to throw an error for this
    throw new WalletSignMessageError("Signature was not approved");
  }
  const signature = base58.decode(reply.signature);
  log(`😀 Woo, we have a signature!`);

  const output: SolanaSignMessageOutput = {
    signedMessage: accountAndMessage.message,
    signature: signature,
  };

  outputs.push(output);

  return outputs;
};

// Could also be called 'signTransaction'
// but I think that puts the emphasis on signing,
// whereas from a user and infosec point of view, you're approving
// (or declining) a transaction where you may lose money.
const approveTransaction: SolanaSignTransactionMethod = async (...inputs) => {
  log("Sign transaction arguments:", ...inputs);
  const outputs: SolanaSignTransactionOutput[] = [];
  for (const { transaction, account, chain } of inputs) {
    checkChainsAndFeature(account, "solana:signTransaction");

    // Make the wallet popup show an icon so the users clicks on it.
    // Give the user some time to approve, decline or do nothing
    const reply = await sendMessageAndMaybeGetReplyOrTimeout(
      {
        topic: "walletStandardApproveTransaction",
        url: window.location.href,
        transaction: base58.encode(transaction),
      },
      "replyWalletStandardApproveTransaction"
    );

    if (!reply.isApproved) {
      throw new WalletSignTransactionError("Signature declined");
    }

    const signedTransaction = base58.decode(reply.signedTransaction);

    outputs.push({
      signedTransaction: signedTransaction,
    });
  }

  return outputs;
};
// Portal's implementation of the wallet standard
// We use functional programming because 90-s style OOP is garbage.
export const portalWalletStandardImplementation: WalletStandard = {
  name: NAME,
  version: VERSION,
  icon: ICON,
  // Copied from https://github.com/solana-labs/wallet-standard
  chains: SOLANA_CHAINS,
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
      signTransaction: approveTransaction,
    },
    [SolanaSignMessage]: {
      version: "1.0.0",
      signMessage,
    },
    // We can also add a 'portal:' name space if we want, but there's no need right now
  },
  accounts: activeAccounts,
};
