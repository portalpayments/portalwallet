<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import MockProfilePhoto from "../../assets/Collectables/baycMockNFT.jpg";
  import AnonymousPhoto from "../../assets/anonymous.svg";
  import Checkmark from "../../assets/Checkmark.svg";
  import { truncateWallet } from "../utils";
  import PersonalRecoveryPhrase from "./personalRecoveryPhrase.svelte";
  import Modal from "../Shared/Modal.svelte";
  import PrivateKey from "./privateKey.svelte";

  // TODO - Mike modify dependending on whether we have a token
  //   Toggle isVerified to view different scenarios
  export let isVerified = false;
  export let name: string | null = "Don Juan";
  export let walletAddress = "6yzxysyashdhsanenr78jen9sanenr78jen9";

  let personalRecoveryPhrase = "";
  let privateKey = "";
  let enteredPassword = "";
  let recoveryPhraseblurred = true;
  let privateKeyBlurred = true;
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
      personalRecoveryPhrase =
        "When I was 6 my parents got my brother Finian a train for Christmas";
      isModalOpen = false;
      recoveryPhraseblurred = false;
    }
    if (password === "password" && showPrivateKey) {
      privateKey = "KQ3cGFBdjJuRsB7U1K4to6cTGBPhgukqPgsi5pryr8v";
      isModalOpen = false;
      privateKeyBlurred = false;
    }
    if (password !== "password") {
      console.log("Im in else");
      personalRecoveryPhrase = "null";
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
    />
    <div class="name-address-verification-status">
      <div class="name">
        {#if isVerified}
          {name}<img src={Checkmark} class="checkmark" />
        {:else}
          anonymous
        {/if}
      </div>
      <div class={isVerified ? "address small-font" : "address"}>
        {truncateWallet(walletAddress)}
      </div>
    </div>
  </div>
  <div>
    <PersonalRecoveryPhrase
      bind:showRecoveryPhrase
      bind:recoveryPhraseblurred
      bind:enteredPassword
      bind:personalRecoveryPhrase
      bind:isModalOpen
    />
  </div>
  <div>
    <PrivateKey
      bind:showPrivateKey
      bind:privateKeyBlurred
      bind:enteredPassword
      bind:privateKey
      bind:isModalOpen
    />
  </div>
  {#if !isVerified}
    <div>
      <button on:click={initiateVerificationProcess} class="getVerified-button"
        >get verified</button
      >
    </div>
  {/if}
</div>

<style>
  .settings {
    display: grid;
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    grid-template-rows: 64px 80px 170px 1fr 1fr;
    grid-template-columns: var(--wallet-width);
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
  .getVerified-button {
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
