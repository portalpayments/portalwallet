<script lang="ts">
  import type { Collectable } from "../../backend/types";
  import { getBackgroundGradient } from "../get-background-gradient";
  import { Link } from "svelte-navigator";

  export let collectable: Collectable;

  const setBackgroundColor = async (event) => {
    const imageElement = event.target;
    const gradient = await getBackgroundGradient(imageElement.src);
    imageElement.style["background-image"] = gradient;
  };
</script>

<Link to={`/collectables/${collectable.id}`}>
  <div class="collectable">
    <img
      src={collectable.coverImage}
      alt={collectable.description}
      crossOrigin="anonymous"
      on:load={setBackgroundColor}
      class="shadow"
    />
    <div class="name">{collectable.name}</div>
  </div>
</Link>

<style lang="scss">
  img {
    width: 100%;
    height: 172px;
    border-radius: 10px;
    object-fit: cover;
    background-color: var(--light-grey);
  }

  .name {
    text-align: left;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }
</style>
