<script lang="ts">
  import { log, stringify, asyncMap } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import { getAllNftMetadatasFromAWallet } from "../../backend/identity-tokens";
  import { httpGet } from "../utils";
  import type { Collectable } from "../types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";

  import { connectionStore, authStore } from "../stores";

  import type { Connection, Keypair } from "@solana/web3.js";
  import { Keypair as KeypairConstructor } from "@solana/web3.js";

  let connection: Connection;
  let keypair: Keypair;
  let isLoading = false;
  let collectables: Array<Collectable> = [];

  const updateCollectables = async () => {
    isLoading = true;
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }
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
    isLoading = false;
  };

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      connection = newValue;
      log(`🔌 connection has changed, updating collectibles`);
      updateCollectables();
    }
  });

  authStore.subscribe((newValue) => {
    if (newValue.keyPair) {
      log(`🗝️ secretKey has changed, updating collectibles`);
      keypair = newValue.keyPair;
      updateCollectables();
    }
  });
</script>

<div class="feature">
  <div class="heading">
    <Heading>Gallery</Heading>
  </div>
  {#if isLoading}
    <SkeletonGallery />
  {:else if collectables.length}
    <div class="nfts">
      {#each collectables as collectable}
        <img
          src={collectable.image}
          alt={collectable.description}
          class="shadow"
        />
      {/each}
    </div>
  {:else}
    <div>No collectibles.</div>
  {/if}
</div>

<style>
  .heading {
    padding: 0 12px;
  }
  .feature {
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
  }
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
    background-color: var(--light-grey);
  }
</style>
