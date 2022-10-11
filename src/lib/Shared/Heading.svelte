<script lang="ts">
  export let size: "large" | "medium" = "large";
  export let isColorful = true;
</script>

<h1 class="{size} {isColorful ? 'colorful-text' : ''}"><slot /></h1>

<style>
  h1 {
    font-size: 24px;
    margin: 0;
    display: grid;
    align-content: center;
  }

  .medium {
    font-size: 20px;
    text-align: left;
  }
</style>
