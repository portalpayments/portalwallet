<script lang="ts">
  import debounce from "lodash.debounce";
  import { log } from "../../backend/functions";

  export let placeholder: string;
  // https://stackoverflow.com/questions/74069649/how-do-i-set-the-correct-type-for-a-click-handler-when-using-svelte-with-typescr/74070095#74070095
  export let onInputDelay: svelte.JSX.FormEventHandler<HTMLTextAreaElement> | null = null;
  export let onKeyUpDelay: svelte.JSX.KeyboardEventHandler<HTMLTextAreaElement> | null = null;

  const runInputDelayIfExists = (event) => {
    // log(`Running input delay event`);
    if (onInputDelay) {
      onInputDelay(event);
    }
  };

  const runKeyUpDelayIfExists = (event) => {
    // log(`Running key up delay event`);
    if (onKeyUpDelay) {
      onKeyUpDelay(event);
    }
  };
</script>

<textarea
  {placeholder}
  on:input|preventDefault={debounce(runInputDelayIfExists)}
  on:keyup|preventDefault={debounce(runKeyUpDelayIfExists)}
  spellcheck="false"
/>

<style lang="scss">
  @import "../../mixins.scss";

  textarea {
    border-radius: 22px;
    border: none;
    width: 100%;
    background-color: white;
    padding: 12px 6px;
    height: 160px;
    resize: none;
    color: var(--dark-grey);
    @include gradient-border(2px);
  }

  textarea::placeholder {
    color: var(--grey-background);
  }
</style>
