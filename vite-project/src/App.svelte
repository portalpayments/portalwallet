<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import TopToolbar from "./lib/TopToolbar/TopToolbar.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";

  const log = console.log;
  let currentFeature: number = 0;
  const navigate = (newFeature) => {
    log(`Changing currentFeature to ${newFeature}`);
    currentFeature = newFeature;
  };

  const testUser = { name: "Chris Austin", verified: true };
</script>

<main>
  <div class="wallet">
    <TopToolbar {...testUser} />
    <div class="features">
      {#if currentFeature == 0}
        <div class="feature transfer">
          <HomeScreen />
        </div>
      {:else if currentFeature == 1}
        <div>do sth else</div>
      {:else if currentFeature == 2}
        <div>do 3rd else</div>
      {/if}
    </div>

    <Navbar bind:currentFeature />
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
    grid-template-rows: 80px 1fr 72px;
  }
  .feature {
    background-color: white;
  }
</style>
