<script lang="ts">
  import Transactions from "../HomePage/Transactions.svelte";
  import Heading from "../Shared/Heading.svelte";
  import BackButton from "../Shared/BackButton.svelte";
</script>

<div class="transactions-page">
  <BackButton />
  <div class="feature">
    <div class="header">
      <Heading>Transactions</Heading>
    </div>
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
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 100%;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #efddff 0, #fff 80%, #fff 100%);
  }

  .header {
    padding: 0 12px;
  }
</style>
