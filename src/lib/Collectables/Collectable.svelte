<script lang="ts">
  import { log, stringify } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { Collectable } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";
  import BackButton from "../Shared/BackButton.svelte";
  import { Link } from "svelte-navigator";
  import { collectablesStore } from "../stores";

  let isLoading = false;

  let collectableIndex: number = Number(
    window.location.pathname.split("/").at(-1)
  );

  let collectable: Collectable | null = null;

  collectablesStore.subscribe((newValue) => {
    if (newValue !== null) {
      collectable = newValue[collectableIndex];
      isLoading = false;
    }
  });
</script>

<div class="collectable-screen">
  {#if isLoading}
    <SkeletonGallery />
  {:else if collectable}
    <div class="heading">
      <BackButton />
      <Heading theme="art">{collectable.name}</Heading>
    </div>

    <div class="scrollable">
      <a href={collectable.image} target="_blank">
        <img
          src={collectable.image}
          alt={collectable.description}
          class="shadow"
        />
      </a>

      <div class="description">
        {collectable.description}
      </div>

      <div class="attributes">
        {#each Object.entries(collectable.attributes) as [attributeName, attributeValue]}
          <div class="attribute-name">{attributeName}</div>
          <div class="attribute-value">{attributeValue}</div>
        {/each}
      </div>
    </div>
  {:else}
    <div>Collectable not found.</div>
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .collectable-screen {
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr;
    grid-template-rows: 44px 1fr;
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
    overflow-y: scroll;
  }

  .collectable-screen > * {
    width: 276px;
  }

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

  .scrollable {
    overflow-y: scroll;
    align-content: start;
  }

  img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    background-color: var(--light-grey);
  }

  .description {
    text-align: left;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
  }

  .attributes {
    display: grid;
    grid-template-columns: 136px 136px;
    grid-auto-rows: 24px;
  }

  .attribute-name {
    text-align: left;
  }

  .attribute-value {
    text-align: right;
  }

  .attribute-name,
  .attribute-value {
    border-bottom: 1px solid var(--black);
    font-size: 12px;
    overflow: hidden;
  }
</style>
