<script lang="ts">
  import ContactHeading from "./ContactHeading.svelte";
  import Transactions from "./Transactions.svelte";
  import { transactionsStore, contactsStore } from "../../stores";
  import { log, stringify } from "../../../backend/functions";
  import type { Contact, TransactionSummary } from "../../../lib/types";
  import SendMoney from "./SendMoney.svelte";

  let contact: Contact | null = null;

  // Use the wallet address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  contactsStore.subscribe((newValue) => {
    const foundContact = newValue.find((contact) => {
      return contact.walletAddress === contactWalletAddress;
    });
    if (!foundContact) {
      throw new Error(`Could not find contact in contacts store`);
    }
    contact = foundContact;
  });

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  // TODO: maybe filter our transactions to just the ones from this single contact?
  let transactions: Array<TransactionSummary> = [];

  transactionsStore.subscribe((newValue) => {
    transactions = newValue;
  });
</script>

<div class="contactPage">
  {#if contact}
    <ContactHeading {contact} />
    <Transactions {transactions} />
    <SendMoney {contact} />
  {:else}
    Loading contact
  {/if}
</div>

<style>
  .contactPage {
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr;
  }
</style>
