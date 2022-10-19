<script lang="ts">
  import { debounce } from "lodash";
  import { SECOND } from "../../backend/constants";
  import { log } from "../../backend/functions";
  import USDClogo from "../../../src/assets/Icons/usdc.svg";
  import { useFocus } from "svelte-navigator";
  import { getFocusContext } from "./FocusContext.svelte";

  export let value: string | number;
  export let isAmount: boolean;
  export let isFocused: boolean;
  export let showGasFee: boolean = false;
  export let label: string;
  export let filterField: "numbers" | "walletAddress" | null = null;

  export let onTypingPause: svelte.JSX.KeyboardEventHandler<HTMLInputElement> | null;

  const focus = getFocusContext();

  const maybeFocus = (node) => {
    if (isFocused) {
      focus(node);
    }
  };

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
    if (badValues) {
      target.value = removeFromString(target.value, badValues);
    }

    // 'value' is existing value
    // 'event.data' is what the user just typed

    // Stop a user from doing 123.45.67
    const ALREADY_HAS_DECIMAL_PLACE =
      filterField === "numbers" &&
      String(value).includes(".") &&
      event?.data === ".";
    if (ALREADY_HAS_DECIMAL_PLACE) {
      log(`Already has an existing decimal place`);
      target.value = target.value.replace(/.$/gi, "");
    }

    // Make typing '.69' look like '0.69'
    const SENDING_MINOR_CURRENCY =
      filterField === "numbers" &&
      value === null &&
      event.data &&
      event.data.startsWith(".");

    if (SENDING_MINOR_CURRENCY) {
      log(`Typed a dot without any characters before it, adding leading zero`);
      target.value = `0.`;
    }
  };
</script>

<div class="input-and-label">
  <input
    bind:value
    type="text"
    class={isAmount ? "usdc-amount" : ""}
    use:maybeFocus
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
    {#if isAmount}
      <img class="inline-usdc" src={USDClogo} alt="usdc logo" />
    {/if}
  </span>

  {#if isAmount}
    {#if Number(value) !== 0 && value !== null}
      <span class="gas-fee">Fee: 0.00025</span>
    {/if}
  {/if}
</div>

<style>
  input {
    border-radius: 0;
    padding: 12px 12px 0px 12px;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid var(--mid-grey);
    font-size: 14px;
    width: 100%;
    height: 56px;
    font-size: 18px;
    color: var(--actually-dark-grey);
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
    top: 6px;
    font-size: 12px;
    line-height: 12px;
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
    top: 16px;
    transition: 0.2s ease all;
    font-size: 16px;
  }

  .floating-label .inline-usdc {
    height: 12px;
    transform: translateY(2px);
  }

  .input-and-label {
    position: relative;
    display: grid;
  }
  .gas-fee {
    font-size: 0.65rem;
    color: var(--black);
    justify-self: end;
    font-weight: 600;
    padding: 3px 4px 0px 0px;
  }
</style>
