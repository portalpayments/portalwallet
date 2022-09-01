<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import {
    VAHEHS_WALLET,
    JOE_MCCANNS_WALLET,
    SHAQS_WALLET,
  } from "../../../../src/constants";
  import ContactsHeading from "./ContactsHeading.svelte";

  import ewan from "../../assets/ProfilePics/ewan.png";
  import proteinLand from "../../assets/ProfilePics/proteinland.svg";
  import john from "../../assets/ProfilePics/john.png";
  import jane from "../../assets/ProfilePics/jane.png";

  const contacts = [
    // A new and verified person
    {
      address: VAHEHS_WALLET,
      image: ewan,
      name: "Vaheh Hatami",
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
    // An anonymous wallet (Joe McCann) pending verification
    {
      address: JOE_MCCANNS_WALLET,
      image: null,
      name: null,
      isAnonymous: true,
      isNew: false,
      isPending: true,
    },
    {
      address: SHAQS_WALLET,
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
