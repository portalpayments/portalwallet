<script lang="ts">
  import { log, isEmpty } from "../../backend/functions";
  import verifiedIcon from "../../assets/verified.svg";

  import type { Contact } from "../types";

  export let onClick;

  export let user: Contact | null;
</script>

<div class="header">
  <button class="menu" on:click={onClick}>
    {#if isEmpty(user?.verifiedClaims)}
      Anonymous
    {:else}
      {user.verifiedClaims.givenName}
      {user.verifiedClaims.familyName}
      <img src={verifiedIcon} alt="Verified" />
    {/if}
  </button>
</div>

<style>
  .header {
    display: grid;
    grid-auto-flow: column;
    padding: 0px 12px;
    align-items: center;
    justify-items: start;
    gap: 4px;
  }
  button {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: var(--dark-blue);
    cursor: pointer;
    font-weight: 600;
    border: 0;
  }
  button img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
</style>
