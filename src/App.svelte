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
  import type { Contact as ContactType } from "./lib/types";
  import Lock from "./lib/Lock/Lock.svelte";
  import Contact from "./lib/Contacts/Contact/ContactAndTransactions.svelte";
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "./lib/stores";
  import { checkIfOnboarded } from "./lib/settings";
  import WalletAddress from "./lib/MyWalletAddress/MyWalletAddress.svelte";

  $authStore;

  let user: ContactType | null;

  let isOnboarded: null | Boolean = null;

  let currentFeature: number = 0;

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  authStore.subscribe(async (newValue) => {
    if (newValue.keyPair) {
      log(`🔑Got keyPair.`);
      // Connect to Solana
      const newConnection = await connect("quickNodeMainNetBeta");
      connectionStore.set(newConnection);

      const keypair = newValue.keyPair;

      // Get identity from the portal Identity Token
      const verifiedClaims = await verifyWallet(
        newConnection,
        keypair,
        identityTokenIssuerPublicKey,
        keypair.publicKey
      );

      user = {
        walletAddress: keypair.publicKey.toBase58(),
        isNew: false,
        isPending: false,
        verifiedClaims,
      };
    }
  });

  (async () => {
    isOnboarded = await checkIfOnboarded();
    log(`isOnboarded is`, isOnboarded);

    log(`Not contacting background page as not loaded as an extension`);
    if ("serviceWorker" in navigator) {
      // Register a service worker hosted at the root of the
      // site using the default scope.
      log(`Registering service worker...`);
      let registration: ServiceWorkerRegistration | null = null;
      try {
        registration = await navigator.serviceWorker.register(
          "./service-worker.js"
        );
        log("Service worker registration succeeded:", registration);
        navigator.serviceWorker.controller.postMessage({
          greeting: "hello from App.svelte",
        });

        // messages from service worker.

        navigator.serviceWorker.onmessage = function (event) {
          log("🟦 Got a message from the service worker", event.data);
        };

        return;
      } catch (error) {
        throw new Error(`Service worker registration failed`, error.message);
      }
    } else {
      throw new Error("Service workers are not supported.");
    }
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
      <Route path="myWalletAddress/:walletaddress"><WalletAddress /></Route>
      <Route path="transactions">
        <TransactionsPage />
      </Route>
      <Route path="settings"><Settings /></Route>
      <Route path="contacts/:address"><Contact /></Route>
      <Route primary={false}>
        <div class="header-and-features">
          {#if currentFeature === 0}
            <HomeScreen {user} />
          {:else if currentFeature === 1}
            <ContactsPage />
          {:else if currentFeature === 2}
            <Collectables />
          {/if}
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
