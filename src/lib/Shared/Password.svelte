<script lang="ts">
  import { debounce } from "lodash";
  import { onMount as svelteOnMount } from "svelte";

  export let placeHolder: string | null = null;
  export let value: string;
  export let onEnter: Function | null = null;
  export let isBadPassword = false;
  export let onInputDelay: Function | null = null;
  export let onMount: Function | null = null;
  export let isNewPassword: boolean = false;

  let element;

  svelteOnMount(() => {
    if (onMount) {
      onMount(element);
    }
  });

  const runInputDelayIfExists = (event) => {
    if (onInputDelay) {
      onInputDelay(event);
    }
  };
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
  type="password"
  placeholder={placeHolder}
  bind:value
  bind:this={element}
  required
  autocomplete={isNewPassword ? "new-password" : "current-password"}
  class="password {isBadPassword ? 'bad-password' : ''}"
  on:keydown={(event) => {
    if (onEnter) {
      if (event.key === "Enter") {
        onEnter();
      }
    }
  }}
  on:input|preventDefault={debounce(runInputDelayIfExists)}
/>

<style type="text/scss">
  .password {
    width: 100%;
    transition: all 200ms ease-out;
    height: 100%;
    border-radius: 22px;
    background-color: white;
    border: none;
    padding: 0 12px;
  }

  .bad-password {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    background-color: var(--error-pink);
  }

  input {
    color: var(--dark-grey);
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
