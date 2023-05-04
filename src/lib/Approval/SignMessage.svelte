<script lang="ts">
  import { log, stringify, formatObjectKeys } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type {
    Contact as ContactType,
    PendingUserApproval,
  } from "../../backend/types";

  import { pendingUserApprovalStore } from "../../lib/stores";

  export let pendingUserApproval: PendingUserApproval;
</script>

<div class="sign-message-screen">
  <div class="heading">
    <Heading theme="finance">Sign Message?</Heading>
  </div>

  <div class="prompt">
    <!-- TODO: add favicon -->
    <p>
      The site at <span class="url">{pendingUserApproval.url}</span> is asking you
      to sign this message:
    </p>

    <q>
      {pendingUserApproval.text}
    </q>

    <div class="choices">
      <button
        class="decline"
        on:click={() => {
          log(`Declining to sign message`);
          pendingUserApprovalStore.set(null);
        }}>Decline</button
      >

      <button
        class="agree"
        on:click={() => {
          log(`Signing message request`);
          pendingUserApprovalStore.set(null);
        }}>Agree</button
      >
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .sign-message-screen {
    align-content: start;
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr;
    background: radial-gradient(at 50% 50%, #ddffef 0, #fff 80%, #fff 100%);
    overflow-y: scroll;
    text-align: left;
    line-height: 20px;
    font-size: 16px;
  }

  .heading {
    height: 42px;
    text-align: left;
    padding: 0;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
  }

  p {
    margin: 0;
  }

  .prompt {
    gap: 24px;
  }

  .url {
    font-weight: 600;
  }

  // The quote needs to look *not* like Portal's UI
  // because it might be a bunch of deceptive bullshit from someone's website
  q {
    font-style: italic;
    background-color: var(--black);
    color: var(--white);
    text-align: center;
    padding: 24px 12px;
    min-height: 128px;
  }

  .choices {
    display: grid;
    grid-auto-flow: column;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
  }

  button {
    display: grid;
    align-content: center;
    width: 100%;
    height: 36px;
    padding: 12px 0px;
    margin: auto;

    font-weight: 600;
    font-size: 16px;
    border-radius: 24px;
  }

  .decline {
    color: var(--mid-blue);
    background: var(--white);
    border: 0.5px solid var(--mid-blue);
    @include grey-shadow;
  }

  .agree {
    color: #fff;
    background: var(--blue-green-gradient);
    @include shadow;
    // We don't want to prefer either button
  }
</style>
