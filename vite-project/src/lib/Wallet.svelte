<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<div class="wallet">
  <div class="features">
    <div class="feature transfer">
      transfer
      <button class="increment-count" on:click={increment}>
        count is {count}
      </button>
    </div>
    <div class="feature contacts">contacts</div>
    <div class="feature collectibles">collectibles</div>
  </div>
  <nav>
    <button class="navitem">icon</button>
    <button class="navitem">icon</button>
    <button class="navitem">icon</button>
  </nav>
</div>

<style>
  * {
    display: grid;
    background-color: white;
    box-sizing: border-box;
  }

  /* The entire wallet, contains the sliding main area plus the nav bar */
  .wallet {
    width: 300px;
    height: 600px;
    overflow: hidden;
    grid-auto-flow: row;
    grid-template-rows: 1fr 48px;
  }

  .increment-count {
    width: 20px;
    height: 20px;
  }

  /* The sliding area with each of our features (wider than our actual app)*/
  .features {
    background-color: #ccc;
    width: calc(3 * 300px);
    grid-auto-flow: column;
    gap: 12px;
    padding: 12px;
  }

  .feature {
    background-color: #999;
  }
  nav {
    width: 100%;
    grid-auto-flow: row;
    height: 24px;
    grid-auto-flow: column;
  }

  nav button {
    width: 20px;
  }
</style>
