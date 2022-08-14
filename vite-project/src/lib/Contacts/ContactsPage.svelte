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
  <div>
    <ContactsHeading />
  </div>
  <Contacts {contacts} />
</div>

<!-- TODO fix the scroll on overflown contacts. Not working now.  -->
<style>
  .ContactsPage {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: min-content;
    padding: 0 12px;
    height: auto;
    overflow: scroll;
    gap: 40px;
  }
</style>
