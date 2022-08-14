<script lang="ts">
  let walletAddress: string = "";
  let amount: number = 0;
  let verified = false;
</script>

<div class="wallet">
  <div class="detailsContainer">
    <h2>anonymous</h2>
    <input bind:value={walletAddress} placeholder="wallet address" />
    <input bind:value={amount} placeholder="0" />
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
  ::placeholder {
    font-size: 0.8rem;
    color: #9d9d9d;
  }
  input {
    border-radius: 9px;
    height: 45px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
  }
</style>
