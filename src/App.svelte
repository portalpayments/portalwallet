<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import TopToolbar from "./lib/TopToolbar/TopToolbar.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectables from "./lib/Collectables/Collectables.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import Onboarding from "./lib/Onboarding/Onboarding.svelte";
  import TransferPage from "./lib/Transfer/TransferPage.svelte";
  import AddMoneyPage from "./lib/AddMoney/AddMoneyPage.svelte";
  import TransactionsPage from "./lib/TransactionsPage/TransactionsPage.svelte";
  import Settings from "./lib/Settings/Settings.svelte";
  import { Keypair } from "@solana/web3.js";
  import { Router, Route } from "svelte-navigator";
  import { connect, verifyWallet } from "./backend/vmwallet";
  import { log } from "./backend/functions";
  import Lock from "./lib/Lock/Lock.svelte";
  import Contact from "./lib/Contacts/Contact/Contact.svelte";
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "./lib/stores";

  $authStore;

  interface User {
    name: string;
    isVerified: boolean;
  }

  let user: null | User = null;

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  authStore.subscribe(async (newValue) => {
    if (newValue.secretKey) {
      log(`🔑Got secret key.`);
      // Connect to Solana
      const newConnection = await connect("ankrMainNet");
      connectionStore.set(newConnection);

      if (!newValue.secretKey) {
        throw new Error(`Couldn't get the secret key from the auth store!`);
      }
      const keypair = Keypair.fromSecretKey(newValue.secretKey);

      if (!keypair) {
        throw new Error(`Could not get keypair from secret key`);
      }

      // Get identity from the portal Identity Token
      const verifiedClaims = await verifyWallet(
        newConnection,
        keypair,
        identityTokenIssuerPublicKey,
        keypair.publicKey
      );

      if (verifiedClaims) {
        user = {
          name: `${verifiedClaims.givenName} ${verifiedClaims.familyName}`,
          isVerified: true,
        };
        return;
      }
      user = {
        name: "Anonymous",
        isVerified: false,
      };
    }
  });

  let currentFeature: number = 0;
</script>

<Router>
  <main>
    {#if false}
      <Onboarding />
    {/if}
    {#if $authStore.isLoggedIn}
      <Route path="addMoneyToAccount"><AddMoneyPage /></Route>
      <Route path="sendMoney"><TransferPage /></Route>

      <Route path="transactions">
        <TransactionsPage />
      </Route>
      <Route path="logout"><Lock /></Route>
      <Route path="settings"><Settings /></Route>
      <Route path="contacts/:address"><Contact /></Route>
      <Route primary={false}>
        <div class="header-and-features">
          <TopToolbar {...user} />
          <div class="features">
            {#if currentFeature === 0}
              <HomeScreen />
            {:else if currentFeature === 1}
              <ContactsPage />
            {:else if currentFeature === 2}
              <Collectables />
            {/if}
          </div>
          <Navbar bind:currentFeature />
        </div>
      </Route>
    {:else}
      <Route><div class="login"><Lock /></div></Route>
    {/if}
  </main>
</Router>

<style>
  /* The entire wallet, contains the header-and-features plus the nav bar */
  main {
    /* Required to absolutely position navbar at bottom 
    relative to this element */
    position: relative;
  }

  .header-and-features {
    width: var(--wallet-width);
    height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 80px 1fr;
  }
</style>
