<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import { LabelColor } from "../constants";
  import { truncateWallet } from "../utils";
  import anonymousImageUrl from "../../assets/ProfilePics/anonymous.svg";
  import { Link } from "svelte-navigator";
  interface Contact {
    address: string;
    image: string | null;
    name: string | null;
    isAnonymous: boolean;
    isNew: boolean;
    isPending: boolean;
  }
  export let contacts: Array<Contact>;
</script>

<div class="contacts">
  {#each contacts as contact}
    <div class="contact">
      <img src={contact.image || anonymousImageUrl} alt="wallet avatar" />

      <div class="name-and-labels">
        <Link to={"/contacts/" + contact.address} />
        <div class="name">
          {#if contact.name}
            {contact.name}
          {:else}
            {truncateWallet(contact.address)}
          {/if}
        </div>
        {#if contact.isAnonymous || contact.isNew || contact.isPending}
          <div class="labels">
            {#if contact.isNew}
              <Label color={LabelColor.Green}>New</Label>
            {/if}
            {#if contact.isAnonymous}
              <Label color={LabelColor.Grey}>Anonymous</Label>
            {/if}
            {#if contact.isPending}
              <Label color={LabelColor.Yellow}>Pending</Label>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .contacts {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: min-content;
    grid-auto-rows: 70px;
    gap: 0px;
    height: auto;
    overflow-y: hidden;
  }

  .name-and-labels {
    display: grid;
    grid-auto-flow: row;
    position: relative;
  }

  .contact {
    display: grid;
    color: #4d4d4d;
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr;
    border-bottom: 1px solid #e7e7e7;
    align-items: center;
    gap: 8px;
    min-height: 70px;
    padding: 0 12px 0 12px;
  }

  .name {
    text-align: left;
  }

  .labels {
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    gap: 3px;
  }

  img {
    width: 100%;
  }
  .name-and-labels > :global(a) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: transparent;
    z-index: 1;
  }
</style>
