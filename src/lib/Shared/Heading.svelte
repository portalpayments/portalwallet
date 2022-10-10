<script lang="ts">
  export let size: "large" | "medium" = "large";
</script>

<h1 class={size}><slot /></h1>

<style>
  h1 {
    font-size: 24px;
    margin: 0;
    display: grid;
    align-content: center;
    /* Colored background techique used on website */
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(
      350deg,
      var(--dark-blue),
      var(--teal),
      var(--bright-green)
    );
  }

  .medium {
    font-size: 20px;
    text-align: left;
  }
</style>
