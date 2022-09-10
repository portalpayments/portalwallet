<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";
</script>

<div class="feature">
  <div class="ContactsPage">
    <ContactsHeading />
    <Contacts />
  </div>
</div>


<style>
  .ContactsPage {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
  }
</style>
