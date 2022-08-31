<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import NotifiactionBell from "../../assets/notification-bell.svg";
  import Auth from "../Auth/Auth.svelte";
  export let name = "anonymous";
  export let verified = false;

  let dropbuttonClicked = false;
</script>

<div class="header">
  <div class="dropdown">
    <button
      class={!dropbuttonClicked ? "dropbutton" : "dropbuttonclicked "}
      on:click={() => (dropbuttonClicked = !dropbuttonClicked)}
    >
      {name}
      {#if verified}
        <img src={Checkmark} alt="User is Verified" />
      {/if}
    </button>
    <div class="dropdown-content {!dropbuttonClicked ? 'hide' : ''}">
      <Auth />
    </div>
  </div>
  <button style="justify-self: end; background: none; padding: 0;">
    <img src={NotifiactionBell} alt="Notifications" class="bellIcon" />
  </button>
</div>

<style>
  .header {
    display: grid;
    grid-auto-flow: column;
    padding: 0px 10px 0px 10px;
    grid-template-columns: 1fr 100px;
    align-items: center;
    justify-items: start;
    gap: 4px;
  }
  .dropbutton {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: #2d5177;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
  }
  .dropbutton > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
  .bellIcon {
    filter: invert(37%) sepia(30%) saturate(2457%) hue-rotate(184deg)
      brightness(97%) contrast(87%);
  }
  /* src https://www.w3schools.com/howto/howto_js_dropdown.asp*/

  .dropbuttonclicked {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: #2d5177;
    font-weight: 600;
    font-size: 1rem;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .dropbuttonclicked > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    position: absolute;
    // Eyeballing it - to my eye the right borders weren’t aligned in Chrome
    width: 99%;
    height: 32px;
    border-bottom-right-radius: 21px;
    border-bottom-left-radius: 21px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    font-size: 1rem;
  }

  /* Add or remove this to hide or show */
  .hide {
    display: none;
  }
</style>
