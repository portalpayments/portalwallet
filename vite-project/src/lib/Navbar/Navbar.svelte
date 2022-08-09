<script lang="ts">
  import transferIcon from "../../assets/transfer.svg";
  import transferIconActive from "../../assets/transferActive.svg";
  import contactsIcon from "../../assets/contacts.svg";
  import contactsIconActive from "../../assets/contactsActive.svg";
  import collectiblesIcon from "../../assets/collectibles.svg";
  import collectiblesIconActive from "../../assets/collectiblesActive.svg";
  const log = console.log;
  export let currentFeature: number = 0;
  const navigate = (newFeature) => {
    log(`Changing currentFeature to ${newFeature}`);
    currentFeature = newFeature;
  };
  const pages = [
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
  {#each pages as page, index}
    <button
      class="{page.name} {currentFeature === index ? 'active' : ''}"
      type="button"
      title={page.name}
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
  }

  nav button {
    padding: 0;
    margin: 0;
    width: 32px;
    height: 32px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  nav button.transfer {
    background-image: url("/src/assets/transfer.svg");
  }

  nav button.contacts {
    background-image: url("/src/assets/contacts.svg");
  }

  nav button.collectibles {
    background-image: url("/src/assets/collectibles.svg");
  }

  * {
    display: grid;
    color: black;
    background-color: white;
    box-sizing: border-box;
  }
</style>
