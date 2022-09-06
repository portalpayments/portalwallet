<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="heading">
  <div>transactions</div>

  <Link to="/transactions">See all</Link>
</div>

<style>
  .heading {
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 50px;
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
