<script lang="ts">
  import { log, isEmpty } from "../../backend/functions";
  import verifiedIcon from "../../assets/verified.svg";

  import type { Contact } from "../types";

  export let onClick;

  export let user: Contact | null;
</script>

<div class="header">
  <div class="gradient-border">
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

  .gradient-border {
    height: 36px;
    border-radius: 18px;
  }

  button {
    background: white;
    color: var(--black);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    cursor: pointer;
    font-weight: 600;
    border: 0;
    font-size: 14px;
  }
  button img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
</style>
