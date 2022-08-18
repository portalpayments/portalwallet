<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import { Priority } from "../constants";
  interface Contact {
    image: string;
    name: string;
    isVerified: boolean;
    isNew: boolean;
    isPending: boolean;
  }
  export let contacts: Array<Contact>;
</script>

<div class="contacts">
  {#each contacts as contact}
    <div class="contact">
      <img src={contact.image} alt="wallet avatar" />
      <div class="name">{contact.name}</div>
      {#if !contact.isVerified}
        <Label priority={Priority.info}>Anonymouse</Label>
      {/if}
      {#if !contact.isNew}
        <Label priority={Priority.info}>New</Label>
      {/if}
      {#if !contact.isPending}
        <Label priority={Priority.info}>Pending verification</Label>
      {/if}
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
    overflow-y: scroll;
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

  img {
    width: 100%;
  }
</style>
