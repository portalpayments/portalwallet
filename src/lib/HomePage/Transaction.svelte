<script lang="ts">
  import {
    getFormattedMajorUnits,
    getFormattedMinorUnits,
  } from "../../lib/utils";
  import type { TransactionSummary, Contact } from "../../lib/types";

  import { contactsStore } from "../stores.js";

  export let transaction: TransactionSummary;

  // Find the contact for this transaction
  let contact: Contact;
  contactsStore.subscribe((contacts) => {
    contact = contacts.find((contact) => {
      if (transaction.direction === "sent") {
        return contact.walletAddress === transaction.to;
      }
      return contact.walletAddress === transaction.from;
    });
  });
</script>

<div class="transaction">
  <img
    class="profile-pic"
    src={contact.verifiedClaims?.imageUrl}
    alt="wallet avatar"
  />
  <div class="name">
    {contact.verifiedClaims?.givenName}
    {contact.verifiedClaims?.familyName}
  </div>
  <div class="amount {transaction.direction === 'recieved' ? 'positive' : ''}">
    {transaction.direction === "recieved" ? "+" : ""}
    {getFormattedMajorUnits(transaction.amount)}{getFormattedMinorUnits(
      transaction.amount
    )}
  </div>
</div>

<style>
  .transaction {
    display: grid;
    height: 64px;
    color: var(--black);
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr 64px;
    align-items: center;
    gap: 8px;
  }

  .profile-pic {
    border-radius: 50%;
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
