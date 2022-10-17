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

<textarea
  {placeholder}
  on:input|preventDefault={debounce(runInputDelayIfExists)}
  on:keyup|preventDefault={debounce(runKeyUpDelayIfExists)}
/>

<style>
  textarea {
    border-radius: 7px;
    width: 100%;
    background-color: white;
    padding: 6px;
    height: 150px;
    resize: none;
    color: var(--black);
  }

  textarea:focus {
    outline: none;
    border: 2px solid var(--mid-blue);
    box-shadow: 0 0 2px rgb(65 156 253 / 30%);
  }

  textarea::placeholder {
    color: var(--grey-background);
  }
</style>
