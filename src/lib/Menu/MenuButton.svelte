<script lang="ts">
  import { log, isEmpty } from "../../backend/functions";
  import verifiedIndividualIcon from "../../assets/verified.svg";
  import verifiedOrganizationIcon from "../../assets/verified-organization.svg";
  import AnonymousImage from "../../assets/anonymous.svg";

  import type { Contact } from "../../backend/types";

  export let onClick;

  export let user: Contact | null;
</script>

<div class="header">
  <div class="fancy-border">
    <button class="menu" on:click={onClick}>
      {#if isEmpty(user?.verifiedClaims)}
        <img class="avatar" src={AnonymousImage} alt="Anonymous" />
        Anonymous
      {:else}
        {#if user.verifiedClaims.type === "INDIVIDUAL"}
          <img
            class="avatar"
            src={user.verifiedClaims.imageUrl}
            alt="{user.verifiedClaims.givenName} {user.verifiedClaims
              .familyName}"
          />
          {user.verifiedClaims.givenName}
          <img class="verified" src={verifiedIndividualIcon} alt="Verified" />
        {/if}
        {#if user.verifiedClaims.type === "ORGANIZATION"}
          <img
            class="avatar"
            src={user.verifiedClaims.imageUrl}
            alt="{user.verifiedClaims.legalName} ({user.verifiedClaims
              .country})"
          />
          {user.verifiedClaims.legalName}
          ({user.verifiedClaims.country})
          <img class="verified" src={verifiedOrganizationIcon} alt="Verified" />
        {/if}
      {/if}
    </button>
  </div>
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
  }

  .fancy-border {
    height: 36px;
    border-radius: 18px;
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
