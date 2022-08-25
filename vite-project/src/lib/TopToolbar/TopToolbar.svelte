<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import NotifiactionBell from "../../assets/notification-bell.svg";
  import Auth from "../Auth/Auth.svelte";
  export let name = "anonymous";
  export let verified = false;

  //src https://stackoverflow.com/questions/55715800/how-to-make-drop-down-menus-open-properly
  // Get all the menus into an array, just once:
  let menus = Array.prototype.slice.call(
    document.querySelectorAll(".dropdown-content")
  );

  let openMenu = null;

  /* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
  function hideAllMenus() {
    // Get all the dropdowns into an array.
    console.log("menus " + menus);
    menus.forEach(function (dropdown) {
      // If the element currently is not hidden
      if (!dropdown.classList.contains("hide")) {
        openMenu = dropdown;
        dropdown.classList.add("hide"); // Hide it
      }
    });
  }

  // Close the dropdown menu if the user clicks outside of it
  document.addEventListener("click", function (event) {
    console.log("I'm here ");
    hideAllMenus(); // Hide all the menus
    console.log("next sibling " + event.target.nextElementSibling.classList);
    // If the clicked item was a menu
    if (event.target.classList.contains("dropbutton")) {
      if (event.target.nextElementSibling === openMenu) {
        event.target.nextElementSibling.classList.add("hide");
        openMenu = null;
      } else {
        // Go to the next element that is a sibling of the one that got clicked (the menu)
        // and toggle the use of the `hide` CSS class
        event.target.nextElementSibling.classList.remove("hide"); // Show the one that was clicked
        openMenu = event.target.nextElementSibling;
      }
    }
  });
</script>

<div class="header">
  <div class="dropdown">
    <button class="dropbutton">
      {name}
      {#if verified}
        <img src={Checkmark} alt="User is Verified" />
      {/if}
    </button>
    <div class="dropdown-content hide">
      <!-- <Auth /> -->
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
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

  /* Dropdown button on hover & focus */
  .dropbutton:hover {
    background-color: rgba(61, 101, 245, 0.8);
    color: #fff;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    position: absolute;
    min-width: 100%;
    background-color: #f1f1f1;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
  }

  /* Add or remove this to hide or show */
  .hide {
    display: none;
  }
</style>
