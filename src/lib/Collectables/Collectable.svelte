<script lang="ts">
  import { log, stringify, formatObjectKeys } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { Collectable } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";
  import BackButton from "../Shared/BackButton.svelte";
  import ShowCollectableMedia from "./ShowCollectableMedia.svelte";
  import Twitter from "../../assets/twitter.svg";
  import { collectablesStore } from "../stores";

  let isLoading = true;

  let collectableID: string = window.location.pathname.split("/").at(-1);
  let collectable: Collectable | null = null;

  const TWITTER_USERNAME_REGEX = /^@(\w){1,15}$/;

  const getTwitterUsername = (value: unknown): null | string => {
    if (typeof value !== "string") {
      return null;
    }
    if (TWITTER_USERNAME_REGEX.test(value)) {
      return value.split("@")[1];
    }
    return null;
  };

  collectablesStore.subscribe((newValue) => {
    if (newValue !== null) {
      const newValueWithID = newValue.find((item) => item.id === collectableID);
      if (!newValueWithID) {
        throw new Error(`No collectable found at index ${collectableID}`);
      }
      collectable = newValueWithID;
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
        <ShowCollectableMedia {collectable} />
      </a>

      <div class="description">
        {collectable.description}
      </div>

      <div class="attributes">
        {#each Object.entries(formatObjectKeys(collectable.attributes)) as [attributeName, attributeValue]}
          <div class="attribute-name">{attributeName}</div>

          <div class="attribute-value">
            {#if getTwitterUsername(attributeValue)}
              <a
                class="twitter-link"
                href={`https://twitter.com/${getTwitterUsername(attributeValue)}`}
                target="_blank"
              >
                <img class="twitter-logo" src={Twitter} alt="Twitter logo" />
                {getTwitterUsername(attributeValue)}
              </a>
            {:else}
              {attributeValue}
            {/if}
          </div>
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
    // Nothing at bottom as we want to scroll down
    padding: 12px 12px 0 12px;
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
    // 24px plus 1px border
    grid-auto-rows: 33px;
  }

  .attributes * {
    height: 100%;
    align-items: center;
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

  a.twitter-link {
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    align-items: center;
    gap: 3px;
  }

  .twitter-logo {
    opacity: 0.7;
    height: 9px;
  }
</style>
