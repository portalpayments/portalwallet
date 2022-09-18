<script lang="ts">
  import { amountAndDecimalsToMajorAndMinor } from "../../lib/utils";
  import type { TransactionSummary, Contact } from "../../lib/types";

  import { log, stringify } from "../../backend/functions";
  import { hackProfilePicsByWallet } from "../utils";

  import { contactsStore } from "../stores";

  export let transaction: TransactionSummary;

  // Find the contact for this transaction
  let contact: Contact | null = null;
  contactsStore.subscribe(async (contacts) => {
    let contactWalletAddress: string | null = null;
    if (transaction.direction === "sent") {
      contactWalletAddress = transaction.to;
    }
    if (transaction.direction === "recieved") {
      contactWalletAddress = transaction.from;
    }
    contact = contacts.find(
      (contact) => contact.walletAddress === contactWalletAddress
    );
    if (!contact) {
      log(
        `Contact for ${contactWalletAddress} used in this transaction hasn't yet loaded in contact store`
      );
    }
  });

  const majorAndMinor = amountAndDecimalsToMajorAndMinor(
    String(transaction.amount),
    6
  );
</script>

<div class="transaction">
  {#if contact}
    <!-- TODO src={contact.verifiedClaims?.imageUrl} -->
    <img
      class="profile-pic"
      src={hackProfilePicsByWallet[contact.walletAddress]}
      alt="wallet avatar"
    />
    <div class="name">
      {contact.verifiedClaims?.givenName}
      {contact.verifiedClaims?.familyName}
    </div>
  {/if}
  <div class="amount {transaction.direction === 'recieved' ? 'positive' : ''}">
    {transaction.direction === "recieved" ? "+" : ""}
    {majorAndMinor[0]}.{majorAndMinor[1]}
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
