<script lang="ts">
  import type { Folder } from "../../backend/types";
  import FolderSVG from "../../assets/folder.svg";

  export let folder: Folder;
  export let onClick: (event) => void;
</script>

<div class="folder" on:click={() => onClick(folder.folderName)}>
  <img src={FolderSVG} alt={folder.folderName} crossOrigin="anonymous" class="shadow" />
  <div class="name">{folder.folderName}</div>
</div>

<style lang="scss">
  .folder {
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 172px;
    border-radius: 10px;
    object-fit: cover;
    background-color: transparent;
  }

  .name {
    text-align: left;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }
</style>
