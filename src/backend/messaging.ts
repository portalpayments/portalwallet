// From https://docs.dialect.to/documentation/messaging/typescript/configuration
import {
  Dialect,
  DialectSdk,
  ThreadMemberScope,
  type CreateThreadCommand,
  type DialectCloudEnvironment,
  type SendMessageCommand,
  type Thread,
} from "@dialectlabs/sdk";
import {
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
  type Solana,
} from "@dialectlabs/blockchain-sdk-solana";
import type { Keypair } from "@solana/web3.js";
import { MINUTE, SECONDS } from "./constants";

import { log, stringify } from "./functions";
import { text } from "svelte/internal";

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

export const getThread = async (keyPair: Keypair, walletAddress: string) => {
  // https://docs.dialect.to/documentation/messaging/typescript/getting-creating-and-deleting-threads
  // Call the messages() method to read messages
  const dialectSDK = getDialect(keyPair);

  const thread = await dialectSDK.threads.find({
    otherMembers: [walletAddress],
  });

  return thread;
};

export const getMessagesForUser = async (
  keyPair: Keypair,
  walletAddress: string
) => {
  // https://docs.dialect.to/documentation/messaging/typescript/getting-creating-and-deleting-threads
  // Call the messages() method to read messages

  const thread = await getThread(keyPair, walletAddress);

  // Call the messages() method to read messages
  const messages = await thread.messages();

  return messages;
};

// Copied directly from
// https://github.com/dialectlabs/sdk/blob/main/packages/blockchain-sdk-solana/examples/helpers.ts
export async function makeThread(
  keyPair: Keypair,
  recipientWalletAddress: string
): Promise<Thread> {
  const dialectSDK = getDialect(keyPair);
  const command: CreateThreadCommand = {
    encrypted: false,
    me: {
      scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
    },
    otherMembers: [
      {
        address: recipientWalletAddress,
        scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
      },
    ],
  };
  const thread = await dialectSDK.threads.create(command);
  return thread;
}

export const getOrMakeThread = async (
  keyPair: Keypair,
  recipientWalletAddress: string
) => {
  let thread: Thread;
  thread = await getThread(keyPair, recipientWalletAddress);
  if (thread !== null) {
    log(`Found existing thread with wallet ${recipientWalletAddress}`);
    return thread;
  }
  log(`Made new thread with wallet ${recipientWalletAddress}`);
  thread = await makeThread(keyPair, recipientWalletAddress);
  return thread;
};

export async function sendDialectMessage(thread: Thread, text: string) {
  const command: SendMessageCommand = {
    text,
  };
  await thread.send(command);
}
