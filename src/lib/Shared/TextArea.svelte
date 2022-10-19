<script lang="ts">
  import { debounce } from "lodash";

  export let placeholder: string;
  // https://stackoverflow.com/questions/74069649/how-do-i-set-the-correct-type-for-a-click-handler-when-using-svelte-with-typescr/74070095#74070095
  export let onInputDelay: svelte.JSX.FormEventHandler<HTMLTextAreaElement> | null =
    null;
  export let onKeyUpDelay: svelte.JSX.KeyboardEventHandler<HTMLTextAreaElement> | null =
    null;

  const runInputDelayIfExists = (event) => {
    if (onInputDelay) {
      onInputDelay(event);
    }
  };

  const runKeyUpDelayIfExists = (event) => {
    if (onKeyUpDelay) {
      onKeyUpDelay(event);
    }
  };
</script>

<div class="gradient-box">
  <textarea
    {placeholder}
    on:input|preventDefault={debounce(runInputDelayIfExists)}
    on:keyup|preventDefault={debounce(runKeyUpDelayIfExists)}
  />
</div>

<style>
  /* Use gradients for borders */
  /* From https://css-tricks.com/gradient-borders-in-css/ */
  /* Note we cannot use a :before element on the textarea itself */
  /* See https://stackoverflow.com/questions/3286991/can-a-before-selector-be-used-with-a-textarea */

  :root {
    --thickness: 3px;
  }

  /* Box that has a transparent border */
  .gradient-box {
    position: relative;
    border: var(--thickness);
    color: white;
    background-clip: padding-box;
    border: solid var(--thickness) transparent;
    border-radius: calc(2 * var(--thickness));
  }

  /* Big outer box with a gradient, shown beneath */
  .gradient-box:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: calc(-1 * var(--thickness));
    border-radius: inherit;
    background: var(--blue-green-gradient);
  }

  textarea {
    width: 100%;
    border-radius: var(--thickness);
    padding: var(--thickness);
    height: 150px;
    resize: none;
    color: var(--actually-dark-grey);
    background-color: white;
    outline: none;
    border: solid 6px transparent;
    position: relative;
  }

  textarea:before {
    content: "SWAG";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -5px;
    border-radius: inherit;
    background: linear-gradient(to right, red, orange);
  }

  textarea::placeholder {
    color: var(--grey-background);
  }
</style>
