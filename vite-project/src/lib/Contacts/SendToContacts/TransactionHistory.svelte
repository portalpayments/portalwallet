<script lang="ts">
  import Modal from "../../UI/Modal.svelte";
  import RequestVerification from "../../Transfer/RequestVerification.svelte";
  import USDC from "../../../assets/usdc.svg";

  interface Transaction {
    date: string;
    amount: number;
    received: boolean;
  }
  export let contactWalletAddress: string | null;
  export let isAnonymous: boolean | null;
  export let transactions: Array<Transaction>;
  export let isPending: boolean | null = null;
  let requestingVerification = false;
  let sendAmount: number | null = null;

  // TODO replace the following code with a backend function sending money to recipient
  // And reload the transaction history to show the latest transaction
  const sendMoney = () => {
    if (contactWalletAddress) {
      console.log(
        "Sending amount " + sendAmount + " To " + contactWalletAddress
      );
    }

    transactions.push({
      date: "31/08/2022 08:52:21",
      amount: sendAmount,
      received: false,
    });

    sendAmount = null;
    transactions = transactions;
  };

  const requestVerificationModal = () => {
    requestingVerification = true;
  };
</script>

{#if !isAnonymous}
  <div class="history-container">
    <div class="transaction-history">
      {#each transactions as transaction}
        <div class={transaction.received ? "amount-received" : "amount-sent"}>
          <img
            src={USDC}
            class={!transaction.received ? "white-usdc" : ""}
            alt="USDC logo"
          />
          <div>{transaction.amount}</div>
        </div>
      {/each}
    </div>
  </div>
  <div class="send-money">
    <input type="text" bind:value={sendAmount} />

    <button
      type="submit"
      disabled={sendAmount === 0 || sendAmount === null}
      on:click={sendMoney}>send</button
    >
  </div>
{:else}
  {#if transactions.length === 0}
    <div class="history-container">
      <div class="warning">
        This address is unverified. We highly suggest you send money only to
        verified addresses, because the transfer cannot be undone. You can click
        below to request verification. We will notify you once the address is
        verified.
      </div>
    </div>
  {:else}
    <div class="history-container">
      <div class="transaction-history">
        {#each transactions as transaction}
          <div class={transaction.received ? "amount-received" : "amount-sent"}>
            <img
              src={USDC}
              class={!transaction.received ? "white-usdc" : ""}
              alt="USDC logo"
            />
            <div>{transaction.amount}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  <div>
    <button on:click={requestVerificationModal} class="request-verification"
      >Request verification</button
    >
    <div class="send-money">
      <input type="text" bind:value={sendAmount} />
      <button
        type="submit"
        disabled={sendAmount === 0 || sendAmount === null}
        class="send-anyway"
        on:click={sendMoney}>send anyway</button
      >
    </div>
  </div>
{/if}
{#if requestingVerification}
  <Modal buttonType="requestVerification"
    ><div class="request-container">
      <!-- TODO emailAddress is missing -->
      <RequestVerification
        destinationWalletAddress={contactWalletAddress}
        transferAmount={sendAmount}
        bind:isPending
      />
    </div></Modal
  >
{/if}

<style>
  /* TODO cannot scroll */
  .history-container {
    height: 100%;
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .transaction-history {
    display: grid;
    width: 100%;
    grid-auto-flow: row;
    grid-template-columns: 95%;
    grid-auto-rows: 120px;
    gap: 0px;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 40px;
    font-weight: 600;
    position: absolute;
    overflow: hidden;
    bottom: 0px;
  }
  img {
    width: 36px;
  }
  .white-usdc {
    filter: brightness(0) invert(1);
  }
  .amount-received {
    position: relative;
    max-width: 40px;
    background-color: #d9d9d9;
    color: #2775c9;
    justify-self: start;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 0.5em 1.1em;
    border-radius: 27px;
  }

  .amount-received::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 0.6em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: #d9d9d9;
  }
  .amount-sent {
    position: relative;
    justify-self: end;
    max-width: 40px;
    background-color: #419cfd;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 0.5em 1.1em;
    border-radius: 27px;
  }

  .amount-sent::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 2.1em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: #419cfd;
  }
  .send-money {
    margin-bottom: 10px;
    height: 40px;
  }
  input {
    border-radius: 9px;
    padding: 0px 0px 0px 6px;
    border: 1px solid rgba(217, 217, 217, 0.7);
    background-color: rgba(217, 217, 217, 0.1);
    width: 45%;
    height: 38px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  button {
    width: 45%;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: #419cfd;
  }
  .warning {
    font-size: 1rem;
    margin: auto;
    margin-top: 50%;
    width: 95%;
    height: 40%;
    color: #4d4d4d;
  }
  .disabled {
    background-color: #63a6ee;
  }
  .request-verification {
    background-color: #2775c9;
    width: 93%;
    height: 40px;
    margin-bottom: 5px;
  }
  .send-anyway {
    background-color: #9d9d9d;
  }
</style>
