<script lang="ts">
  import { debounce } from "lodash";
  import { SECOND } from "../../../../src/constants";
  export let value: string | number;
  export let isAmount: boolean;
  export let label: string;
  export let onTypingPause: svelte.JSX.KeyboardEventHandler<HTMLInputElement>;
</script>

<div class="input-and-label">
  <!-- pattern={SOLANA_WALLET_REGEX}  -->
  <input
    bind:value
    type="text"
    class={isAmount ? "usdc-amount" : ""}
    required
    on:keyup|preventDefault={debounce(onTypingPause, 1 * SECOND)}
  />
  <span class="floating-label">{label}</span>

  {#if isAmount}
    <span class="gasfee"> fee: 0.00025</span>
  {/if}
</div>

<style>
  input {
    border-radius: 9px;
    padding: 10px 0px 0px 10px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
    font-size: 14px;
    width: 200px;
    height: 35px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  .usdc-amount {
    background: url("../../assets/usdc.svg") no-repeat scroll 175px 10px;
    background-size: 26px;
    background-color: rgba(217, 217, 217, 0.3);
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  input:focus ~ .floating-label,
  input:not(:focus):valid ~ .floating-label {
    top: -1px;
    font-size: 0.7rem;
    opacity: 1;
  }

  .floating-label {
    position: absolute;
    pointer-events: none;
    color: #9d9d9d;
    left: 15px;
    top: 10px;
    transition: 0.2s ease all;
    font-size: 0.9rem;
  }

  .input-and-label {
    position: relative;
  }
  .input-and-label {
    position: relative;
    display: grid;
  }
  .gasfee {
    font-size: 0.65rem;
    color: #4d4d4d;
    justify-self: end;
    font-weight: 600;
    padding: 3px 4px 0px 0px;
  }
</style>
