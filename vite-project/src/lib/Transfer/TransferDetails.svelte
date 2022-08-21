<script lang="ts">
  import TransferHeading from "./TransferHeading.svelte";

  import TansferHeading from "./TransferHeading.svelte";
  let walletAddress: string = "";
  let amount: number;
  let verified = false;
</script>

<div class="wallet">
  <TransferHeading />

  <div class="detailsContainer">
    <div class="Input">
      <input bind:value={walletAddress} type="text" required />
      <span class="floating-label">wallet address</span>
    </div>
    <div class="Input">
      <input bind:value={amount} type="text" required />
      <span class="floating-label">amount</span>
    </div>
  </div>
</div>

<style>
  .wallet {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    justify-content: center;
    align-items: center;
  }
  .detailsContainer {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    width: 80%;
    gap: 15px;
  }
  input {
    border-radius: 9px;
    padding: 8px 0px 0px 10px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
    font-size: 14px;
    width: 200px;
    height: 35px;
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  input:focus ~ .floating-label,
  input:not(:focus):valid ~ .floating-label {
    top: 1px;
    font-size: 0.7rem;
    opacity: 1;
  }

  .floating-label {
    position: absolute;
    pointer-events: none;
    color: #9d9d9d;
    left: 15px;
    top: 10px;
    transition: 0.2s ease all;
    font-size: 0.9rem;
  }
  .Input {
    position: relative;
  }
</style>
