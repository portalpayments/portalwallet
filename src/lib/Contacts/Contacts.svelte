<script lang="ts">
  import { Link } from "svelte-navigator";
  import { contactsStore } from "../stores";
  import type { Contact } from "../../backend/types";

  import Unverified from "../Shared/Unverified.svelte";
  import Verified from "../Shared/Verified.svelte";

  let contacts: Array<Contact>;

  contactsStore.subscribe((newValue) => {
    if (newValue) {
      contacts = newValue;
    }
  });
</script>

<div class="contacts">
  {#each contacts as contact}
    <Link to={"/contacts/" + contact.walletAddress}>
      <div class="contact">
        {#if contact.verifiedClaims}
          <Verified {contact} />
        {:else}
          <Unverified {contact} />
        {/if}
      </div>
    </Link>
  {/each}
  {#if !contacts.length}
    No contacts.
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .contacts {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: min-content;
    grid-auto-rows: 70px;
    gap: 0px;
    height: auto;
    overflow-y: scroll;
  }

  .contact {
    display: grid;
    color: var(--black);
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr;
    border-bottom: 1px solid #e7e7e7;
    align-items: center;
    gap: 8px;
    min-height: 70px;
    padding: 0 12px 0 12px;
  }
</style>
