<script lang="ts">
  import { log, stringify } from "../../backend/functions";
  import { getSignature } from "../../backend/solana-functions";
  import Heading from "../Shared/Heading.svelte";
  import type { PendingUserApproval, PortalMessage } from "../../backend/types";
  import { pendingUserApprovalStore, authStore } from "../../lib/stores";
  import { get as getFromStore } from "svelte/store";
  import base58 from "bs58";

  export let pendingUserApproval: PendingUserApproval;

  const formatURL = (string: String) => {
    return string.replace(/\/$/, "");
  };

  const declineToConnect = async () => {
    log(`Declining to connect`);

    // TODO: maybe have more types?
    sendMessage(pendingUserApproval.tabId as number, {
      topic: "replyGetPublicKey",
      isApproved: false,
    });

    pendingUserApprovalStore.set(null);

    log(`Sent 'replyGetPublicKey' message`);
    window.close();
  };

  const approveConnect = async () => {
    log(`Approving connect`);

    const auth = getFromStore(authStore);

    const publicKey = auth.keyPair.publicKey.toBase58();

    sendMessage(pendingUserApproval.tabId as number, {
      topic: "replyGetPublicKey",
      isApproved: true,
      publicKey,
    });

    pendingUserApprovalStore.set(null);

    log(`Sent 'replyGetPublicKey' message`);
    //window.close();
  };

  // We MUST use chrome.tabs.sendMessage (not chrome.runtime.sendMessage) to talk to a content script
  // From https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
  // "Note that extensions cannot send messages to content scripts using chrome.runtime.sendMessage(). To send messages to content scripts, use tabs.sendMessage.""
  const sendMessage = (tabId: number, message: PortalMessage) => {
    chrome.tabs.sendMessage(tabId, message);
  };
</script>

<div class="sign-message-screen">
  <div class="heading">
    <Heading theme="finance">Connect?</Heading>
  </div>

  <div class="prompt">
    <p>
      The site at <span class="url">{formatURL(pendingUserApproval.url)}</span> is asking you to connect:
    </p>

    <p>The site will be able to see your wallet address and name.</p>

    <div class="choices">
      <div class="rounded-gradient-border-hack decline">
        <button on:click={declineToConnect}>
          <!-- Since the previous hack needs a white background, we need another div to the 'background as gradient text' hack -->
          <div class="gradient-text-hack">Decline</div></button
        >
      </div>

      <div class="rounded-gradient-border-hack agree">
        <button on:click={approveConnect}>Connect</button>
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
