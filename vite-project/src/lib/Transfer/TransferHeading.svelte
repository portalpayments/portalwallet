<script lang="ts">
  import { Link } from "svelte-navigator";
  import AnonymousSvg from "../../assets/ProfilePics/anonymous.svg";
  import JohnPng from "../../assets/ProfilePics/john.png";
  import UnverifiedTag from "../Shared/Label.svelte";
  import Checkmark from "../../assets/Checkmark.svg";
  import { LabelColor, warningUnverifiedAccount } from "../constants";

  export let name = "John O'Mally";
  export let isAnonymous = true;
  export let isPending = false;
  export let isNew = false;
  export let addressFetched = false;
</script>

<div class="recipientDetails">
  <div class="back-button">
    <Link to="/">&#8249;</Link>
  </div>
  {#if addressFetched}
    <div class="verification-status">
      <div class="verified-header">
        {#if isAnonymous}
          <img
            src={AnonymousSvg}
            class="profilePic"
            alt="Address is not verified"
          />
          <div>
            <UnverifiedTag color={LabelColor.Grey} size="large"
              >UNVERIFIED</UnverifiedTag
            >
            {#if isPending}
              <UnverifiedTag color={LabelColor.Yellow}>Pending</UnverifiedTag>
            {/if}
          </div>
        {:else}
          <img src={JohnPng} class="profilePic" alt="Address is verified" />

          <div>
            <div>
              {name}<img
                src={Checkmark}
                class="checkmark"
                alt="User is Verified"
              />
            </div>
            {#if isNew}
              <div class="recipient-transaction-history">
                <UnverifiedTag color={LabelColor.Yellow}>New</UnverifiedTag>
              </div>
            {/if}
          </div>
        {/if}
      </div>
      {#if isAnonymous}
        <div class="unverified-message">{warningUnverifiedAccount}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .recipientDetails {
    position: absolute;
    top: 40px;
    display: grid;
    grid-auto-flow: column;
    /* grid-template-rows: 30px 1fr; */
    grid-template-columns: 10px 1fr;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-items: baseline;
  }
  .verification-status {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 60px 1fr;
    padding: 7px 7px;
    gap: 10px;
    width: 70%;
    margin: auto;
    justify-content: stretch;
    align-items: start;
    text-align: left;
  }
  .checkmark {
    height: 18px;
    margin-left: 5px;
    transform: translateY(4px);
  }
  .verified-header {
    font-size: 1.1rem;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 60px 1fr;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 60px;
    color: #4d4d4d;
    font-weight: 600;
  }
  .profilePic {
    margin: auto;
    min-height: 60px;
    max-height: 60px;
  }
  .recipient-transaction-history {
    justify-self: start;
    /* This is weird, when I do align-self start, it acts as align self end */
    align-self: end;
    font-size: 1rem;
  }

  .unverified-message {
    font-size: 0.8rem;
    line-height: 130%;
    color: #4d4d4d;
    font-weight: 500;
  }

  .back-button {
    font-size: 2rem;
    padding: 10px;
    width: 10%;
  }

  /* global is needed for 'a' element under Link */
  .back-button :global(a) {
    text-decoration: none;
    padding: 7px 0px;
    background-color: transparent;
    display: inline-block;
    color: #3a3a3a;
    font-size: 2rem;
    font-weight: 400;
  }
</style>
