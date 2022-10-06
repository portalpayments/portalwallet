<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="back-button">
  <Link to="/">‹<span style="font-size: 1.5rem; margin-left: 5px; font-weight:600; color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(
    350deg,
    var(--dark-blue),
    var(--teal),
    var(--bright-green)
  ); "><slot/></span></Link>
</div>

<style>
  .back-button {
    font-size: 2rem;
    position: absolute;
    /* Just eyeballing it to fit beside the heading on the Transfers page */
    top: 42px;
    left: 6px;
    margin: 0;
    padding: 0;
  }

  /* global is needed for 'a' element under Link */
  .back-button :global(a) {
    text-decoration: none;
    background-color: transparent;
    display: inline-block;
    color: #3a3a3a;
    font-size: 2rem;
    font-weight: 400;
  }
</style>
