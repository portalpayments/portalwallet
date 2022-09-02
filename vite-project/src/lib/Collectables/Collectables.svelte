<script lang="ts">
  import { log, stringify, asyncMap } from "../../../../src/functions";
  import { getAllNftMetadatasFromAWallet } from "../../../../src/identity-tokens";
  import { httpGet } from "../utils";
  import type { Collectable } from "../types";

  import { connectionStore, keyPairStore } from "../stores";

  import { Metaplex } from "@metaplex-foundation/js";

  import type { Connection, Keypair } from "@solana/web3.js";

  let connection: Connection;
  let keypair: Keypair;

  let collectables: Array<Collectable> = [];

  const updateCollectables = async () => {
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }
    log(`🖼️ Keypair or connection have changed, updating collectables`);
    const allNftsFromAWallet = await getAllNftMetadatasFromAWallet(
      connection,
      keypair,
      keypair.publicKey
    );
    collectables = (await asyncMap(allNftsFromAWallet, async (nft) => {
      const data = await httpGet(nft.uri);
      const firstFile = data?.properties?.files?.[0];
      const image = firstFile?.uri || null;
      const type = firstFile?.type || null;
      return {
        name: data.name,
        description: data.description,
        image,
        type,
      };
    })) as Array<Collectable>;
    // Filter out non-collectible NFTs
    collectables = collectables.filter((collectable) => {
      return Boolean(collectable.image);
    });
    log("collectables", stringify(collectables));
  };

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      connection = newValue;
      updateCollectables();
    }
  });

  keyPairStore.subscribe((newValue) => {
    if (newValue) {
      keypair = newValue;
      updateCollectables();
    }
  });
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
