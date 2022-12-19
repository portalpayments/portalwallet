<script lang="ts">
  export let steps: number;
  export let currentStep: number;

  $: progress = (currentStep / (steps - 1)) * 100;
</script>

<div class="progress-bar">
  <div class="progress" style="width: {progress}%" />
</div>

<style type="text/scss">
  .progress-bar {
    background-color: var(--very-light-grey);
    height: 6px;
    border-radius: 3px;
    width: 100%;
    align-self: start;
  }

  .progress {
    background: var(--blue-green-gradient);
    height: 100%;
    border-radius: 3px;
  }
</style>
