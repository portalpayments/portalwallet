<script lang="ts">
  import { log, stringify } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { Collectable } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";
  import { Link } from "svelte-navigator";
  import { collectablesStore } from "../stores";
  import analyze from "rgbaster";

  const getDominantColor = async (imageURL) => {
    const results = await analyze(imageURL);
    if (results.length === 0) {
      return null;
    }
    return results[0].color;
  };

  let isLoading = false;
  let collectables: Array<Collectable> | null = null;

  const sortByName = (a, b) => a.name.localeCompare(b.name);

  collectablesStore.subscribe((newValue) => {
    if (newValue !== null) {
      collectables = newValue.sort(sortByName);
      isLoading = false;
    }
  });

  const setBackgroundColor = async (event) => {
    const imageElement = event.target;
    const color = await getDominantColor(imageElement.src);
    imageElement.style.backgroundColor = color;
  };
</script>

<div class="heading">
  <Heading theme="art">Collectables</Heading>
</div>
{#if isLoading}
  <SkeletonGallery />
{:else if collectables?.length}
  <div class="nfts">
    {#each collectables as collectable}
      <Link to={`/collectables/${collectable.id}`}>
        <div class="collectable">
          <img
            src={collectable.coverImage}
            alt={collectable.description}
            crossOrigin="anonymous"
            on:load={setBackgroundColor}
            class="shadow"
          />
          <div class="description">
            <div class="name">{collectable.name}</div>
          </div>
        </div>
      </Link>
    {/each}
  </div>
{:else}
  <div>No collectables.</div>
{/if}

<style lang="scss">
  @import "../../mixins.scss";
  .heading {
    position: absolute;
    height: 64px;
    width: 100%;
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
    @include acryllic;
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
