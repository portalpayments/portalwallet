<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";

  import MockProfilePhoto from "../../assets/Collectables/baycMockNFT.jpg";
  import AnonymousPhoto from "../../assets/anonymous.svg";
  import Checkmark from "../../assets/Checkmark.svg";
  import { truncateWallet } from "../utils";
  import Modal from "../Shared/Modal.svelte";
  import BlurredText from "./BlurredText.svelte";

  // TODO - Mike modify dependending on whether we have a token
  //   Toggle isVerified to view different scenarios
  export let isVerified = false;
  export let name: string | null = "Don Juan";
  export let walletAddress = "6yzxysyashdhsanenr78jen9sanenr78jen9";

  const MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING =
    "I am a mocked phrase to show as blurred text before the preal personal recovery phrase has been decrypted";

  const MOCK_PRIVATE_KEY_FOR_BLURRING =
    "1234567890123456789012345678901234567890123";

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
      ></Modal
    >
  {/if}

  <div>
    <BackButton>Home</BackButton>
  </div>
  <div class="user-details">
    <img
      src={isVerified ? MockProfilePhoto : AnonymousPhoto}
      class="profile-pic"
      alt="profile-pic"
    />
    <div class="name-address-verification-status">
      <div class="name">
        {#if isVerified}
          {name}<img src={Checkmark} class="checkmark" alt="" />
        {:else}
          anonymous
        {/if}
      </div>
      <div class={isVerified ? "address small-font" : "address"}>
        {truncateWallet(walletAddress)}
      </div>
    </div>
  </div>

  <BlurredText
    text={MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING}
    heading="Personal recovery phrase"
    description="recovery phrase"
  />

  <BlurredText
    text={MOCK_PRIVATE_KEY_FOR_BLURRING}
    heading="Private Key"
    description="private key"
  />

  {#if !isVerified}
    <div>
      <button on:click={initiateVerificationProcess} class="get-verified-button"
        >get verified</button
      >
    </div>
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
  .profile-pic {
    border-radius: 60%;
  }

  img {
    width: 80px;
    height: 80px;
  }
  .user-details {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 100px 1fr;
    padding: 0 0 0 10px;
  }
  .name-address-verification-status {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: auto 32px;
    justify-self: start;
    font-size: 1.4rem;
    align-self: center;
  }
  .name {
    display: block;
    text-align: left;
    font-weight: 600;
  }
  .checkmark {
    width: 24px;
    height: 24px;
    align-self: end;
    display: inline;
    vertical-align: bottom;
    margin-left: 5px;
  }

  .address {
    justify-self: start;
    align-self: center;
  }

  .small-font {
    font-size: 1rem;
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
