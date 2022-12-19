<script lang="ts">
  import type { LabelColor } from "../constants";
  export let color: LabelColor;
  export let size: "large" | "medium" | null = null;
</script>

<!-- See https://svelte.dev/tutorial/slots -->
<div class="badge {color} {size}"><slot /></div>

<style type="text/scss">
  :root {
    --green: hsl(98, 39%, 56%);
    --green-background: hsl(97, 78%, 95%);
    --grey: hsl(0, 0%, 30%);
    --grey-background: hsl(0, 0%, 79%);
    --yellow: hsl(59deg 28% 26%);
    --yellow-background: hsl(58deg 66% 81%);
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
  .large {
    font-size: 1.2rem;
    line-height: 25px;
    border-radius: 6px;
    padding: 3px 5px;
  }
  .medium {
    font-size: 0.95rem;
    line-height: 17px;
    border-radius: 6px;
    padding: 3px 5px;
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
