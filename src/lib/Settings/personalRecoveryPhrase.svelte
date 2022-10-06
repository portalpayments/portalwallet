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

  const copyPhrase = (text) => {
    var type = "text/plain";
    var blob = new Blob([text], { type });
    var data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
      function () {
        /* success */
        console.log("copied svg to clipboard");
      },
      function () {
        /* failure */
      }
    );
  };
</script>

<h1>Personal recovery phrase</h1>

<div class="personal-recovery-phrase">
  {#if recoveryPhraseblurred}
    <button on:click={showPhrase}>
      <img src={Show} alt="Show recovery Phrase" />
    </button>
  {:else}
    <button on:click={hidePhrase}>
      <img src={Blur} alt="hide recovery phrase" />
    </button>
    <div>
      <!-- TODO fix button collisiions -->
      <button
        on:click={() => copyPhrase(personalRecoveryPhrase)}
        style="bottom: -65px"
      >
        <img
          src={CopyToClipboard}
          style="width: 15px"
          alt="copy phrase to clipboard"
        />
      </button>
    </div>
  {/if}
  <div class={recoveryPhraseblurred ? "blurred" : ""}>
    {personalRecoveryPhrase}
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
  button {
    background-color: transparent;
    position: absolute;
    z-index: 55;
    /* eyeballed */
    left: 240px;
    top: 5px;
  }
</style>
