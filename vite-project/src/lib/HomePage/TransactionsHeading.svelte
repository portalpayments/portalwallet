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

  .heading > :global(a) {
    text-align: right;
    justify-self: end;
    padding: 0;
    border: 0;
    width: fit-content;
    background-color: transparent;
    color: #419cfd;
    font-weight: 600;
    text-transform: none;
    font-size: 0.9rem;
  }

  .heading button:hover {
    color: #64acfa;
  }
  .heading button:active {
    color: #4998ed;
  }
</style>
