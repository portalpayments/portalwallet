<script lang="ts">
  import { log, stringify } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { Collectable } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";

  import { collectablesStore } from "../stores";

  let isLoading = false;
  let collectables: Array<Collectable> | null = null;

  collectablesStore.subscribe((newValue) => {
    if (newValue !== null) {
      collectables = newValue;
      isLoading = false;
    }
  });
</script>

<div class="heading">
  <Heading theme="art">Gallery</Heading>
</div>
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

<style lang="scss">
  @import "../../mixins.scss";
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

  .nfts {
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 192px;
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
    overflow-y: scroll;
    padding-bottom: var(--padding-for-nav-button);
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
