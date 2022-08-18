<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";

  import ewan from "../../assets/ewan.png";
  import proteinLand from "../../assets/proteinland.svg";
  import john from "../../assets/john.png";
  import jane from "../../assets/jane.png";
  import anonymousImageUrl from "../../assets/anonymous.svg";

  const contacts = [
    // A new and verified person
    {
      image: ewan,
      name: "Ewan O'Mally",
      isVerified: true,
      isNew: true,
      isPending: false,
    },
    // A verified person
    {
      image: john,
      name: "John O'Hara",
      isVerified: true,
      isNew: false,
      isPending: false,
    },
    // A verified business we've done transactions with before
    {
      image: proteinLand,
      name: "ProteinLand",
      isVerified: true,
      isNew: false,
      isPending: false,
    },
    // An anonymous wallet pending verification
    {
      image: anonymousImageUrl,
      name: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
      isVerified: false,
      isNew: false,
      isPending: true,
    },
    {
      image: jane,
      name: "Jane Taylor",
      isVerified: false,
      isNew: false,
      isPending: false,
    },
  ];
</script>

<div class="ContactsPage">
  <ContactsHeading />
  <Contacts {contacts} />
</div>

<style>
  .ContactsPage {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
  }
</style>
