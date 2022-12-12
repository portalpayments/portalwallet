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

    collectables = await asyncMap(allNftsFromAWallet, async (nft) => {
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
    });

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

<div class="heading">
  <Heading theme="purple-orange">Gallery</Heading>
</div>
<div class="feature">
  {#if isLoading}
    <SkeletonGallery />
  {:else if collectables.length}
    <div class="nfts">
      {#each collectables as collectable}
        <div class="collectable">
          <img
            src={collectable.image}
            alt={collectable.description}
            class="shadow"
          />
          <div class="description">
            <div class="name">{collectable.name}</div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div>No collectibles.</div>
  {/if}
</div>

<style>
  .heading {
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
  }

  .feature {
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
  }
  .nfts {
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 192px;
  }
  img {
    width: 100%;
    height: 172px;
    border-radius: 10px;
    object-fit: cover;
    background-color: var(--light-grey);
  }

  .description {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
  }
</style>
