<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="recipientDetails">
  <div class="back-button">
    <Link to="/">&#8249;</Link>
  </div>
  <div class="verification-status">hello world</div>
</div>

<style>
  .recipientDetails {
    position: absolute;
    top: 40px;
    display: grid;
    grid-auto-flow: rows;
    grid-template-rows: 30px 1fr;
    width: 100%;
    height: 175px;
    background-color: #475;

    align-items: start;
  }
  .verification-status {
    align-self: center;
  }
  .previous {
    background-color: transparent;
  }
  .back-button {
    font-size: 2rem;
    align-self: start;
    width: 10%;
  }
  .back-button > :global(a) {
    text-decoration: none;
    padding: 7px 0px;
    background-color: transparent;
    display: inline-block;
    padding: 8px 16px;
    color: #4d4d4d;
    font-size: 2rem;
    font-weight: 500;
  }
</style>
