<script lang="ts">
  import { debounce } from "lodash";
  import { SECOND } from "../../../../src/constants";
  import { log } from "../../../../src/functions";
  import USDClogo from "../../../src/assets/usdc.svg";

  export let value: string | number;
  export let isAmount: boolean;
  export let showGasFee: boolean = false;
  export let label: string;
  export let filterField: "numbers" | "walletAddress" | null = null;
  export let onTypingPause: svelte.JSX.KeyboardEventHandler<HTMLInputElement> | null;

  const badValuesByFilters = {
    numbers: /[^\d\.]/gi,
    walletAddress: /[^1-9A-HJ-NP-Za-km-z]/gi,
  };

  const removeFromString = (string: String, regex: RegExp) => {
    if (string.match(regex)) {
      log(`Removing regex '${regex}' from string '${string}'`);
    } else {
      log(`No bad characters`);
    }
    return string.replace(regex, "");
  };

  const filterInput = (event) => {
    let target = event.target;
    let badValues = badValuesByFilters[filterField];
    log(`Removing values for filter ${filterField}`);
    target.value = removeFromString(target.value, badValues);

    const ALREADY_HAS_DECIMAL_PLACE =
      filterField === "numbers" &&
      String(value).includes(".") &&
      event.data === ".";
    if (ALREADY_HAS_DECIMAL_PLACE) {
      log(`Removing second decimal place`);
      target.value = target.value.replace(/.$/gi, "");
    }
  };
</script>

<div class="input-and-label">
  <input
    bind:value
    type="text"
    class={isAmount ? "usdc-amount" : ""}
    required
    on:keyup|preventDefault={debounce((event) => {
      if (isAmount) {
        if (value > 0) {
          showGasFee = true;
        } else {
          showGasFee = false;
        }
      }
      if (onTypingPause) {
        onTypingPause(event);
      }
    }, 1 * SECOND)}
    on:input|capture={filterInput}
  />
  <span class="floating-label"
    >{label}
    {#if isAmount}<img
        class="inline-usdc"
        src={USDClogo}
        alt="usdc logo"
      />{/if}</span
  >

  {#if isAmount}
    <span class="gas-fee"> fee: 0.00025</span>
  {/if}
</div>

<style>
  input {
    border-radius: 9px;
    padding: 10px 10px 0px 10px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
    font-size: 14px;
    width: 200px;
    height: 35px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }

  .inline-usdc {
    display: inline-block;
  }
  .usdc-amount {
    text-align: right;
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

  input:focus ~ .floating-label .inline-usdc,
  input:not(:focus):valid ~ .floating-label .inline-usdc {
    height: 10px;
    transform: translateY(1px);
  }

  .floating-label {
    position: absolute;
    pointer-events: none;
    color: #9d9d9d;
    left: 12px;
    top: 12px;
    transition: 0.2s ease all;
    font-size: 0.9rem;
  }

  .floating-label .inline-usdc {
    height: 12px;
    transform: translateY(2px);
  }

  .input-and-label {
    position: relative;
  }
  .input-and-label {
    position: relative;
    display: grid;
  }
  .gas-fee {
    font-size: 0.65rem;
    color: #4d4d4d;
    justify-self: end;
    font-weight: 600;
    padding: 3px 4px 0px 0px;
  }
</style>
