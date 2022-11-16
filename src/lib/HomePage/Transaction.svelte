<script lang="ts">
  import { amountAndDecimalsToMajorAndMinor } from "../../lib/utils";
  import AnonymousImage from "../../assets/anonymous.svg";
  import type { TransactionSummary, Contact } from "../../lib/types";

  import { log, isEmpty, stringify } from "../../backend/functions";
  import { hackProfilePicsByWallet } from "../utils";
  import { Direction } from "../types";

  import { contactsStore } from "../stores";

  export let transaction: TransactionSummary | null;

  // Find the contact for this transaction
  let contact: Contact | null = null;
  contactsStore.subscribe(async (contacts) => {
    let contactWalletAddress: string | null = null;
    if (transaction.direction === Direction.sent) {
      contactWalletAddress = transaction.to;
    }
    if (transaction.direction === Direction.recieved) {
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

<div class={`transaction ${transaction.id}`}>
  {#if contact}
    <!-- TODO src={contact.verifiedClaims?.imageUrl} -->
    <img
      class="profile-pic"
      src={!isEmpty(contact?.verifiedClaims)
        ? hackProfilePicsByWallet[contact.walletAddress] ||
          hackProfilePicsByWallet["generic"]
        : AnonymousImage}
      alt="wallet avatar"
    />
    <div class="name-and-memo">
      <div class="name">
        {#if !isEmpty(contact?.verifiedClaims)}
          {contact.verifiedClaims?.givenName}
          {contact.verifiedClaims?.familyName}
        {:else}
          Unverified
        {/if}
      </div>
      {#if transaction.memo}
        <div class="memo">{transaction.memo}</div>
      {/if}
    </div>
  {/if}
  <div
    class="amount {transaction.direction === Direction.recieved
      ? 'positive'
      : ''}"
  >
    {transaction.direction === Direction.recieved ? "+" : ""}
    {majorAndMinor[0]}.{majorAndMinor[1]}
  </div>
</div>

<style>
  .transaction {
    display: grid;
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

  .name-and-memo {
    text-align: left;
  }

  .memo {
    font-size: 14px;
    /* Solana pay writes long unreadable memos */
    overflow: hidden;
  }

  .amount {
    text-align: right;
    font-weight: 600;
  }

  .positive {
    color: var(--bright-green);
  }
</style>
