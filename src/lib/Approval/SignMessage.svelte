<script lang="ts">
  import { log, stringify } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { PendingUserApproval } from "../../backend/types";

  import { pendingUserApprovalStore } from "../../lib/stores";

  export let pendingUserApproval: PendingUserApproval;

  const formatURL = (string: String) => {
    return string.replace(/\/$/, "");
  };
</script>

<div class="sign-message-screen">
  <div class="heading">
    <Heading theme="finance">Sign Message?</Heading>
  </div>

  <div class="prompt">
    <!-- TODO: add favicon -->
    <p>
      The site at <span class="url">{formatURL(pendingUserApproval.url)}</span> is
      asking you to sign this message:
    </p>

    <q>
      {pendingUserApproval.text}
    </q>

    <div class="choices">
      <div class="rounded-gradient-border-hack decline">
        <button
          on:click={() => {
            log(`Declining to sign message`);
            pendingUserApprovalStore.set(null);
          }}
        >
          <!-- Since the previous hack needs a white background, we need another div to the 'background as gradient text' hack -->
          <div class="gradient-text-hack">Decline</div></button
        >
      </div>

      <div class="rounded-gradient-border-hack agree">
        <button
          on:click={() => {
            log(`Signing message request`);
            pendingUserApprovalStore.set(null);
          }}>Sign & agree</button
        >
      </div>
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

  .rounded-gradient-border-hack {
    display: grid;
    align-content: center;
    padding: 0.5px;
    width: 100%;
    height: 36px;

    border-radius: 24px;
    place-items: center;
    @include shadow;
  }

  // TODO: we don't want to prefer either button
  // maybe make both buttons white (so neither is 'active')?

  .rounded-gradient-border-hack.decline {
    padding: 0.5px;
    background: var(--blue-green-gradient);
  }

  .rounded-gradient-border-hack.decline button {
    background: var(--white);
  }

  .rounded-gradient-border-hack.decline button .gradient-text-hack {
    @include blue-green;
  }
  .rounded-gradient-border-hack.agree {
    background: var(--blue-green-gradient);
    color: var(--white);
  }

  .rounded-gradient-border-hack.agree button {
    color: var(--white);
    background: transparent;
  }

  button {
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 16px;
    // 36px parent plus 2 x 0.5px border
    height: 35px;
    width: 100%;
    // 35px / 2
    border-radius: 17.5px;
  }
</style>