<script>
  console.log("Hello world");
</script>

<nav>
  <div class="navitem">meow</div>
  <div class="navitem">rowl</div>
  <div class="navitem">hiss</div>
</nav>

<style>
  * {
    display: flex;
    background-color: white;
  }

  nav {
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding: 12px;
    background-color: #ccc;
    justify-content: space-evenly;
  }

  .navitem {
    background-color: #999;
    border: red 1px #333;
    align-items: center;
    height: 100px;
    width: 33%;
  }
</style>
