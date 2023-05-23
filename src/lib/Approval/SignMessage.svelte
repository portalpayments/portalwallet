<script lang="ts">
  import { log, stringify, formatURL } from "../../backend/functions";
  import { getSignature } from "../../backend/solana-functions";
  import Heading from "../Shared/Heading.svelte";
  import Choices from "./Choices.svelte";
  import type { PendingUserApproval, PortalMessage, PendingUserApprovalSignMessage } from "../../backend/types";
  import { pendingUserApprovalStore, authStore } from "../../lib/stores";
  import { get as getFromStore } from "svelte/store";
  import base58 from "bs58";
  export let pendingUserApproval: PendingUserApprovalSignMessage;

  const declineToSignMessage = async () => {
    log(`Declining to sign message`);

    sendMessage(pendingUserApproval.tabId, {
      topic: "replyWalletStandardSignMessage",
      isApproved: false,
    });

    pendingUserApprovalStore.set(null);

    log(`Sent 'replyWalletStandardSignMessage' message`);
    window.close();
  };

  const approveSigningMessage = async () => {
    log(`Approving signing message`);

    const auth = getFromStore(authStore);

    const signature = getSignature(pendingUserApproval.text, auth.keyPair.secretKey);

    sendMessage(pendingUserApproval.tabId, {
      topic: "replyWalletStandardSignMessage",
      isApproved: true,
      signature: base58.encode(signature),
    });

    pendingUserApprovalStore.set(null);

    log(`Sent 'replyWalletStandardSignMessage' message`);
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
    <Heading theme="finance">Sign Message?</Heading>
  </div>

  <div class="prompt">
    <!-- TODO: add favicon of site to message? -->
    <p>
      The site at <span class="url">{formatURL(pendingUserApproval.url)}</span> is asking you to sign this message:
    </p>

    <q>
      {pendingUserApproval.text}
    </q>

    <p>ℹ️ This won't make any transactions on the blockchain or incur any fee.</p>

    <Choices
      declineLabel="Decline"
      onDecline={declineToSignMessage}
      approveLabel={"Sign & agree"}
      onApprove={approveSigningMessage}
    />
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
</style>
