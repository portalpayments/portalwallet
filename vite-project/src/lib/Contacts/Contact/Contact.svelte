<script lang="ts">
  import { contactsStore } from "../../../lib/stores.js";

  import ContactHeading from "./ContactHeading.svelte";
  import Transactions from "./Transactions.svelte";
  import {
    connectionStore,
    keyPairStore,
    transactionsStore,
    identityTokenIssuerPublicKey,
  } from "../../stores";
  import type { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import { verifyWallet } from "../../../../../src/vmwallet";
  import { log, stringify } from "../../../../../src/functions";
  import type { Contact, Transaction } from "../../../lib/types";

  let contact: Contact;

  // Use the wallet address to determine the wallet to use
  let contactWalletAddress: string = window.location.href.split("/").pop();

  contactsStore.subscribe((newValue) => {
    contact = newValue.find((contact) => {
      contact.walletAddress === contactWalletAddress;
    });
  });

  import SendMoney from "./SendMoney.svelte";

  log(`Loading send to contact screen for ${contactWalletAddress}`);

  let transactions: Array<Transaction> = [];

  transactionsStore.subscribe((newValue) => {
    transactions = newValue;
  });
</script>

<div class="contactPage">
  {#if contact}
    <ContactHeading {contact} />
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
