<script lang="ts">
  import { log, isEmpty } from "../../backend/functions";
  import verifiedIndividualIcon from "../../assets/verified.svg";
  import verifiedOrganizationIcon from "../../assets/verified-organization.svg";
  import { getGradient } from "../../backend/deterministic-beautiful-gradient";
  import { onMount } from "svelte";
  import type { Contact } from "../../backend/types";

  let gradient: string | null = null;

  onMount(async () => {
    if (user) {
      gradient = await getGradient(user.walletAddress);
    }
  });

  export let onClick;

  export let user: Contact | null;
</script>

<div class="header">
  <button class="menu" on:click={onClick}>
    {#if isEmpty(user?.verifiedClaims)}
      <div class="profile-pic" style={gradient} />
    {:else}
      {#if user.verifiedClaims.type === "INDIVIDUAL"}
        <img
          class="profile-pic"
          src={user.verifiedClaims.imageUrl}
          alt="{user.verifiedClaims.givenName} {user.verifiedClaims.familyName}"
        />
        {user.verifiedClaims.givenName}
        <img class="verified" src={verifiedIndividualIcon} alt="Verified" />
      {/if}
      {#if user.verifiedClaims.type === "ORGANIZATION"}
        <img
          class="profile-pic"
          src={user.verifiedClaims.imageUrl}
          alt="{user.verifiedClaims.legalName} ({user.verifiedClaims.country})"
        />
        {user.verifiedClaims.legalName}
        ({user.verifiedClaims.country})
        <img class="verified" src={verifiedOrganizationIcon} alt="Verified" />
      {/if}
    {/if}
  </button>
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .header {
    display: grid;
    grid-auto-flow: column;
    padding: 0px 12px;
    align-items: center;
    justify-items: start;
    gap: 4px;
  }

  button {
    background: white;
    color: var(--black);
    padding: 1px 6px 1px 1px;
    border-radius: 21px;
    cursor: pointer;
    font-weight: 600;
    border: 0;
    font-size: 14px;
    @include gradient-border(1px);
  }

  button img {
    vertical-align: middle;
  }

  button img.profile-pic {
    width: 32px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  button img.verified {
    width: 22px;
    height: 22px;
  }
</style>
