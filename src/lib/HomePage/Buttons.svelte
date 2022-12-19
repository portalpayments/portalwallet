<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="add-and-send-buttons">
  <Link class="button" to="/addMoneyToAccount">Add money</Link>
  <Link class="button" to="/sendMoney">Send money</Link>
</div>

<style type="text/scss">
  @import "../../mixins.scss";
  .add-and-send-buttons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40% 40%;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  /* global is needed for 'a' element under Link */
  .add-and-send-buttons :global(a.button) {
    color: white;
    font-weight: 600;
    padding: 7px 0px;
    font-size: 14px;

    border-radius: 24px;
    background: var(--blue-green-gradient);
    @include shadow;
  }
  .add-and-send-buttons :global(a.button):active {
    color: #fff;
    background-color: var(--mid-blue);
  }
</style>
