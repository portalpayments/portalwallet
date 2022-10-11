<script lang="ts">
  import Show from "../../assets/visible.svg";
  import Blur from "../../assets/blurred.svg";
  import Heading from "../Shared/Heading.svelte";
  import CopyToClipboard from "../../assets/copy-to-clipboard.svg";

  export let text: string;
  export let heading: string;
  export let isShown = false;
  export let description: string = "recovery phrase" || "secret key";

  const showText = () => {
    isShown = true;
  };

  const hideText = () => {
    isShown = false;
  };

  const copyPhrase = async () => {
    //src https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };
</script>

<div class="blurred-text">
  <Heading size="medium" isColorful={false}>{heading}</Heading>
  <div class="copy-paste-area">
    <div class="buttons">
      {#if isShown}
        <button on:click={copyPhrase} class="copy-to-clipboard">
          <img
            src={CopyToClipboard}
            alt="copy {description} to clipboard"
          />copy
        </button>
      {/if}
      <button on:click={isShown ? hideText : showText} class="show-hide-text">
        <img
          src={isShown ? Blur : Show}
          alt="{isShown ? 'Blur' : 'Show'} {description}"
        />
      </button>
    </div>
    <span class={isShown ? "" : "blurred"}>
      {text}
    </span>
  </div>
</div>

<style>
  .blurred-text {
    gap: 8px;
  }
  .copy-paste-area {
    position: relative;
    text-align: justify;
    border: 1px solid #9d9d9d;
    min-height: 115px;
    border-radius: 6px;
    padding: 24px 12px;
    font-weight: 600;
    color: var(--mid-blue);
  }

  .blurred {
    filter: blur(8px);
  }

  .buttons {
    position: absolute;
    z-index: 55;
    right: 6px;
    top: 6px;
    grid-auto-flow: column;
  }

  button {
    background-color: transparent;
  }

  button img {
    background-color: transparent;
    width: 24px;
  }

  .copy-to-clipboard {
    color: #9d9d9d;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .copy-to-clipboard img {
    width: 16px;
    vertical-align: bottom;
    margin-right: 5px;
  }

  span {
    line-break: anywhere;
  }
</style>
