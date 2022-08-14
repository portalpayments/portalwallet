<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import TopToolbar from "./lib/TopToolbar/TopToolbar.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectibles from "./lib/Collectibles/Collectibles.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import { Circle } from "svelte-loading-spinners";
  import { Router, Route, Link } from "svelte-navigator";

  let currentFeature: number = 0;

  const testUser = { name: "Chris Austin", verified: true };
</script>

<Router>
  <main>
    <Route path="addMoneyToAccount"
      ><div class="wallet">adding money to account here</div></Route
    >
    <Route path="transferMoney"
      ><div class="wallet">Transfering money</div></Route
    >

    <Route path="transactions"
      ><div class="wallet">Here go transactions</div></Route
    >
    <Route path="/">
      <div class="wallet">
        <TopToolbar {...testUser} />
        <div class="features">
          <div class="feature">
            {#if currentFeature == 0}
              <HomeScreen />
            {:else if currentFeature == 1}
              <ContactsPage />
            {:else if currentFeature == 2}
              <Collectibles />
            {/if}
          </div>
        </div>
      </div>
      <Navbar bind:currentFeature />
    </Route>
  </main>
</Router>

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
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 80px 1fr;
  }
  .feature {
    background-color: white;
  }
</style>
