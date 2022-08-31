<script lang="ts">
  //We get the wallet address of the contact from page URL
  //TODO We can use the address to fetch data from localstorage
  let address: string | null = null;
  address = window.location.href.split("/").pop();
  import SendToContactsHeading from "./SendToContactsHeading.svelte";
  import john from "../../../assets/ProfilePics/john.png";
  import anonymous from '../../../assets/ProfilePics/anonymous.svg'
  import TransactionHistory from "./TransactionHistory.svelte";


  //Toggle verifiedContact to test mocked data
  let verifiedContact = true;

  let contact;
  
  if(verifiedContact){
  contact = {
    address: address,
    image: john,
    name: "John O'Hara",
    isAnonymous: false,
    isNew: false,
    isPending: false,
    };}else{
contact = {
    address: address,
    image: anonymous,
    name: "Eric Roberts",
    isAnonymous: true,
    isNew: false,
    isPending: false,
    };
    }


  let transactions = [];

  //Comment out the next lines when probbing sending money to unverified
  //account for the first time
  transactions = [
    { date: "29/08/2022 10:52:21", amount: 47, received: false },
    { date: "29/08/2022 11:52:21", amount: 23, received: false },
    { date: "30/08/2022 08:52:21", amount: 400, received: true },
  ];
  
  
</script>

<div class="contactPage">
  <SendToContactsHeading {contact} />
  <TransactionHistory
    bind:transactions
    contactWalletAddress={contact.address}
    isAnonymous={contact.isAnonymous}
    bind:isPending={contact.isPending}
  />
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
