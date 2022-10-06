<script lang="ts">
  import Show from "../../assets/visible.svg";
  import Blur from "../../assets/blurred.svg";
  import CopyToClipboard from "../../assets/copy-to-clipboard.svg";

  export let privateKey = "";
  export let privateKeyBlurred = true;
  export let isModalOpen = false;
  export let enteredPassword = "";
  export let showPrivateKey = false;

  const showKey = () => {
    enteredPassword = "";
    isModalOpen = true;
    showPrivateKey = true;
  };
  const hideKey = () => {
    privateKeyBlurred = true;
    privateKey = "";
    enteredPassword = "";
    showPrivateKey = false;
  };

  const copyPhrase = () => {
    //src https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
    navigator.clipboard.writeText(privateKey).then(() => {
      // Alert the user that the action took place.
      // Nobody likes hidden stuff being done under the hood!
      alert("Copied to clipboard");
    });
  };
</script>

<h1>Private key</h1>

<div class="privateKey">
  {#if privateKeyBlurred}
    <button on:click={showKey}>
      <img src={Show} alt="Show private key" />
    </button>
  {:else}
    <button on:click={hideKey}>
      <img src={Blur} alt="hide private key" />
    </button>
    <button on:click={copyPhrase} style="bottom: -65px">
      <img
        src={CopyToClipboard}
        style="width: 15px"
        alt="copy phrase to clipboard"
      />
    </button>
  {/if}
  <div class={privateKeyBlurred ? "blurred" : ""}>{privateKey}</div>
</div>

<style>
  .privateKey {
    position: relative;
    width: 95%;
    align-self: center;
    justify-self: center;
    text-align: justify;
    border: 1px solid #9d9d9d;
    min-height: 75px;
    border-radius: 8px;
    padding: 20px 20px;
    font-weight: 600;
    color: var(--mid-blue);
    display: inline-block;
    word-break: break-word;
  }
  .blurred {
    /* Add the blur effect */
    filter: blur(8px);
    -webkit-filter: blur(8px);
    position: absolute;
    z-index: 49;
    background-color: #fff;
    width: 90%;
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
