<script lang="ts">
  import { Link } from "svelte-navigator";
  import Label from "../../Shared/Label.svelte";
  import { LabelColor } from "../../constants";
  import type { Contact } from "../../types";
  import type { TokenMetaDataClaims } from "../../../../../src/types";

  export let contact: Contact | null = null;
  export let verifiedClaims: TokenMetaDataClaims | null = null;
</script>

<div class="heading-container">
  <div class="back-button">
    <Link to="/">‹</Link>
  </div>

  HELLO

  {#if contact && verifiedClaims}
    <img src={contact.image} alt={contact.name} />

    <div class="name">
      {contact.name}
      <div class="labels">
        {#if contact.isAnonymous}
          <Label color={LabelColor.Grey}>unverified</Label>
        {/if}
        {#if contact.isPending}
          <Label color={LabelColor.Yellow}>Pending</Label>
        {/if}
      </div>
    </div>
  {:else}
    Loading
  {/if}
</div>

<style>
  .heading-container {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 30px 60px 1fr;
    gap: 10px;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
    margin-top: 10px;
    border-bottom: 1px solid #d9d9d9;
  }

  .name {
    display: grid;
    grid-auto-flow: row;
    text-align: left;
    font-size: 1.2rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  .back-button {
    font-size: 2rem;
    padding: 10px;
    width: 10%;
  }
  img {
    width: 55px;
    margin: auto;
  }

  /* global is needed for 'a' element under Link */
  .back-button :global(a) {
    text-decoration: none;
    padding: 7px 0px;
    background-color: transparent;
    display: inline-block;
    color: #3a3a3a;
    font-size: 2rem;
    font-weight: 400;
  }
  .labels {
    display: grid;
    grid-auto-flow: column;
  }
</style>
