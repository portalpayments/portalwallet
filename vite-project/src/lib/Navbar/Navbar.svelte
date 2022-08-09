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
</script>

<nav>
  <button
    class="transfer"
    type="button"
    title="transfer"
    on:click={() => navigate(0)}
    >{#if currentFeature == 0}<img
        src={transferIconActive}
        alt="transfers page"
      />
    {:else}
      <img src={transferIcon} alt="go to transfers page" />
    {/if}
  </button>
  <button
    class="contacts"
    type="button"
    title="contacts"
    on:click={() => navigate(1)}
    >{#if currentFeature == 1}<img
        src={contactsIconActive}
        alt="contacts page"
      />
    {:else}
      <img src={contactsIcon} alt="go to contacts page" />
    {/if}</button
  >
  <button
    class="collectibles"
    type="button"
    title="collectibles"
    on:click={() => navigate(2)}
    >{#if currentFeature == 2}<img
        src={collectiblesIconActive}
        alt="collctibles page"
      />
    {:else}
      <img src={collectiblesIcon} alt="go to collctibles page" />
    {/if}</button
  >
</nav>

<style>
  nav {
    width: 150px;
    height: 50px;
    margin: auto;
    display: grid;
    grid-auto-flow: column;
    border: 1.5px solid #f3f3f3;
    border-radius: 29px;
    /* gap: 24px; */
    /* Bunch the buttons up together in the center */
    grid-auto-columns: min-content;
    gap: 15px;
    justify-content: center;
    align-items: center;
  }

  nav button {
    background-size: cover;
    width: 32px;
    height: 32px;
  }

  nav img {
    background-size: contain;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
  }

  * {
    display: grid;
    color: black;
    background-color: white;
    box-sizing: border-box;
  }
</style>
