<script lang="ts">
  import Badge from "./lib/Badge.svelte";
  import Heading from "./lib/Heading.svelte";
  import Balance from "./lib/Balance.svelte";
  const log = console.log;
  let currentFeature: number = 0;
  const navigate = (newFeature) => {
    log(`Changing currentFeature to ${newFeature}`);
    currentFeature += newFeature;
  };
</script>

<main>
  <h1>Demo Svelte frontend</h1>

  <div class="wallet">
    <div class="features">
      <div class="feature transfer">
        transfer
        <Heading>Spending activity</Heading>
        <Balance />
        <Heading>Transactions</Heading>
        <Badge>swag</Badge>
      </div>
      <!-- <div class="feature contacts">contacts</div>
      <div class="feature collectibles">collectibles</div> -->
    </div>
    <nav>
      <button
        class="transfer"
        type="button"
        title="transfer"
        on:click={() => navigate(0)}
      />
      <button
        class="contacts"
        type="button"
        title="contacts"
        on:click={() => navigate(1)}
      />
      <button
        class="collectibles"
        type="button"
        title="collectibles"
        on:click={() => navigate(2)}
      />
    </nav>
  </div>
</main>

<style>
  :root {
    --wallet-height: 600px;
    --wallet-width: 300px;
  }
  * {
    display: grid;
    color: black;
    background-color: white;
    box-sizing: border-box;
  }

  h1 {
    font-size: 12px;
  }

  button:focus,
  button:focus-visible,
  button:hover {
    outline: none;
    border-color: transparent;
  }

  /* The entire wallet, contains the sliding main area plus the nav bar */
  .wallet {
    width: var(--wallet-width);
    height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 1fr 72px;
  }

  .feature {
    background-color: #999;
  }
  nav {
    width: var(--wallet-width);
    grid-auto-flow: column;
    /* gap: 24px; */
    /* Bunch the buttons up together in the center */
    grid-auto-columns: min-content;
    justify-content: center;
  }

  nav button {
    color: red;
    background-size: cover;
    width: 48px;
    height: 48px;
    margin: 12px;
  }

  nav .transfer {
    background-image: url("./assets/transfer.svg");
  }

  nav .contacts {
    background-image: url("./assets/contacts.svg");
  }

  nav .collectibles {
    background-image: url("./assets/collectibles.svg");
  }
</style>
