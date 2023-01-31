<script lang="ts">
  import debounce from "lodash.debounce";
  import { SECOND } from "../../backend/constants";
  import type { CurrencyDetails } from "../../backend/types";
  import { log } from "../../backend/functions";
  import { getFocusContext } from "./FocusContext.svelte";

  export let value: string | number;
  export let isFocused: boolean;
  export let showGasFee: boolean = false;
  export let label: string;
  export let filterField: "numbers" | "walletAddress" | null = null;
  export let isSpellChecked: boolean = false;

  export let onTypingPause: svelte.JSX.KeyboardEventHandler<HTMLInputElement> | null;
  export let onClear: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null =
    null;

  export let theme: "square" | "round" = "round";

  export let currency: CurrencyDetails | null = null;

  export let showClearButton = false;

  export let hasButton = false;

  export let onButtonSubmit: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null =
    null;

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
  <div class="border {theme === 'square' ? 'square' : ''} ">
    <div class="big-white-area {hasButton ? 'with-submit-button' : ''}">
      <input
        bind:value
        type="text"
        class={currency ? "currency" : ""}
        use:maybeFocus
        required
        spellcheck={isSpellChecked}
        on:keyup|preventDefault={debounce((event) => {
          if (currency) {
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
        {#if currency}
          <img class="inline-logo" src={currency.logo} alt={currency.symbol} />
        {/if}
      </div>
      {#if showClearButton && value !== EMPTY}
        <button class="clear" on:click={onClear}>×</button>
      {/if}

      {#if hasButton}
        <!-- TODO: handle disable -->
        <button type="button" class="submit-button" on:click={onButtonSubmit}>
          <slot />
        </button>
      {/if}
    </div>
  </div>

  {#if currency}
    {#if Number(value) !== 0 && value !== null}
      <span class="gas-fee">Fee: 0.00025</span>
    {/if}
  {/if}
</div>

<style lang="scss">
  .input-and-label {
    background-color: transparent;
  }
  .border {
    height: 46px;
    border-radius: 23px;
    background: var(--light-grey);
    padding: 1px;
  }

  .big-white-area {
    align-items: center;
    background-color: white;
    justify-items: end;
    padding: 0 2px;
  }

  .big-white-area.with-submit-button {
    grid-auto-flow: column;
    border-radius: 22px;
    grid-template-columns: 1fr 48px;
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

  input:focus {
    outline: none !important;
  }
  .border:has(input:focus) .floating-label,
  .border:has(input:valid) .floating-label {
    top: 6px;
    height: 16px;
    font-size: 12px;
    line-height: 12px;
    opacity: 1;
  }

  .border:has(input:focus) .floating-label .inline-logo,
  .border:has(input:valid) .floating-label .inline-logo {
    height: 10px;
    transform: translateY(1px);
  }

  .floating-label {
    position: absolute;
    display: grid;
    // for 'amount [currency logo]'
    grid-auto-flow: column;
    align-items: baseline;
    gap: 3px;

    left: 15px;
    padding: 0;
    top: 12px;

    align-content: center;

    text-align: left;

    pointer-events: none;
    color: #9d9d9d;
    transition: 0.2s ease all;
    font-size: 14px;
  }

  .floating-label .inline-logo {
    height: 12px;
    transform: translateY(2px);
    opacity: 0.5;
  }

  .input-and-label {
    // Explicitly positioned for use by absolutely positioned children
    position: relative;
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

  button.submit-button {
    width: 40px;
    height: 40px;
    background-color: var(--mid-blue);
    border-radius: 22px;

    display: grid;
    align-content: center;
    justify-content: center;
  }
</style>
