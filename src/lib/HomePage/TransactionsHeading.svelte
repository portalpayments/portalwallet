<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="heading">
  <Link to="/transactions">See all</Link>
</div>

<style type="text/scss">
  @import "../../mixins.scss";
  .heading {
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }

  /* global is needed for 'a' element under .heading */
  .heading > :global(a) {
    text-align: right;
    justify-self: end;
    padding: 0;
    border: 0;
    width: fit-content;
    background-color: transparent;
    color: var(--mid-blue);
    font-weight: 600;
    text-transform: none;
    font-size: 0.9rem;
  }

  .heading :global(a):hover {
    color: var(--mid-blue);
  }
  .heading :global(a):active {
    color: var(--chalk-white);
  }
</style>
