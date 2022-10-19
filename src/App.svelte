<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectables from "./lib/Collectables/Collectables.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import Onboarding from "./lib/Onboarding/Onboarding.svelte";
  import SendPage from "./lib/Send/SendPage.svelte";
  import AddMoneyPage from "./lib/AddMoney/AddMoneyPage.svelte";
  import TransactionsPage from "./lib/TransactionsPage/TransactionsPage.svelte";
  import Settings from "./lib/Settings/Settings.svelte";
  import { Keypair } from "@solana/web3.js";
  import { Router, Route } from "svelte-navigator";
  import { connect, verifyWallet } from "./backend/vmwallet";
  import { log } from "./backend/functions";
  import type { User } from "./lib/types";
  import Lock from "./lib/Lock/Lock.svelte";
  import Contact from "./lib/Contacts/Contact/ContactAndTransactions.svelte";
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "./lib/stores";
  import { checkIfOnboarded } from "./lib/settings";

  $authStore;

  let user: null | User = null;

  let isOnboarded: null | Boolean = null;

  let currentFeature: number = 0;

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  authStore.subscribe(async (newValue) => {
    if (newValue.secretKey) {
      log(`🔑Got secret key.`);
      // Connect to Solana
      const newConnection = await connect("quickNodeMainNetBeta");
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

  (async () => {
    isOnboarded = await checkIfOnboarded();
    log(`isOnboarded is`, isOnboarded);
  })();
</script>

<Router>
  <main>
    <!-- isOnboarded is null when we haven't loaded localForage yet. After this isOnboarded will be true or false. -->
    {#if isOnboarded === null}
      Loading...
    {:else if !isOnboarded}
      <Onboarding />
    {:else if $authStore.isLoggedIn}
      <Route path="addMoneyToAccount"><AddMoneyPage /></Route>
      <Route path="sendMoney"><SendPage /></Route>

      <Route path="transactions">
        <TransactionsPage />
      </Route>
      <Route path="settings"><Settings /></Route>
      <Route path="contacts/:address"><Contact /></Route>
      <Route primary={false}>
        <div class="header-and-features">
          <div class="features">
            {#if currentFeature === 0}
              <HomeScreen {user} />
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
      <Route>
        <Lock />
      </Route>
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
