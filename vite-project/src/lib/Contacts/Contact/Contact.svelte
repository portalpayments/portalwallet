<script lang="ts">
  import ContactHeading from "./ContactHeading.svelte";
  import john from "../../../assets/ProfilePics/john.png";
  import anonymous from "../../../assets/ProfilePics/anonymous.svg";
  import TransactionHistory from "./TransactionHistory.svelte";
  import {
    connection,
    keyPair,
    identityTokenIssuerPublicKey,
  } from "../../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import { verifyWallet } from "../../../../../src/vmwallet";
  import { log } from "../../../../../src/functions";
  import type { Contact } from "../../types";
  import type { TokenMetaDataClaims } from "../../../../../src/types";

  // TODO We can use the wallet address to fetch data from localstorage
  let contactWalletAddress: string = window.location.href.split("/").pop();

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  let connectionValue: Connection | null = null;
  let verifiedClaims: TokenMetaDataClaims | null = null;

  connection.subscribe((value) => {
    connectionValue = value;
  });

  let keyPairValue: Keypair | null = null;

  keyPair.subscribe((value) => {
    keyPairValue = value;
  });

  let contact: Contact | null = null;

  (async () => {
    // Get identity from the portal Identity Token
    verifiedClaims = await verifyWallet(
      connectionValue,
      keyPairValue,
      identityTokenIssuerPublicKey,
      new PublicKey(contactWalletAddress)
    );

    if (verifiedClaims) {
      contact = {
        walletAddress: contactWalletAddress,
        image: john,
        name: `${verifiedClaims.givenName} ${verifiedClaims.familyName}`,
        isAnonymous: false,
        isNew: false,
        isPending: false,
      };
    }
    contact = {
      walletAddress: contactWalletAddress,
      image: anonymous,
      name: "Anonymous",
      isAnonymous: true,
      isNew: false,
      isPending: false,
    };
  })();
</script>

<div class="contactPage">
  {#if contact}
    <ContactHeading {contact} {verifiedClaims} />
    <TransactionHistory {contact} />
  {:else}
    Loading
  {/if}
</div>

<style>
  .contactPage {
    overflow-x: hidden;
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr;
  }
</style>
