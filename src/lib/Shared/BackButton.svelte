<script lang="ts">
  import { Link } from "svelte-navigator";

  // https://stackoverflow.com/questions/74069649/how-do-i-set-the-correct-type-for-a-click-handler-when-using-svelte-with-typescr/74070095#74070095
  export let clickHandler: null | svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    null;
</script>

<div class="back-button">
  {#if !clickHandler}
    <Link to="/">‹<span><slot /></span></Link>
  {:else}
    <button
      on:click|preventDefault={(event) => {
        if (clickHandler) {
          clickHandler(event);
        }
      }}
      >‹<span><slot /></span>
    </button>
  {/if}
</div>

<style lang="scss">
  .back-button {
    font-size: 2rem;
    position: absolute;
    /* Just eyeballing it to fit beside the heading on the Transfers page */
    top: 20px;
    left: 6px;
    margin: 0;
    padding: 0;
  }

  /* global is needed for 'a' element under Link */
  .back-button :global(a),
  .back-button button {
    text-decoration: none;
    background-color: transparent;
    display: inline-block;
    color: #3a3a3a;
    font-size: 2rem;
    font-weight: 400;
  }

  span {
    font-size: 1.5rem;
    margin-left: 5px;
    font-weight: 600;
  }
</style>
