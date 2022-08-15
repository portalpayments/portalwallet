<script>
  import beepleMockNFT from "../../assets/beepleMockNFT.jpg";
  import beepleMockNFT2 from "../../assets/beepleMockNFT2.jpg";
  import baycMockNFT from "../../assets/baycMockNFT.jpg";
</script>

<!-- TODO create a dynamic way of listing NFTs, by looping over an array of owned NFTs -->

<div class="nfts">
  <img src={beepleMockNFT} alt="beeple\'s Spaceman on a new planet" />
  <img src={baycMockNFT} alt="BAYC NFT" />
  <img src={beepleMockNFT2} alt="beeple\'s human poduction machine" />
</div>

<style>
  .nfts {
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 165px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
</style>
