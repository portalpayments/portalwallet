<script lang="ts">
  import type { Priority } from "../constants";
  export let priority: Priority;
</script>

<!-- See https://svelte.dev/tutorial/slots -->
<div class="badge {priority}"><slot /></div>

<style>
  .badge {
    display: inline-grid;
    align-items: center;
    width: fit-content;
    padding: 4px 12px;
    text-transform: uppercase;

    height: min-content;
    border-radius: 8px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 600;
  }

  .info {
    color: white;
    background-color: hsl(0, 0%, 40%);
  }

  .important {
    color: #4d4d4d;
    background-color: hsl(58, 75%, 78%);
  }

  .warning {
    color: white;
    background-color: hsl(351, 65%, 33%);
  }
</style>
