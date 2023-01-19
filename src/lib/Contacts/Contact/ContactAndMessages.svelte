<script lang="ts">
  import Messages from "./Messages.svelte";
  import { tokenAccountsStore, contactsStore, authStore } from "../../stores";
  import type { Keypair } from "@solana/web3.js";
  import { get as getFromStore } from "svelte/store";
  import { log, stringify } from "../../../backend/functions";
  import { getOrMakeThread } from "../../../backend/messaging";
  import type {
    Contact as ContactType,
    SimpleTransaction,
  } from "../../../backend/types";
  import SendToContact from "./SendToContact.svelte";
  import Contact from "../../Shared/Contact.svelte";
  import BackButton from "../../Shared/BackButton.svelte";
  import type { Thread } from "@dialectlabs/sdk";

  let contact: ContactType | null = null;

  let thread: Thread | null = null;

  // Use the page address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  const getThread = async (keyPair: Keypair, walletAddress: string) => {
    thread = await getOrMakeThread(keyPair, walletAddress);
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

      getThread(auth.keyPair, contact.walletAddress);
    }
  });

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  let transactionsForContact: Array<SimpleTransaction> = [];

  tokenAccountsStore.subscribe((newValue) => {
    // Filter our transactions to just the ones from this single contact
    if (newValue) {
      transactionsForContact = newValue
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
    }
  });
</script>

<div class="contact-screen">
  {#if contact}
    <div class="heading">
      <BackButton />
      <Contact {contact} />
    </div>
    <Messages transactions={transactionsForContact} />
    <SendToContact {contact} />
  {:else}
    Loading contact
  {/if}
</div>

<style lang="scss">
  .contact-screen {
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr 48px;
  }
</style>
