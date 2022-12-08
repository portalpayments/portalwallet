<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Heading from "../Shared/Heading.svelte";
  import QRCode from "../Shared/QRCode.svelte";
  import CopyToClipboard from "../../assets/Icons/copy-gradient-color.svg";

  let copied = false;
  export let walletAddress: string | null = window.location.href
    .split("/")
    .pop();
  const copyPhrase = async () => {
    //src https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
    await navigator.clipboard.writeText(walletAddress);
    copied = true;
  };
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
      <button on:click={copyPhrase} class="copy-to-clipboard">
        <img src={CopyToClipboard} alt="copy address to clipboard" />
        <span>{copied ? "copied!" : "copy"}</span>
      </button>
    </div>
    <QRCode {walletAddress} />
  </div>
</div>

<style>
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
