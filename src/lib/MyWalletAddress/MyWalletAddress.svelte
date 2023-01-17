<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Heading from "../Shared/Heading.svelte";
  import QRCode from "../Shared/QRCode.svelte";
  import { copyToClipboard } from "../utils";
  import Clipboard from "../../assets/Icons/copy-gradient-color.svg";

  let isCopied = false;
  export let walletAddress: string | null = window.location.href
    .split("/")
    .pop();
</script>

<div class="container">
  <BackButton />

  <div class="wallet-details">
    <div class="heading">
      <Heading>Wallet Address</Heading>
    </div>
    <div class="copy-button-and-address">
      <div class="address-in-text-form">
        {walletAddress}
      </div>
      <button
        on:click={async () => {
          await copyToClipboard(walletAddress);
          isCopied = true;
        }}
        class="copy-to-clipboard"
      >
        <img src={Clipboard} alt="copy address to clipboard" />
        <span>{isCopied ? "copied!" : "copy"}</span>
      </button>
    </div>
    <QRCode {walletAddress} />
  </div>
</div>

<style lang="scss">
  .container {
    display: grid;
    height: var(--wallet-height);
    width: var(--wallet-width);
    grid-template-rows: 1fr;
    /* eyeballed to align with the back button */
  }
  .heading {
    justify-self: center;
    align-self: end;
  }
  .address-in-text-form {
    position: relative;
    overflow-wrap: anywhere;
    text-align: justify;
    background-color: var(--very-very-light-grey);
    border-radius: 8px;
    padding: 12px 12px;
    font-weight: 500;
    color: #4d4d4d;
  }
  .copy-button-and-address {
    position: relative;
    display: grid;
    gap: 4px;
    padding: 4px;
  }
  .copy-to-clipboard {
    color: #9d9d9d;
    font-size: 0.9rem;
    font-weight: 500;
    align-self: end;
    justify-self: end;
  }
  button {
    background-color: transparent;
  }
  .copy-to-clipboard img {
    width: 16px;
    vertical-align: bottom;
  }
  .wallet-details {
    display: grid;
    width: 90%;
    justify-self: center;
    grid-auto-flow: row;
    gap: 20px;
    grid-template-rows: 78px 110px 310px;
    align-items: center;
  }
</style>
