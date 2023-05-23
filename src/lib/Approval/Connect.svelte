<script lang="ts">
  import { log, formatURL } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import Choices from "./Choices.svelte";
  import type { PendingUserApprovalGetPublicKey, PortalMessage } from "../../backend/types";
  import { pendingUserApprovalStore, authStore } from "../../lib/stores";
  import { get as getFromStore } from "svelte/store";

  export let pendingUserApproval: PendingUserApprovalGetPublicKey;

  const declineToConnect = async () => {
    log(`Declining to connect`);

    sendMessage(pendingUserApproval.tabId, {
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

    sendMessage(pendingUserApproval.tabId, {
      topic: "replyGetPublicKey",
      isApproved: true,
      publicKey,
    });

    pendingUserApprovalStore.set(null);

    log(`Sent 'replyGetPublicKey' message`);
    window.close();
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

    <p>ℹ️ The site will be able to see your wallet address and name.</p>

    <Choices declineLabel="Decline" onDecline={declineToConnect} approveLabel={"Connect"} onApprove={approveConnect} />
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
</style>
