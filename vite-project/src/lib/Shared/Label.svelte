<script lang="ts">
  import type { LabelColor } from "../constants";
  export let color: LabelColor;
</script>

<!-- See https://svelte.dev/tutorial/slots -->
<div class="badge {color}"><slot /></div>

<style>
  :root {
    --green: hsl(98, 39%, 56%);
    --green-background: hsl(97, 78%, 95%);
    --grey: hsl(0, 0%, 30%);
    --grey-background: hsl(0, 0%, 69%);
    --yellow: hsl(59, 45%, 28%);
    --yellow-background: hsl(58, 43%, 68%);
    --red: hsl(346, 100%, 69%);
    --red-background: #b4969d;
  }
  .badge {
    display: inline-grid;
    align-items: center;
    width: fit-content;
    padding: 2px 12px;
    text-transform: uppercase;

    height: min-content;
    border-radius: 8px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 600;
  }

  .grey {
    color: var(--grey);
    background-color: var(--grey-background);
  }

  .green {
    color: var(--green);
    background-color: var(--green-background);
  }

  .yellow {
    color: var(--yellow);
    background-color: var(--yellow-background);
  }

  .red {
    color: var(--red);
    background-color: var(--red-background);
  }
</style>
