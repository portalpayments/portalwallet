<script lang="ts">
  import { log, stringify, isIncludedCaseInsensitive } from "../../backend/functions";
  import Heading from "../Shared/Heading.svelte";
  import CollectableThumb from "./CollectableThumb.svelte";
  import FolderThumb from "./FolderThumb.svelte";
  import type { Collectable, Folder } from "../../backend/types";
  import SkeletonGallery from "../Shared/Skeletons/SkeletonGallery.svelte";
  import { collectablesStore } from "../stores";
  import { sortByName } from "../utils";
  import { getCollectablesInFolders } from "../../backend/collectables";
  import type { CollectablesInFolders } from "../../backend/types";

  import Input from "../Shared/Input.svelte";

  let isLoading = false;
  let collectables: Array<Collectable> | null = null;
  let filteredCollectables: Array<Collectable> | null = null;

  const EMPTY = "";

  let filterValue: string = EMPTY;

  let activeFolderName: string | null = null;
  let collectablesInFolders: CollectablesInFolders = [];
  let collectablesInActiveFolder: Array<Collectable> = [];

  const clearCollectablesFilter = () => {
    log(`Clearing filterValue...`);
    filterValue = EMPTY;
    filterCollectables(collectables, filterValue);
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

    // TODO: we clear the active folder and make search go across all our NFTS
    // In future we may want to search only in the current folder
    activeFolderName = null;

    if (!collectables?.length) {
      log(`we have no collectables, not bothering to filter`);
      return;
    }

    if (filterValue === EMPTY) {
      filteredCollectables = collectables.sort(sortByName);
      isLoading = false;
      log(`Filter value is empty, so just sorted and displayed all collectables`);
      return;
    }
    const matchesFilterValue = makeFilter(filterValue);
    filteredCollectables = collectables.sort(sortByName).filter(matchesFilterValue);
    log(`Updated filteredCollectables based on filter ${filterValue}`);
    isLoading = false;
  };

  collectablesStore.subscribe((newValue) => {
    collectables = newValue;
    collectablesInFolders = getCollectablesInFolders(collectables);
    if (newValue) {
      filterCollectables(collectables, filterValue);
    }
  });

  $: filterValue, filterCollectables(collectables, filterValue);

  const isAFolder = (collectableOrFolder: Collectable | Folder): collectableOrFolder is Folder => {
    return Object.hasOwn(collectableOrFolder, "folderName");
  };

  const setFolder = (folderName: string) => {
    log(`Setting active folder`);
    activeFolderName = folderName;
    const activeFolder = collectablesInFolders.find((collectableOrFolder) => {
      if (!isAFolder(collectableOrFolder)) {
        return false;
      }
      return collectableOrFolder.folderName === activeFolderName;
    });
    collectablesInActiveFolder = (activeFolder as Folder).collectables;
  };
</script>

<div class="heading">
  <Heading theme="art">{activeFolderName || "Collectables"}</Heading>
  <Input
    value={filterValue}
    isFocused={false}
    label="Search names and attributes"
    onTypingPause={(event) => {
      // TODO: fix the ignore. Not sure why an input event wouldn't have a value.
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
{:else if collectables?.length}
  <div class="collectables">
    {#if activeFolderName}
      <!-- Show the collectables in a single folder -->
      {#each collectablesInActiveFolder as collectable}
        <CollectableThumb {collectable} />
      {/each}
    {:else if filterValue?.length}
      <!-- Show all collectables that match the filter -->
      {#each filteredCollectables as collectable}
        <CollectableThumb {collectable} />
      {/each}
      {#if filteredCollectables.length === 0}
        <div class="no-collectables">No matching collectables.</div>
      {/if}
    {:else}
      <!-- Show all collectables, as a collection of individual collectables as well as folders containing multiple collectables -->
      {#each collectablesInFolders as collectableOrFolder}
        {#if isAFolder(collectableOrFolder)}
          <FolderThumb folder={collectableOrFolder} onClick={setFolder} />
        {:else}
          <CollectableThumb collectable={collectableOrFolder} />
        {/if}
      {/each}
    {/if}
  </div>
{:else}
  <div class="no-collectables">No collectables.</div>
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
    @include acryllic;
  }

  .no-collectables,
  .collectables {
    // Extra padding  = 48 + 48 + 12
    padding: 108px 12px 12px 12px;
  }

  .no-collectables {
    grid-column: span 2;
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
</style>
