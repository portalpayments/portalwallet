<script lang="ts">
  import Messages from "./Messages.svelte";
  import { tokenAccountsStore, contactsStore, authStore } from "../../stores";
  import type { Keypair } from "@solana/web3.js";
  import { get as getFromStore } from "svelte/store";
  import { log, stringify } from "../../../backend/functions";
  import { SECONDS } from "../../../backend/constants";
  import { getOrMakeThread } from "../../../backend/messaging";
  import {
    type Contact as ContactType,
    type SimpleTransaction,
    type SimpleWalletMessage,
    Direction,
  } from "../../../backend/types";
  import SendToContact from "./SendToContact.svelte";
  import Contact from "../../Shared/Contact.svelte";
  import BackButton from "../../Shared/BackButton.svelte";
  import type { Thread } from "@dialectlabs/sdk";

  // Use the page address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  let contact: ContactType | null = null;

  let transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>;
  $: transactionsAndMessages = [];

  let thread: Thread | null;
  $: thread = null;

  // Join the array with existing values and ensure all values are unique
  // TODO: move to backend
  const updateTransactionsAndMessages = (
    items: Array<SimpleTransaction | SimpleWalletMessage>
  ) => {
    const oldValue = transactionsAndMessages?.length || 0;

    const updatedTransactionsAndMessages =
      transactionsAndMessages.concat(items);
    // Thanks https://stackoverflow.com/a/58429784/123671
    transactionsAndMessages = [
      ...new Map(
        updatedTransactionsAndMessages.map((item) => [item.id, item])
      ).values(),
    ];
    log(
      `Existing transactionsAndMessages was ${oldValue} long, just got ${items.length} to add, result was ${transactionsAndMessages.length} items`
    );
  };

  // As of 2022 01 19 Chris at Dialect mentions their SDK doesn't have thread subscriptions yet
  // TODO: replace when Dialect add thread subscriptions
  const startPolling = async (
    keyPair: Keypair,
    walletAddress: string,
    interval: number
  ) => {
    const getThread = async () => {
      log(`Pulling dialect messages....`);
      thread = await getOrMakeThread(keyPair, walletAddress);
      const rawMessages = await thread.messages();
      const messages: Array<SimpleWalletMessage> = rawMessages.map(
        (rawMessage) => {
          return {
            id: `dialect-${rawMessage.deduplicationId}`,
            date: new Date(rawMessage.timestamp).valueOf(),
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
    setInterval(async () => {
      await getThread();
    }, interval);
    // And also on the 'leading edge', ie now
    await getThread();
  };

  contactsStore.subscribe(async (newValue) => {
    if (newValue) {
      const foundContact = newValue.find((contact) => {
        return contact.walletAddress === contactWalletAddress;
      });
      if (!foundContact) {
        throw new Error(`Could not find contact in contacts store`);
      }
      contact = foundContact;

      const auth = getFromStore(authStore);

      startPolling(auth.keyPair, contact.walletAddress, 30 * SECONDS);
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
    <Messages {transactionsAndMessages} />
  {:else}
    Loading contact
  {/if}
  <div class="bottom">
    {#if thread}
      <SendToContact {thread} />
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
    grid-template-rows: 90px 1fr;
  }

  .heading {
    justify-content: center;
    border-bottom: 1px solid var(--very-light-grey);
  }

  .bottom {
    position: absolute;
    bottom: 0;

    padding: 2px;
    @include polymer;
  }
</style>
