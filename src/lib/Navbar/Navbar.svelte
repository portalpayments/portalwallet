<script lang="ts">
  import { log } from "../../backend/functions";
  export let currentFeature: number = 0;
  const navigate = (newFeature) => {
    log(`Changing currentFeature to ${newFeature}`);
    currentFeature = newFeature;
  };
  const features = [
    {
      name: "transfer",
    },
    {
      name: "contacts",
    },
    {
      name: "collectables",
    },
  ];
</script>

<nav>
  <buttongroup class="shadow">
    {#each features as feature, index}
      <button
        class="{feature.name} {currentFeature === index ? 'active' : ''}"
        type="button"
        title={feature.name}
        on:click={() => navigate(index)}
      />
    {/each}
  </buttongroup>
</nav>

<style>
  nav {
    width: 100%;
    padding: 8px 0;
    background: transparent;
    /* Position the navbar over the features at the bottom on header-and-features*/
    position: absolute;
    bottom: 0;
    z-index: 1;
  }
  buttongroup {
    height: 48px;
    justify-self: center;
    display: grid;
    grid-auto-flow: column;
    border: 1.5px solid var(--chalk-white);
    border-radius: 29px;
    /* Bunch the buttons up together in the center */
    grid-auto-columns: min-content;
    gap: 16px;
    padding: 0 16px;
    justify-content: center;
    align-items: center;
  }

  buttongroup button {
    padding: 0;
    margin: 0;
    width: 32px;
    height: 32px;
    /* Position background right in the middle of the button */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    /* Let's animate the button fade */
    transition: all 200ms ease-in-out;
  }

  buttongroup button:not(.active) {
    opacity: 0.3;
  }

  buttongroup button.transfer {
    background-image: url("/src/assets/transfer.svg");
  }

  buttongroup button.contacts {
    background-image: url("/src/assets/contacts.svg");
  }

  buttongroup button.collectables {
    background-image: url("/src/assets/collectables.svg");
  }

  * {
    display: grid;
    color: black;
    background-color: white;
    box-sizing: border-box;
  }
</style>
