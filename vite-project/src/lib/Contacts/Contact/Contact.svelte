<script lang="ts">
  import ContactHeading from "./ContactHeading.svelte";
  import Transactions from "./Transactions.svelte";
  import {
    connection,
    keyPair,
    identityTokenIssuerPublicKey,
  } from "../../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import { verifyWallet } from "../../../../../src/vmwallet";
  import { log, stringify } from "../../../../../src/functions";
  import type { TokenMetaDataClaims } from "../../../../../src/types";

  import SendMoney from "./SendMoney.svelte";

  import type { Contact, Transaction } from "../../../lib/types";

  export let contact: Contact;

  export let transactions: Array<Transaction> = [
    { date: 1662051517814, amount: 4700, isReceived: false },
    { date: 1662051517814, amount: 2300, isReceived: false },
    { date: 1662051517814, amount: 40000, isReceived: true },
  ];
  export let isPending: boolean | null = null;
  let requestingVerification = false;
  let sendAmount: number | null = null;

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

  const requestVerificationModal = () => {
    requestingVerification = true;
  };

  (async () => {
    // Get identity from the portal Identity Token
    verifiedClaims = await verifyWallet(
      connectionValue,
      keyPairValue,
      identityTokenIssuerPublicKey,
      new PublicKey(contactWalletAddress)
    );

    contact = {
      walletAddress: contactWalletAddress,
      isAnonymous: !connectionValue,
      isNew: false,
      isPending: false,
    };
  })();
</script>

<div class="contactPage">
  {#if contact}
    <ContactHeading {contact} {verifiedClaims} />
    <Transactions {transactions} />
    <SendMoney {contact} />
    <!-- {warningUnverifiedAccount} -->
    <!-- <button on:click={requestVerificationModal} class="request-verification"
        >Request verification</button
      > -->

    <!-- <Modal buttonType="requestVerification">
      <div class="request-container">
         TODO emailAddress is missing 
        <RequestVerification
          destinationWalletAddress={contact.walletAddress}
          transferAmount={sendAmount}
          bind:isPending
        />
      </div>
    </Modal>
    {#if requestingVerification}{/if} -->
  {:else}
    Loading...
  {/if}
</div>

<style>
  .contactPage {
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr;
  }

  /* button {
    width: 45%;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: #419cfd;
  }
  .warning {
    font-size: 1rem;
    margin: auto;
    margin-top: 50%;
    width: 95%;
    height: 40%;
    color: #4d4d4d;
  }

  .request-verification {
    background-color: #2775c9;
    width: 93%;
    height: 40px;
    margin-bottom: 5px;
  }

  .warning {
    font-size: 1rem;
    margin: auto;
    margin-top: 50%;
    width: 95%;
    height: 40%;
    color: #4d4d4d;
  }
  .send-anyway {
    background-color: #9d9d9d;
  } */
</style>
