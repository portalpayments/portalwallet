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
      <button on:click={increment}>
        count is {count}
      </button>
    </div>
    <div class="feature contacts">contacts</div>
    <div class="feature collectibles">collectibles</div>
  </div>
</div>

<style>
  * {
    display: grid;
    background-color: white;
    box-sizing: border-box;
  }

  .wallet {
    width: 300px;
    height: 600px;
    overflow: hidden;
  }

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

  button {
    width: 20px;
    height: 20px;
  }
</style>
