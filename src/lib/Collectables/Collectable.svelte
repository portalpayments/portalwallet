<script lang="ts">
  import { log, stringify, formatObjectKeys } from "../../backend/functions";
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
      const newValueAtIndex = newValue[collectableIndex];
      if (!newValueAtIndex) {
        throw new Error(`No collectable found at index ${collectableIndex}`);
      }
      collectable = newValueAtIndex;
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
      <a href={collectable.media} target="_blank">
        {#if collectable.type === "video/mp4"}
          <!-- svelte-ignore a11y-media-has-caption -->
          <video controls autoPlay={true} class="media">
            <source src={collectable.media} type="video/mp4" />
          </video>
        {:else if collectable.type === "image/png" || collectable.type === "image/jpeg" || collectable.type === "image/svg+xml" || collectable.type === null}
          <img
            src={collectable.media}
            alt={collectable.description}
            class="media"
          />
        {/if}
      </a>

      <div class="description">
        {collectable.description}
      </div>

      <div class="attributes">
        {#each Object.entries(formatObjectKeys(collectable.attributes)) as [attributeName, attributeValue]}
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
    align-content: start;
    display: grid;
    padding: 12px;
    gap: 12px;
    grid-template-columns: 1fr;
    background: radial-gradient(at 50% 50%, #ffe7dd 0, #fff 80%, #fff 100%);
    overflow-y: scroll;
  }

  .heading {
    height: 42px;
    text-align: left;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
  }

  .media {
    width: 100%;
    border-radius: 8px;
    object-fit: cover;
    background-color: var(--light-grey);
  }

  .scrollable {
    overflow-y: scroll;
    align-content: start;
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
