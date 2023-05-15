<script lang="ts">
  import { log, stringify, isIncludedCaseInsensitive } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import type { Collectable } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";
  import { Link } from "svelte-navigator";
  import { collectablesStore } from "../stores";
  import { sortByName } from "../utils";
  import { getBackgroundGradient } from "../get-background-gradient";
  import Input from "../Shared/Input.svelte";

  let isLoading = false;
  let collectables: Array<Collectable> | null = null;
  let filteredCollectables: Array<Collectable> | null = null;

  const EMPTY = "";

  let filterValue: string = EMPTY;

  const clearCollectablesFilter = () => {
    log(`Clearing filterValue...`);
    filterValue = EMPTY;
    filterCollectables(collectables, filterValue);
  };

  const isIncluded = (collectable) => {
    // TODO: Remove this filter once we have a better way to handle stickers
    // (eg folders or similar)
    // https://docs.metaplex.com/programs/token-metadata/certified-collections
    const isSticker = collectable.description.includes("Sticker Collection");
    const isDripHaus = collectable.attributes["presented_by"] === "@drip_haus";
    const isSolanaSpaces = collectable.attributes["presented_by"] === "@solanaspaces";
    const isIgnored = isSticker || isDripHaus || isSolanaSpaces;
    return !isIgnored;
  };

  const makeFilter = (filterValue) => {
    const matchesFilter = (collectable) => {
      const isNameMatch = isIncludedCaseInsensitive(collectable.name, filterValue);
      const isAttributeValue = Object.values(collectable.attributes).some((attributeValue) => {
        if (typeof attributeValue !== "string") {
          return false;
        }
        return isIncludedCaseInsensitive(attributeValue, filterValue);
      });
      return isNameMatch || isAttributeValue;
    };
    return matchesFilter;
  };

  const filterCollectables = (collectables: Array<Collectable>, filterValue: string) => {
    log(`in filterCollectables`);
    if (!collectables?.length) {
      log(`we have no collectables, not bothering to filter`);
      return;
    }

    if (filterValue === EMPTY) {
      filteredCollectables = collectables.sort(sortByName).filter(isIncluded);
      isLoading = false;
      log(`Filter value is empty, so just sorted and displayed all collectables`);
      return;
    }
    const matchesFilterValue = makeFilter(filterValue);
    filteredCollectables = collectables.sort(sortByName).filter(isIncluded).filter(matchesFilterValue);
    log(`Updated filteredCollectables based on fitler ${filterValue}`);
    isLoading = false;
  };

  const setBackgroundColor = async (event) => {
    const imageElement = event.target;
    const gradient = await getBackgroundGradient(imageElement.src);
    imageElement.style["background-image"] = gradient;
  };

  collectablesStore.subscribe((newValue) => {
    collectables = newValue;
    if (newValue) {
      filterCollectables(collectables, filterValue);
    }
  });

  $: filterValue && filterCollectables(collectables, filterValue);
</script>

<div class="heading">
  <Heading theme="art">Collectables</Heading>
  <Input
    value={filterValue}
    isFocused={false}
    label="Search names and attributes"
    onTypingPause={(event) => {
      // @ts-ignore
      const newFilterValue = event.target.value;
      log(`Setting filter value to `, newFilterValue);
      filterValue = newFilterValue;
    }}
    onClear={clearCollectablesFilter}
    shape="round"
    theme="art"
    showClearButton={true}
  />
</div>
{#if isLoading}
  <SkeletonGallery />
{:else if filteredCollectables?.length}
  <div class="collectables">
    {#each filteredCollectables as collectable}
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
  <div class="no-collectables">No {filterValue === EMPTY ? "matching " : ""}collectables.</div>

  {collectables?.length}
  {filteredCollectables?.length}
{/if}

<style lang="scss">
  @import "../../mixins.scss";
  .heading {
    position: absolute;
    grid-template-rows: 48px 48px;
    width: 100%;
    text-align: left;
    padding: 0 12px 12px 12px;
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
    // background: linear-gradient(180deg, white 0%, white 30%, #ffffffe3 40%, transparent 100%);
    @include acryllic;
  }

  .no-collectables,
  .collectables {
    // Extra padding  = 48 + 48 + 12
    padding: 108px 12px 12px 12px;
  }

  .collectables {
    display: grid;
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
    line-height: 16px;
    font-weight: 600;
  }
</style>
