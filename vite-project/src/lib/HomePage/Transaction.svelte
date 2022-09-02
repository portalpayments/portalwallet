<script lang="ts">
  import {
    getFormattedMajorUnits,
    getFormattedMinorUnits,
  } from "../../lib/utils";
  import type { Transaction, Contact } from "../../lib/types";

  import { contactsStore } from "../stores.js";

  export let transaction: Transaction;

  let contact: Contact;

  contactsStore.subscribe((newValue) => {
    contact = newValue.find(
      (contact) => contact.walletAddress === transaction.walletAddress
    );
  });
</script>

<div class="transaction">
  <img src={contact.verifiedClaims?.imageUrl} alt="wallet avatar" />
  <div class="name">
    {contact.verifiedClaims?.givenName}
    {contact.verifiedClaims?.familyName}
  </div>
  <div class="amount {transaction.isReceived ? 'positive' : ''}">
    {transaction.isReceived ? "+" : ""}
    {getFormattedMajorUnits(transaction.amount)}{getFormattedMinorUnits(
      transaction.amount
    )}
  </div>
</div>

<style>
  .transaction {
    display: grid;
    height: 64px;
    color: #4d4d4d;
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr 64px;
    align-items: center;
    gap: 8px;
  }

  img {
    width: 100%;
  }

  .name {
    text-align: left;
  }

  .amount {
    text-align: right;
    font-weight: 600;
  }

  .positive {
    color: var(--bright-green);
  }
</style>
