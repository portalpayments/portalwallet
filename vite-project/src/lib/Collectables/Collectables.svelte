<script type="ts">
  import { log, stringify } from "../../../../src/functions";
  import { getAllNftsFromAWallet } from "../../../../src/identity-tokens";
  import { httpGet } from "../utils";
  import { asyncMap } from "../../../../src/functions";

  log(`Collectables page loading...`);

  import { Metaplex } from "@metaplex-foundation/js";
  console.log(Metaplex);
  import type { Connection, Keypair } from "@solana/web3.js";

  export let connection: Connection;
  export let keyPair: Keypair;

  interface Collectable {
    name: string;
    description: string;
    image: string;
  }

  let collectables: Array<Collectable> = [];

  (async () => {
    const allNftsFromAWallet = await getAllNftsFromAWallet(
      connection,
      keyPair.publicKey
    );
    collectables = (await asyncMap(allNftsFromAWallet, async (nft) => {
      const data = await httpGet(nft.uri);
      return {
        name: data.name,
        description: data.description,
        image: data.image,
      };
    })) as Array<Collectable>;
    log("collectables", stringify(collectables));
  })();
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
