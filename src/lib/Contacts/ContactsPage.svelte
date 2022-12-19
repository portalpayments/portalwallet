<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";
</script>

<div class="feature">
  <ContactsHeading />
  <Contacts />
</div>

<style type="text/scss">
  @import "../../mixins.scss";
  .feature {
    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #d8f1ff 0, #fff 80%, #fff 100%);
  }
</style>
