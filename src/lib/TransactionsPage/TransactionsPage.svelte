<script lang="ts">
  import Transactions from "../HomePage/Transactions.svelte";
  import Heading from "../Shared/Heading.svelte";
  import BackButton from "../Shared/BackButton.svelte";
  import Input from "../Shared/Input.svelte";
  import { log, stringify } from "../../backend/functions";

  let filterValue = "";

  const filterEvents = (event) => {
    log(`Searching for`, event.target.value);
  };
</script>

<div class="transactions-page">
  <BackButton />
  <div class="header">
    <Heading>Transactions</Heading>
    <Input
      value={filterValue}
      isAmount={false}
      isFocused={false}
      label="Search people and purchases."
      onTypingPause={filterEvents}
    />
  </div>
  <div class="x">
    <Transactions />
  </div>
</div>

<style>
  .transactions-page {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    align-items: center;
    grid-template-rows: 128px 1fr;
    grid-template-columns: 100%;

    overflow: hidden;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #efddff 0, #fff 80%, #fff 100%);
  }

  .header {
    padding: 12px 24px;
  }
</style>
