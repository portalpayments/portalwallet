<script lang="ts">
  export let placeHolder: string | null = null;
  export let value: string;
  export let onEnter: Function | null = null;
  export let isBadPassword = false;
</script>

<input
  type="password"
  placeholder={placeHolder}
  bind:value
  class="password {isBadPassword ? 'bad-password' : ''}"
  on:keydown={(event) => {
    if (onEnter) {
      if (event.key === "Enter") {
        onEnter();
      }
    }
  }}
/>

<style>
  .password {
    width: 100%;
    transition: all 200ms ease-out;
  }

  .bad-password {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    background-color: var(--error-pink);
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
