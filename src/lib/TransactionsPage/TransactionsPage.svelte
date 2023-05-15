<script lang="ts">
  import Transactions from "../HomePage/Transactions.svelte";
  import Heading from "../Shared/Heading.svelte";
  import BackButton from "../Shared/BackButton.svelte";
  import Input from "../Shared/Input.svelte";
  import { log, stringify } from "../../backend/functions";

  const EMPTY = "";

  let filterValue: string;
  $: filterValue = EMPTY;

  const filterTransactions = (event) => {
    log(`Searching for ...`, event.target.value);
    filterValue = event.target.value;
  };

  const clearTransactionFilter = () => {
    log(`Clearing filterValue...`);
    filterValue = EMPTY;
  };
</script>

<div class="transactions-screen">
  <BackButton />
  <div class="header">
    <Heading>Transactions</Heading>
  </div>
  <Input
    value={filterValue}
    isFocused={false}
    label="Search people, days and purchases."
    onTypingPause={filterTransactions}
    onClear={clearTransactionFilter}
    shape="square"
    showClearButton={true}
  />

  <div class="x">
    <Transactions {filterValue} />
  </div>
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .transactions-screen {
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    justify-content: center;
    align-items: center;
    grid-template-rows: 64px 48px calc(var(--wallet-height) - 96px - 48px);
    grid-template-columns: 100%;

    overflow: hidden;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #efddff 0, #fff 80%, #fff 100%);
  }

  .header {
    padding: 12px 24px;
  }

  .x {
    height: 100%;
  }
</style>
