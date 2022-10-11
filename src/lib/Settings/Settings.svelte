<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Verified from "../Shared/Verified.svelte";
  import Unverified from "../Shared/Unverified.svelte";
  import { identityTokenIssuerPublicKeyString } from "../constants";
  import type { Contact as ContactType } from "../types";
  import { get as getFromStore, writable, type Writable } from "svelte/store";
  import { Keypair, PublicKey } from "@solana/web3.js";
  import { log, isEmpty } from "../../backend/functions";
  import { authStore, connectionStore } from "../../lib/stores";
  import Modal from "../Shared/Modal.svelte";
  import BlurredText from "./BlurredText.svelte";
  import Contact from "../Shared/Contact.svelte";
  import { connect, verifyWallet } from "../../backend/vmwallet";

  const MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING =
    "I am a mocked phrase to show as blurred text before the real personal recovery phrase has been decrypted";

  let enteredPassword = "";
  let isRecoveryPhraseBlurred = true;
  let isPrivateKeyBlurred = true;
  let isModalOpen = false;
  let showRecoveryPhrase = false;
  let showPrivateKey = false;

  const checkPassword = (
    password,
    showRecoveryPhrase: boolean = false,
    showPrivateKey: boolean = false
  ) => {
    //  TODO make this secure. Get the private key and personal recovery phrase on demand
    if (password === "password" && showRecoveryPhrase) {
      isModalOpen = false;
      isRecoveryPhraseBlurred = false;
    }
    if (password === "password" && showPrivateKey) {
      isModalOpen = false;
      isPrivateKeyBlurred = false;
    }
    if (password !== "password") {
      alert("Entered password is wrong");
    }
  };

  const initiateVerificationProcess = () => {
    console.log("initiating verification process");
  };

  let user: ContactType | null = null;

  let secretKeyText: string | null = null;

  (async () => {
    authStore.subscribe(async (newValue) => {
      if (newValue.secretKey) {
        log(`🔑Got secret key.`);

        // Connect to Solana
        const connection = getFromStore(connectionStore);

        if (!newValue.secretKey) {
          throw new Error(`Couldn't get the secret key from the auth store!`);
        }
        const keypair = Keypair.fromSecretKey(newValue.secretKey);

        secretKeyText = keypair.secretKey.toString();

        const claims = await verifyWallet(
          connection,
          keypair,
          new PublicKey(identityTokenIssuerPublicKeyString),
          keypair.publicKey
        );

        user = {
          walletAddress: keypair.publicKey.toBase58(),
          isNew: false,
          isPending: false,
          verifiedClaims: claims,
        };
      }
    });
  })();
</script>

<div class="settings">
  {#if isModalOpen}
    <Modal buttonType="transfer">
      <div>enter your password</div>
      <input
        type="password"
        style="margin-top: 15px;"
        bind:value={enteredPassword}
        required
      />
      <button
        class="enter-password-button"
        on:click={() =>
          checkPassword(enteredPassword, showRecoveryPhrase, showPrivateKey)}
        >submit</button
      >
    </Modal>
  {/if}

  <div>
    <BackButton>Home</BackButton>
  </div>

  <Contact contact={user} />

  <BlurredText
    text={MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING}
    heading="Personal recovery phrase"
    description="recovery phrase"
  />

  <BlurredText
    text={secretKeyText}
    heading="Secret Key"
    description="secret key"
  />

  {#if user}
    {#if isEmpty(user.verifiedClaims)}
      <div>
        <button
          on:click={initiateVerificationProcess}
          class="get-verified-button">get verified</button
        >
      </div>
    {/if}
  {/if}
</div>

<style>
  .settings {
    display: grid;
    padding: 0 6px;
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    grid-template-rows: 64px 80px 1fr 1fr;
    gap: 20px;
    justify-content: center;
    align-items: start;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
  }

  .enter-password-button {
    width: 70%;
    position: relative;
    top: 15px;
    left: 0;
    padding: 10px 0px;
    margin: auto;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
  .get-verified-button {
    width: auto;
    margin-top: 5px;
    padding: 8px 25px;
    color: #fff;
    font-weight: 600;
    margin: auto;
    font-size: 1.3rem;
    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
</style>
