<script>
  import beepleMockNFT from "../../assets/Collectables/beepleMockNFT.jpg";
  import beepleMockNFT2 from "../../assets/Collectables/beepleMockNFT2.jpg";
  import baycMockNFT from "../../assets/Collectables/baycMockNFT.jpg";

  const collectables = [
    {
      image: beepleMockNFT,
      description: "beeple's Spaceman on a new planet",
    },
    {
      image: baycMockNFT,
      description: "BAYC NFT",
    },
    {
      image: beepleMockNFT2,
      description: "beeple's human production machine",
    },
  ];
</script>

<div class="nfts">
  {#each collectables as collectable}
    <img src={collectable.image} alt={collectable.description} />
  {/each}
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
