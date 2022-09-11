<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";
</script>

<div class="feature">
  <ContactsHeading />
  <Contacts />
</div>

<style>
  .feature {
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #d8f1ff 0, #fff 80%, #fff 100%);
  }
</style>
