<script type="ts">
  export let show = true;
</script>

{#if show}<div class="backdrop" />
{/if}

<style>
  .backdrop {
    width: var(--wallet-width);
    height: var(--wallet-height);
    position: fixed;
    z-index: 110;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
