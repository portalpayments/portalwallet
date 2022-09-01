<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import TopToolbar from "./lib/TopToolbar/TopToolbar.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectables from "./lib/Collectables/Collectables.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import TransferPage from "./lib/Transfer/TransferPage.svelte";
  import { Router, Route } from "svelte-navigator";
  import { getPrivateKey } from "./lib/utils";
  import {
    getKeypairFromString,
    connect,
    verifyWallet,
  } from "../../src/vmwallet";
  import { log } from "../../src/functions";
  import Auth from "./lib/Auth/Auth.svelte";
  import SendToContacts from "./lib/Contacts/SendToContacts/SendToContact.svelte";
  import {
    connection,
    keyPair,
    authStore,
    identityTokenIssuerPublicKey,
  } from "./lib/stores";

  $authStore;
  console.log($authStore.isLoggedIn);

  connection.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  keyPair.subscribe((newValue) => {
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
    connection.set(newConnection);

    // Get our Private Key from LocalStorage
    const privateKey = getPrivateKey();
    const newKeyPair = await getKeypairFromString(privateKey);
    keyPair.set(newKeyPair);

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
      <Route path="addMoneyToAccount"
        ><div class="header-and-features">
          adding money to account here
        </div></Route
      >
      <Route path="/transferMoney"><TransferPage /></Route>

      <Route path="transactions"
        ><div class="header-and-features">
          Here go transactions
          <Auth />
        </div></Route
      >
      <Route path="logout"><Auth /></Route>
      <!-- primary=false to avoid a focus warning from the Svelte router -->
      <Route path="contacts/:address" primary={false}><SendToContacts /></Route>
      <Route path="/" primary={false}>
        <div class="header-and-features">
          <TopToolbar {...testUser} />
          <div class="features">
            <div class="feature">
              {#if currentFeature === 0}
                <HomeScreen />
              {:else if currentFeature === 1}
                <ContactsPage />
              {:else if currentFeature === 2}
                <Collectables />
              {/if}
            </div>
          </div>
        </div>
        <Navbar bind:currentFeature />
      </Route>
    {:else}
      <Route path="/" primary={false}><div class="login"><Auth /></div></Route>
    {/if}
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

  /* The entire wallet, contains the header-and-features plus the nav bar */
  main {
    /* Required to absolutely position navbar at bottom 
    relative to this element */
    position: relative;
  }

  .header-and-features {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 80px 1fr;
  }
  .login {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    justify-content: center;
    align-items: center;
  }
  .feature {
    background-color: white;
  }
</style>
