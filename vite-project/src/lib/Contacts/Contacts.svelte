<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import { LabelColor } from "../constants";
  interface Contact {
    image: string;
    name: string;
    isAnonymous: boolean;
    isNew: boolean;
    isPending: boolean;
  }
  export let contacts: Array<Contact>;
</script>

<div class="contacts">
  {#each contacts as contact}
    <div class="contact">
      <img src={contact.image} alt="wallet avatar" />

      <div class="name-and-labels">
        <div class="name">{contact.name}</div>
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
    overflow-y: scroll;
  }

  .name-and-labels {
    display: grid;
    grid-auto-flow: row;
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
</style>
