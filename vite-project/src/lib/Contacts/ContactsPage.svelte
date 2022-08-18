<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";

  import ewan from "../../assets/ProfilePics/ewan.png";
  import proteinLand from "../../assets/ProfilePics/proteinland.svg";
  import john from "../../assets/ProfilePics/john.png";
  import jane from "../../assets/ProfilePics/jane.png";

  const contacts = [
    // A new and verified person
    {
      address: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      image: ewan,
      name: "Ewan O'Mally",
      isAnonymous: false,
      isNew: true,
      isPending: false,
    },
    // A verified person
    {
      address: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      image: john,
      name: "John O'Hara",
      isAnonymous: false,
      isNew: false,
      isPending: false,
    },
    // A verified business we've done transactions with before
    {
      address: "cccccccccccccccccccccccccccccccccccccccccccc",
      image: proteinLand,
      name: "ProteinLand",
      isAnonymous: false,
      isNew: false,
      isPending: false,
    },
    // An anonymous wallet pending verification
    {
      address: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
      image: null,
      name: null,
      isAnonymous: true,
      isNew: false,
      isPending: true,
    },
    {
      address: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      image: jane,
      name: "Jane Taylor",
      isAnonymous: false,
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
