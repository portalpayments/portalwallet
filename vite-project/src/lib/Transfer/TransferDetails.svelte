<script lang="ts">
  import TransferHeading from "./TransferHeading.svelte";
  import TransferButtons from "./TransferButons.svelte";
  import TransferButons from "./TransferButons.svelte";
  let walletAddress: string = "";
  let amount: number;
  let verified = false;
</script>

<div class="wallet">
  <div>
    <TransferHeading />
  </div>

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
  <TransferButons isVerified={false} />
</div>

<style>
  .wallet {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    align-items: center;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 100%;
    gap: 30p;
  }
  .detailsContainer {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    justify-content: center;
    align-self: center;
    width: 100%;
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
