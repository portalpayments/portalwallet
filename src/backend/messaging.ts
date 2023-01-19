// From https://docs.dialect.to/documentation/messaging/typescript/configuration
import {
  Dialect,
  DialectSdk,
  type DialectCloudEnvironment,
} from "@dialectlabs/sdk";
import {
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
  type Solana,
} from "@dialectlabs/blockchain-sdk-solana";
import type { Keypair } from "@solana/web3.js";
import { MINUTE, SECONDS } from "./constants";

import { log, stringify } from "./functions";

let dialectSDK: DialectSdk<Solana> | null = null;

export const getDialect = (keyPair: Keypair) => {
  if (dialectSDK) {
    return dialectSDK;
  }
  const environment: DialectCloudEnvironment = "production";
  dialectSDK = Dialect.sdk(
    {
      environment,
    },
    SolanaSdkFactory.create({
      wallet: NodeDialectSolanaWalletAdapter.create(keyPair),
    })
  );
  return dialectSDK;
};

export const getMessagesForUser = async (keyPair, walletAddress: string) => {
  // https://docs.dialect.to/documentation/messaging/typescript/getting-creating-and-deleting-threads
  // Call the messages() method to read messages
  const dialectSDK = getDialect(keyPair);

  const decafThread = await dialectSDK.threads.find({
    otherMembers: [walletAddress],
  });

  // Call the messages() method to read messages
  const messages = await decafThread.messages();

  return messages;
};
