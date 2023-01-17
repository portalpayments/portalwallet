<script lang="ts">
  export let size: "large" | "medium" = "large";
  export let theme: "finance" | "art" = "finance";
</script>

<h1 class="{size} {theme}"><slot /></h1>

<style lang="scss">
  @import "../../mixins.scss";

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

  .finance {
    @include blue-green;
  }

  .art {
    @include purple-orange;
  }
</style>
