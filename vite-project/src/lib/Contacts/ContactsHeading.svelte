<script lang="ts">
</script>

<div class="heading">
  <div>Contacts</div>

  <button>+</button>
</div>

<style>
  .heading {
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 190px;
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
