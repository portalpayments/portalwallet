<script lang="ts">
  import imgUrl from "../assets/usdc.svg";
</script>

<div class="balance">
  <img class="symbol" alt="USDC logo" src={imgUrl} />
  <div class="major">2,900</div>
  <div class="minor">.27</div>
</div>

<style>
  .balance {
    color: #2775c9;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    justify-content: center;
    align-items: baseline;
    gap: 2px;
  }

  .symbol {
    width: 36px;
    /* Slight hack to make the $ in USDC be the baseline, rather than the brackets */
    transform: translateY(3px);
  }

  .major {
    font-size: 36px;
    line-height: 36px;
    font-weight: 500;
  }

  .minor {
    font-size: 24px;
    line-height: 24px;
    transform: translateY(-1px);
  }
</style>
