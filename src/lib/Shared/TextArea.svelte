<script lang="ts">
  import { debounce } from "lodash";

  export let placeholder: string;
  // https://stackoverflow.com/questions/74069649/how-do-i-set-the-correct-type-for-a-click-handler-when-using-svelte-with-typescr/74070095#74070095
  export let onInputDelay: svelte.JSX.FormEventHandler<HTMLTextAreaElement>;
</script>

<textarea {placeholder} on:input|preventDefault={debounce(onInputDelay)} />

<style>
  textarea {
    border-radius: 7px;
    width: 100%;
    background-color: white;
    padding: 6px;
    height: 150px;
    color: var(--black);
  }
</style>
