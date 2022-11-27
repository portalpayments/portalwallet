<script lang="ts">
  import { log, isEmpty } from "../../backend/functions";
  import verifiedIcon from "../../assets/verified.svg";
  import AnonymousImage from "../../assets/anonymous.svg";

  import type { Contact } from "../types";

  export let onClick;

  export let user: Contact | null;
</script>

<div class="header">
  <div class="gradient-border">
    <button class="menu" on:click={onClick}>
      {#if isEmpty(user?.verifiedClaims)}
        <img class="avatar" src={AnonymousImage} alt="Anonymous" />
        Anonymous
      {:else}
        <img
          class="avatar"
          src={user.verifiedClaims.imageUrl}
          alt="{user.verifiedClaims.givenName} {user.verifiedClaims.familyName}"
        />

        {user.verifiedClaims.givenName}
        <img class="verified" src={verifiedIcon} alt="Verified" />
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
    padding: 0 6px 0 0;
    border-radius: 21px;
    cursor: pointer;
    font-weight: 600;
    border: 0;
    font-size: 14px;
  }

  button img {
    vertical-align: middle;
  }
  button img.avatar {
    width: 32px;
    height: 32px;
    border-radius: 15px;
  }

  button img.verified {
    width: 22px;
    height: 22px;
  }
</style>
