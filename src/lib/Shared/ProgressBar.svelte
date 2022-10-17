<script lang="ts">
  export let steps: number;
  export let currentStep: number;

  $: progress = (currentStep / (steps - 1)) * 100;
</script>

<div class="progress-bar">
  <div class="progress" style="width: {progress}%" />
</div>

<style>
  .progress-bar {
    background-color: var(--very-light-grey);
    height: 6px;
    width: 100%;
  }

  .progress {
    background: var(--blue-green-gradient);
    height: 100%;
  }
</style>
