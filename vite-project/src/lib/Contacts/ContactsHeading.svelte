<script lang="ts">
  import Heading from "../Shared/Heading.svelte";
</script>

<div class="heading">
  <Heading>Contacts</Heading>

  <button>+</button>
</div>

<style>
  .heading {
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
  }

  .heading button {
    text-align: right;
    justify-self: end;
    padding: 0;
    border: 0;
    width: fit-content;
    background-color: transparent;
    color: #3a3a3a;
    font-weight: 500;
    text-transform: none;
    font-size: 1.4rem;
  }

  .heading button:hover {
    color: var(--black);
  }
  .heading button:active {
    color: #3a3a3a;
  }
</style>
