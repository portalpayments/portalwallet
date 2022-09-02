<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="back-button">
  <Link to="/">‹</Link>
</div>

<style>
  .back-button {
    font-size: 2rem;
    padding: 10px;
    width: 10%;
  }

  /* global is needed for 'a' element under Link */
  .back-button :global(a) {
    text-decoration: none;
    padding: 7px 0px;
    background-color: transparent;
    display: inline-block;
    color: #3a3a3a;
    font-size: 2rem;
    font-weight: 400;
  }
</style>
