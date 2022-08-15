<script lang="ts">
  import ContactsHeading from "./ContactsHeading.svelte";
  interface Contact {
    image: string;
    name: string;
  }
  export let contacts: Array<Contact>;
</script>

<div class="contacts">
  {#each contacts as contact}
    <div class="contact">
      <img src={contact.image} alt="wallet avatar" />
      <div class="name">{contact.name}</div>
    </div>
  {/each}
</div>

<style>
  .contacts {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: min-content;
    grid-auto-rows: 70px;
    padding: 0 12px;
    gap: 0px;
    height: auto;
    overflow: scroll;
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
  }

  .name {
    text-align: left;
  }
</style>
