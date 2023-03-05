<script lang="ts">
  import HomeScreen from "./lib/HomePage/HomePage.svelte";
  import Navbar from "./lib/Navbar/Navbar.svelte";
  import Collectables from "./lib/Collectables/Collectables.svelte";
  import Collectable from "./lib/Collectables/Collectable.svelte";
  import ContactsPage from "./lib/Contacts/ContactsPage.svelte";
  import Onboarding from "./lib/Onboarding/Onboarding.svelte";
  import SendPage from "./lib/Send/SendPage.svelte";
  import AddMoneyPage from "./lib/AddMoney/AddMoneyPage.svelte";
  import TransactionsPage from "./lib/TransactionsPage/TransactionsPage.svelte";
  import Settings from "./lib/Settings/Settings.svelte";
  import { Router, Route } from "svelte-navigator";
  import { connect, verifyWallet } from "./backend/wallet";
  import { log } from "./backend/functions";
  import type { Contact as ContactType } from "./backend/types";
  import Lock from "./lib/Lock/Lock.svelte";
  import ContactAndMessages from "./lib/Contacts/Contact/ContactAndMessages.svelte";
  import { connectionStore, authStore } from "./lib/stores";
  import { checkIfOnboarded } from "./lib/settings";
  import { PORTAL_IDENTITY_TOKEN_ISSUER_WALLET } from "./backend/constants";
  import WalletAddress from "./lib/MyWalletAddress/MyWalletAddress.svelte";
  import { PublicKey } from "@solana/web3.js";

  $authStore;

  let user: ContactType | null;

  let isOnboarded: null | Boolean = null;

  let currentFeature: number = 0;

  const identityTokenIssuerPublicKey = new PublicKey(
    PORTAL_IDENTITY_TOKEN_ISSUER_WALLET
  );

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌Connected!`);
    }
  });

  authStore.subscribe(async (newValue) => {
    if (newValue.keyPair) {
      log(`🔑Got keyPair.`);
      // Connect to Solana
      const newConnection = await connect("quickNodeMainNetBetaBackup");
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
        profilePictureURL: null,
      };
    }
  });

  (async () => {
    isOnboarded = await checkIfOnboarded();
  })();
</script>

<Router>
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
    <Route path="contacts/:address"><ContactAndMessages /></Route>
    <Route path="collectables/:index"><Collectable /></Route>
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
</Router>

<style lang="scss">
  .header-and-features {
    width: var(--wallet-width);
    height: var(--wallet-height);
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
  }
</style>
