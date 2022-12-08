<script lang="ts">
  export let size: "large" | "medium" = "large";
  export let theme: "blue-green" | "purple-orange" = "blue-green";
</script>

<h1 class="{size} {theme}"><slot /></h1>

<style>
  h1 {
    font-size: 24px;
    margin: 0;
  }

  .large {
    font-size: 24px;
    line-height: 28px;
    text-align: left;
  }

  .medium {
    font-size: 20px;
    text-align: left;
  }
</style>
