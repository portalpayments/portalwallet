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
  export let onClear: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null =
    null;

  export let theme: "square" | "round" = "round";

  export let showClearButton = false;

  const EMPTY = "";

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
    return string.replace(regex, EMPTY);
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
  <div class="border {theme === 'square' ? 'square' : ''}">
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
    <div class="floating-label">
      {label}
      {#if isAmount}
        <!-- TODO: set currency properly -->
        <img class="inline-usdc" src={USDClogo} alt="usdc logo" />
      {/if}
    </div>
    {#if showClearButton && value !== EMPTY}
      <button class="clear" on:click={onClear}>×</button>
    {/if}
  </div>

  {#if isAmount}
    {#if Number(value) !== 0 && value !== null}
      <span class="gas-fee">Fee: 0.00025</span>
    {/if}
  {/if}
</div>

<style type="text/scss">
  .border {
    height: 48px;
    border-radius: 24px;
    background: var(--light-grey);
    padding: 2px;
  }

  /* Enable a gradient border when the input inside is focused
  CSS doesn't currently let us use borders for gradients */
  .border:has(input:focus) {
    background: var(--blue-green-gradient);
  }

  .border.square {
    padding: 0px 0px 2px 0px;
    border-radius: 0;
  }

  .border.square input {
    border-radius: 0;
    border-width: 1px 1px 0 1px;
    border-color: var(--light-grey);
  }

  input {
    width: 100%;
    transition: all 200ms ease-out;
    height: 100%;
    border-radius: 22px;
    background-color: white;
    border-width: 0;
    padding: 12px 12px 0 12px;
  }

  .inline-usdc {
    display: inline-block;
  }
  .usdc-amount {
    text-align: right;
  }
  input:focus {
    outline: none !important;
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  .border:has(input:focus) .floating-label,
  .border:has(input:valid) .floating-label {
    top: 6px;
    height: 16px;
    font-size: 12px;
    line-height: 12px;
    opacity: 1;
  }

  .border:has(input:focus) .floating-label .inline-usdc,
  .border:has(input:valid) .floating-label .inline-usdc {
    height: 10px;
    transform: translateY(1px);
  }

  .floating-label {
    position: absolute;
    height: 100%;
    width: 100%;
    display: grid;
    padding: 0 12px;
    align-content: center;

    text-align: left;

    pointer-events: none;
    color: #9d9d9d;
    transition: 0.2s ease all;
    font-size: 14px;
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

  button.clear {
    position: absolute;
    right: 0;
    height: 100%;
    width: 23px;
    display: grid;
    background: transparent;
    align-content: center;
    color: var(--black);
  }
</style>
