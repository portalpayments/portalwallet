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
import type { SimpleTransaction, SimpleWalletMessage } from "./types";

import { MINUTE, SECONDS } from "./constants";

import {
  log,
  stringify,
  dateToISODate,
  byDateNewestToOldest,
  byDateOldestToNewest,
} from "./functions";
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
export const makeThread = async (
  keyPair: Keypair,
  recipientWalletAddress: string
): Promise<Thread> => {
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
};

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

export const sendDialectMessage = async (thread: Thread, text: string) => {
  if (text === "") {
    // Dialect will throw odd errors if we send blank string
    throw new Error(`Cannot send empty message`);
  }
  const command: SendMessageCommand = {
    text,
  };
  log(`Command is: `, stringify(command));
  await thread.send(command);
};

type TransactionOrMessage = SimpleTransaction | SimpleWalletMessage;

type DailyActivity = {
  isoDate: string;
  transactionsAndMessages: Array<TransactionOrMessage>;
};

export const getTransactionsAndMessagesByDays = (
  transactionsAndMessages: Array<TransactionOrMessage>
) => {
  let transactionsAndMessagesByDays: Array<DailyActivity> = [];

  transactionsAndMessages.sort(byDateOldestToNewest);

  transactionsAndMessages.forEach((transactionOrMessage) => {
    const isoDate = dateToISODate(transactionOrMessage.date);
    const lastDay = transactionsAndMessagesByDays.at(-1) || null;
    if (lastDay?.isoDate === isoDate) {
      // Add this transaction to the existing entry for this day
      lastDay.transactionsAndMessages.push(transactionOrMessage);
    } else {
      // Create a new item for this day
      const newDailyActivity: DailyActivity = {
        isoDate,
        transactionsAndMessages: [transactionOrMessage],
      };
      transactionsAndMessagesByDays.push(newDailyActivity);
    }
  });

  return transactionsAndMessagesByDays;
};

export const addOnlyUniqueNewMessages = (
  transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>,
  newItems: Array<SimpleTransaction | SimpleWalletMessage>
) => {
  const allTransactionsAndMessagesWithDuplicates =
    transactionsAndMessages.concat(newItems);

  // Thanks https://stackoverflow.com/a/58429784/123671
  const combinedUniqueTransactionsAndMessages = [
    ...new Map(
      allTransactionsAndMessagesWithDuplicates.map((item) => [item.id, item])
    ).values(),
  ];

  return combinedUniqueTransactionsAndMessages;
};
