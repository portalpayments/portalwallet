<script lang="ts">
  import { getBackgroundGradient } from "../get-background-gradient";
  import type { Collectable } from "../../backend/types";
  import "@google/model-viewer";

  const mediaTypesByMimeType: Record<string, string> = {
    "model/gltf-binary": "THREE_DIMENSIONAL_MODEL",
    "video/mp4": "VIDEO",
    "image/png": "IMAGE",
    "image/jpeg": "IMAGE",
    "image/svg+xml": "IMAGE",
  };

  export let collectable: Collectable;

  const setBackgroundColor = async (modelViewerElement, imageURL) => {
    const gradient = await getBackgroundGradient(imageURL);
    modelViewerElement.style["background-image"] = gradient;
  };
</script>

{#if mediaTypesByMimeType[collectable.type] === "THREE_DIMENSIONAL_MODEL"}
  <!-- See https://modelviewer.dev/ -->
  <model-viewer
    class="media"
    on:load={(event) => setBackgroundColor(event.target, collectable.coverImage)}
    src={collectable.media}
    alt={collectable.description}
    poster={collectable.coverImage}
    shadow-intensity="1"
    camera-controls
    auto-rotate
    ar
  />
{:else if mediaTypesByMimeType[collectable.type] === "VIDEO"}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls autoPlay={true} class="media">
    <source src={collectable.media} type="video/mp4" />
  </video>
{:else}
  <img src={collectable.media} alt={collectable.description} class="media" />
{/if}

<style lang="scss">
  @import "../../mixins.scss";

  .media {
    width: 100%;
    border-radius: 8px;
    object-fit: cover;
    background-color: var(--light-grey);
  }

  model-viewer.media {
    min-height: 300px;
  }
</style>
