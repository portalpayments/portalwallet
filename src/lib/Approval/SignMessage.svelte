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
    <Heading theme="finance">Approve Message?</Heading>
  </div>

  <div class="prompt">
    <!-- TODO: add address of site, maybe favicon -->
    There is a pending user approval. Signature request {pendingUserApproval.text}
    is asking you to approve this message:

    <div class="text-to-sign">
      {pendingUserApproval.text}
    </div>
  </div>
  <button
    class="approve"
    on:click={() => {
      log(`Signing message request`);
      pendingUserApprovalStore.set(null);
    }}>Approve</button
  >
  <button
    class="decline"
    on:click={() => {
      log(`Declining to sign message`);
      pendingUserApprovalStore.set(null);
    }}>Decline</button
  >
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .sign-message-screen {
    align-content: start;
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr;
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
    overflow-y: scroll;
  }

  .heading {
    height: 42px;
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
  }

  .prompt {
  }

  .text-to-sign {
    font-style: italic;
  }

  button {
  }

  .approve {
  }

  .decline {
  }
</style>
