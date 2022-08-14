<script>
  import beepleMockNFT from "../../assets/beepleMockNFT.jpg";
  import beepleMockNFT2 from "../../assets/beepleMockNFT2.jpg";
  import baycMockNFT from "../../assets/baycMockNFT.jpg";
</script>

<!-- TODO create a dynamic way of listing NFTs, by looping over an array of owned NFTs -->

<div class="grid-parent-container">
  <img src={beepleMockNFT} alt="beeple\'s Spaceman on a new planet" />
  <img src={baycMockNFT} alt="BAYC NFT" />
  <img src={beepleMockNFT2} alt="beeple\'s human poduction machine" />
</div>

<style>
  .grid-parent-container {
    display: grid;
    column-gap: 10px;
    row-gap: 10px;
    justify-content: center;
    grid-template-columns: 45% 45%;
    grid-template-rows: 33% 33% 33%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
</style>
