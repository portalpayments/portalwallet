<script lang="ts">
  import Messages from "./Messages.svelte";
  import { tokenAccountsStore, contactsStore, authStore } from "../../stores";
  import type { Keypair } from "@solana/web3.js";
  import { get as getFromStore } from "svelte/store";
  import { log, stringify, repeat } from "../../../backend/functions";
  import { SECONDS } from "../../../backend/constants";
  import {
    getOrMakeThread,
    addOnlyUniqueNewMessages,
  } from "../../../backend/messaging";
  import {
    type Contact as ContactType,
    type SimpleTransaction,
    type SimpleWalletMessage,
    Direction,
  } from "../../../backend/types";
  import SendMessageInput from "./SendMessageInput.svelte";
  import Contact from "../../Shared/Contact.svelte";
  import BackButton from "../../Shared/BackButton.svelte";
  import type { Thread } from "@dialectlabs/sdk";

  const DIALECT_POLL_INTERVAL = 30 * SECONDS;

  import { getTransactionsAndMessagesByDays } from "../../../backend/messaging";

  // Use the page address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  let contact: ContactType | null = null;

  let transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage> =
    [];

  let transactionsAndMessagesByDays: Array<{
    isoDate: string;
    transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>;
  }>;

  let thread: Thread | null;
  $: thread = null;

  const updateTransactionsAndMessages = (
    newItems: Array<SimpleTransaction | SimpleWalletMessage>
  ) => {
    log(`In updateTransactionsAndMessages, ${newItems.length} items to add`);

    const combinedUniqueTransactionsAndMessages = addOnlyUniqueNewMessages(
      transactionsAndMessages,
      newItems
    );

    transactionsAndMessages = combinedUniqueTransactionsAndMessages;

    transactionsAndMessagesByDays = getTransactionsAndMessagesByDays(
      transactionsAndMessages
    );
  };

  // As of 2022 01 19 Chris at Dialect mentions their SDK doesn't have thread subscriptions yet
  // TODO: replace when Dialect add thread subscriptions
  const startPolling = async (
    keyPair: Keypair,
    otherPersonWalletAddress: string,
    interval: number
  ) => {
    const getThread = async () => {
      log(`Pulling dialect messages....`);
      thread = await getOrMakeThread(keyPair, otherPersonWalletAddress);
      const rawMessages = await thread.messages();
      const messages: Array<SimpleWalletMessage> = rawMessages.map(
        (rawMessage) => {
          const dateNumber = new Date(rawMessage.timestamp).valueOf();
          return {
            // Make an ID that is unique to this message
            id: `dialect-${dateNumber}-${rawMessage.author.address}`,
            date: dateNumber,
            memo: rawMessage.text,
            direction:
              rawMessage.author.address === keyPair.publicKey.toBase58()
                ? Direction.sent
                : Direction.recieved,
            isDialectMessage: true,
          };
        }
      );

      updateTransactionsAndMessages(messages);
    };
    // Do this every interval
    repeat(async () => {
      await getThread();
    }, interval);
  };

  contactsStore.subscribe(async (newValue) => {
    if (newValue) {
      const foundContact = newValue.find((contact) => {
        return contact.walletAddress === contactWalletAddress;
      });
      if (!foundContact) {
        throw new Error(
          `Could not find counterParty contact in contacts store`
        );
      }
      contact = foundContact;

      const auth = getFromStore(authStore);

      startPolling(auth.keyPair, contact.walletAddress, DIALECT_POLL_INTERVAL);
    }
  });

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  tokenAccountsStore.subscribe((newValue) => {
    // Filter our transactions to just the ones from this single contact
    if (newValue) {
      const transactions = newValue
        .map((account) => {
          return account.transactionSummaries.filter((transaction) => {
            if (
              transaction.from === contactWalletAddress ||
              transaction.to === contactWalletAddress
            ) {
              return true;
            }
            return false;
          });
        })
        .flat();
      updateTransactionsAndMessages(transactions);
    }
  });
</script>

<div class="contact-screen">
  {#if contact}
    <div class="heading">
      <BackButton />
      <Contact {contact} />
    </div>
    <Messages {transactionsAndMessagesByDays} />
  {:else}
    Loading contact
  {/if}

  <div class="bottom">
    {#if thread}
      <SendMessageInput {thread} />
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../../../mixins.scss";

  .contact-screen {
    // Explicitly position so bottom can be positioned absolutely and stay on screen
    position: relative;
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
  }

  .heading {
    justify-content: center;
    border-bottom: 1px solid var(--very-light-grey);
  }

  .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 2px 6px;
    @include polymer;
  }
</style>
