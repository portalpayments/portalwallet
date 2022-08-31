<script lang="ts">
  let address: string | null = null;
  address = window.location.href.split("/").pop();
  import SendToContactsHeading from "./SendToContactsHeading.svelte";
  import john from "../../../assets/ProfilePics/john.png";
  import TransactionHistory from "./TransactionHistory.svelte";

  let contact = {
    address: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    image: john,
    name: "John O'Hara",
    isAnonymous: false,
    isNew: false,
    isPending: false,
  };

  let transactions = [
    { date: "29/08/2022 10:52:21", amount: 47, received: false },
    { date: "29/08/2022 11:52:21", amount: 23, received: false },
    { date: "30/08/2022 08:52:21", amount: 400, received: true },
  ];
</script>

<div class="contactPage">
  <SendToContactsHeading {contact} />
  <TransactionHistory {transactions} />
</div>

<style>
  .contactPage {
    overflow-x: hidden;
    height: var(--wallet-height);
    width: var(--wallet-width);
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 90px 1fr;
  }
</style>
