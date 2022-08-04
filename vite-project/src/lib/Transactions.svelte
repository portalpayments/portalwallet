<script>
  import avatarImageUrl from "../assets/avatar.png";
  console.log("Hello from transactions component");
</script>

<div class="transactions">
  <div class="transaction">
    <img src={avatarImageUrl} alt="" />
    <div class="name">name</div>
    <div class="amount">amount</div>
  </div>
  <div class="transaction">
    <img src={avatarImageUrl} alt="" />
    <div class="name">name</div>
    <div class="amount">amount</div>
  </div>
  <div class="transaction">
    <img src={avatarImageUrl} alt="" />
    <div class="name">name</div>
    <div class="amount">amount</div>
  </div>
</div>

<style>
  .transactions {
    display: grid;
    grid-auto-flow: row;
    border: 1px solid red;
    gap: 12px;
    padding: 0 12px;
  }

  .transaction {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
  }
</style>
