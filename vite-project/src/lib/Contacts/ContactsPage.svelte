<script lang="ts">
  import Contacts from "./Contacts.svelte";
  import ContactsHeading from "./ContactsHeading.svelte";
  import avatarImageUrl from "../../assets/avatar.png";

  const contacts = [
    {
      image: avatarImageUrl,
      name: "John O'Hara",
    },
    {
      image: avatarImageUrl,
      name: "ProteinLand",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
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
