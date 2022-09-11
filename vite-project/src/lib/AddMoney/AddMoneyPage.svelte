<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Heading from "../Shared/Heading.svelte";
</script>

<div class="add-money-page">
  <BackButton />
  <Heading>Transfer</Heading>
  <div class="coming-soon">Adding money to your account is coming soon.</div>
</div>

<style>
  .add-money-page {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    align-items: center;
    grid-template-rows: 150px 1fr 1fr;
    grid-template-columns: 100%;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #ddffef 0, #fff 80%, #fff 100%);
  }

  .coming-soon {
    justify-content: center;
    align-items: center;
  }
</style>
