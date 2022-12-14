<script lang="ts">
  import Transactions from "./Transactions.svelte";
  import { tokenAccountsStore, contactsStore } from "../../stores";
  import { log, stringify } from "../../../backend/functions";
  import type { Contact as ContactType, TransactionSummary } from "../../types";
  import SendToContact from "./SendToContact.svelte";
  import Contact from "../../Shared/Contact.svelte";
  import BackButton from "../../Shared/BackButton.svelte";

  let contact: ContactType | null = null;

  // Use the page address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  contactsStore.subscribe((newValue) => {
    if (newValue) {
      const foundContact = newValue.find((contact) => {
        return contact.walletAddress === contactWalletAddress;
      });
      if (!foundContact) {
        throw new Error(`Could not find contact in contacts store`);
      }
      contact = foundContact;
    }
  });

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  let filteredTransactions: Array<TransactionSummary> = [];

  tokenAccountsStore.subscribe((newValue) => {
    // Filter our transactions to just the ones from this single contact
    filteredTransactions = newValue
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
  });
</script>

<div class="contact-page">
  {#if contact}
    <div class="heading">
      <BackButton />
      <Contact {contact} />
    </div>
    <Transactions transactions={filteredTransactions} />
    <SendToContact {contact} />
  {:else}
    Loading contact
  {/if}
</div>

<style>
  .contact-page {
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr;
  }
</style>
