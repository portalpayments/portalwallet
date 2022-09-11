<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import TopToolbar from "./lib/TopToolbar/TopToolbar.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectables from "./lib/Collectables/Collectables.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import TransferPage from "./lib/Transfer/TransferPage.svelte";
  import AddMoneyPage from "./lib/AddMoney/AddMoneyPage.svelte";
  import { Router, Route } from "svelte-navigator";
  import { getPrivateKey } from "./lib/utils";
  import {
    getKeypairFromString,
    connect,
    verifyWallet,
  } from "./backend/vmwallet";
  import { log } from "./backend/functions";
  import Lock from "./lib/Lock/Lock.svelte";
  import Contact from "./lib/Contacts/Contact/Contact.svelte";
  import {
    connectionStore,
    keyPairStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "./lib/stores";

  $authStore;

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  keyPairStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔑Got keys.`);
    }
  });

  let currentFeature: number = 0;

  interface User {
    name: string;
    isVerified: boolean;
  }

  let testUser: null | User = null;
  (async () => {
    // Connect to Solana
    const newConnection = await connect("mainNetBeta");
    connectionStore.set(newConnection);

    // Get our Private Key from LocalStorage
    const privateKey = getPrivateKey();
    const newKeyPair = await getKeypairFromString(privateKey);
    keyPairStore.set(newKeyPair);

    // Get identity from the portal Identity Token
    const verifiedClaims = await verifyWallet(
      newConnection,
      newKeyPair,
      identityTokenIssuerPublicKey,
      newKeyPair.publicKey
    );

    if (verifiedClaims) {
      testUser = {
        name: `${verifiedClaims.givenName} ${verifiedClaims.familyName}`,
        isVerified: true,
      };
      return;
    }
    testUser = { name: "Anonymous", isVerified: false };
  })();
</script>

<Router>
  <main>
    {#if $authStore.isLoggedIn}
      <Route path="addMoneyToAccount"><AddMoneyPage /></Route>
      <Route path="transferMoney"><TransferPage /></Route>

      <Route path="transactions"
        ><div class="header-and-features">
          Here go transactions
          <Lock />
        </div>
      </Route>
      <Route path="logout"><Lock /></Route>
      <Route path="contacts/:address"><Contact /></Route>
      <Route primary={false}>
        <div class="header-and-features">
          <TopToolbar {...testUser} />
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
        </div></Route
      >
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
