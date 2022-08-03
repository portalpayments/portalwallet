<script lang="ts">
  const log = console.log;
  let currentFeature: number = 0;
  const navigate = (newFeature) => {
    log(`Changing currentFeature to ${newFeature}`);
    currentFeature += newFeature;
  };
</script>

<div class="wallet">
  <div class="features">
    <div class="feature transfer">transfer</div>
    <div class="feature contacts">contacts</div>
    <div class="feature collectibles">collectibles</div>
  </div>
  <nav>
    <button class="transfer" on:click={() => navigate(0)}>icon</button>
    <button class="contacts" on:click={() => navigate(1)}>icon</button>
    <button class="collectibles" on:click={() => navigate(2)}>icon</button>
  </nav>
</div>

<style>
  :root {
    --wallet-height: 600px;
    --wallet-width: 300px;
  }
  * {
    display: grid;
    background-color: white;
    box-sizing: border-box;
  }

  /* The entire wallet, contains the sliding main area plus the nav bar */
  .wallet {
    width: var(--wallet-width);
    height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 1fr 48px;
  }

  .increment-count {
    width: 20px;
    height: 20px;
  }

  /* The sliding area with each of our features (wider than our actual app)*/
  .features {
    background-color: #ccc;
    width: calc(3 * var(--wallet-width));
    grid-auto-flow: column;
    gap: 12px;
    padding: 12px;
  }

  .feature {
    background-color: #999;
  }
  nav {
    width: var(--wallet-width);
    grid-auto-flow: row;
    grid-auto-flow: column;
  }

  nav button {
    width: 20px;
    color: black;
  }

  nav .transfer {
    background-image: url("assets/transfer.svg");
  }
</style>
