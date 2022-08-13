<script lang="ts">
  const log = console.log;
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
      name: "collectibles",
    },
  ];
</script>

<nav>
  {#each features as feature, index}
    <button
      class="{feature.name} {currentFeature === index ? 'active' : ''}"
      type="button"
      title={feature.name}
      on:click={() => navigate(index)}
    />
  {/each}
</nav>

<style>
  nav {
    height: 48px;
    justify-self: center;
    display: grid;
    grid-auto-flow: column;
    border: 1.5px solid #f3f3f3;
    border-radius: 29px;
    /* Bunch the buttons up together in the center */
    grid-auto-columns: min-content;
    gap: 16px;
    padding: 0 16px;
    justify-content: center;
    align-items: center;
    /* Not sure if this is the best way to do this - TODO - Mike Please review. Trying to position the navbar over the wallet content*/
    position: relative;
    bottom: 40px;
    z-index: 90;
  }

  nav button {
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

  nav button:not(.active) {
    opacity: 0.3;
  }

  nav button.transfer {
    background-image: url("/src/assets/transferActive.svg");
  }

  nav button.contacts {
    background-image: url("/src/assets/contactsActive.svg");
  }

  nav button.collectibles {
    background-image: url("/src/assets/collectiblesActive.svg");
  }

  * {
    display: grid;
    color: black;
    background-color: white;
    box-sizing: border-box;
  }
</style>
