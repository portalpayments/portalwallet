<script lang="ts">
  import Show from "../../assets/visible.svg";
  import Blur from "../../assets/blurred.svg";
  import CopyToClipboard from "../../assets/copy-to-clipboard.svg";

  export let personalRecoveryPhrase = "";
  export let recoveryPhraseblurred = true;
  export let isModalOpen = false;
  export let enteredPassword = "";
  export let showRecoveryPhrase = false;

  const showPhrase = () => {
    enteredPassword = "";
    isModalOpen = true;
    showRecoveryPhrase = true;
  };
  const hidePhrase = () => {
    recoveryPhraseblurred = true;
    personalRecoveryPhrase = "";
    enteredPassword = "";
    showRecoveryPhrase = false;
  };

  const copyPhrase = () => {
    //src https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
    navigator.clipboard.writeText(personalRecoveryPhrase).then(() => {
      // Alert the user that the action took place.
      // Nobody likes hidden stuff being done under the hood!
      alert("Copied to clipboard");
    });
  };
</script>

<h1>Personal recovery phrase</h1>

<div class="personal-recovery-phrase">
  {#if recoveryPhraseblurred}
    <button on:click={showPhrase} class="showHideRecoveryPhraseButton">
      <img src={Show} alt="Show recovery Phrase" />
    </button>
  {:else}
    <button on:click={hidePhrase} class="showHideRecoveryPhraseButton">
      <img src={Blur} alt="hide recovery phrase" />
    </button>
    <div>
      <button on:click={copyPhrase} class="copyToClipboardButton">
        <img
          src={CopyToClipboard}
          style="width: 15px; vertical-align: bottom;margin-right: 5px;"
          alt="copy phrase to clipboard"
        />copy
      </button>
    </div>
  {/if}
  <div class={recoveryPhraseblurred ? "blurred" : ""}>
    {personalRecoveryPhrase}
    <!-- TODO fix button collisions -->
  </div>
</div>

<style>
  .personal-recovery-phrase {
    position: relative;
    width: 95%;
    align-self: center;
    justify-self: center;
    text-align: justify;
    border: 1px solid #9d9d9d;
    min-height: 115px;
    border-radius: 8px;
    padding: 20px 20px;
    font-weight: 600;
    color: var(--mid-blue);
  }
  .blurred {
    /* Add the blur effect */
    filter: blur(8px);
    -webkit-filter: blur(8px);
    position: absolute;
    z-index: 49;
    background-color: #fff;
    width: 95%;
    padding: 20px 20px;
    align-self: center;
    justify-self: center;
    text-align: justify;
  }
  h1 {
    align-content: left;
    text-align: left;
    justify-self: left;
    padding-left: 10px;
    font-size: 1.4rem;
  }
  img {
    background-color: transparent;
    width: 24px;
  }
  .showHideRecoveryPhraseButton {
    background-color: transparent;
    position: absolute;
    z-index: 55;
    /* eyeballed */
    left: 240px;
    top: 5px;
  }
  .copyToClipboardButton {
    display: block;
    width: 100px;
    color: #9d9d9d;
    font-size: 0.9rem;
    font-weight: 600;
    background-color: transparent;
    position: absolute;
    z-index: 55;
    /* eyeballed */
    left: 190px;
    bottom: 5px;
  }
</style>
