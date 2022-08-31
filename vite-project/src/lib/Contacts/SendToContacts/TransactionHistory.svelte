<script lang="ts">
  import { amount } from "@metaplex-foundation/js";
  import USDC from "../../../assets/usdc.svg";

  interface Transaction {
    date: string;
    amount: number;
    received: boolean;
  }

  export let transactions: Array<Transaction>;

  let sendAmount: number | null = null;
</script>

<div class="transaction-history">
  {#each transactions as transaction}
    <div class={transaction.received ? "amount-received" : "amount-sent"}>
      <img src={USDC} alt="USDC logo" />
      <div>{transaction.amount}</div>
    </div>
  {/each}
</div>
<div class="send-money">
  <input type="text" bind:value={sendAmount} />

  <button type="submit" class="loginButton">send</button>
</div>

<style>
  .transaction-history {
    height: 100%;
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 95%;
    gap: 0px;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 1.7rem;
    font-weight: 600;
    overflow-y: scroll;
  }
  img {
    width: 28px;
  }
  .amount-received {
    position: relative;
    max-width: 40px;
    background-color: #d9d9d9;
    justify-self: start;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 1em 1.5em;
    border-radius: 0.75rem;
  }

  .amount-received::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 0.6em;
    border: 0.8rem solid transparent;
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
    padding: 1em 1.5em;
    border-radius: 0.75rem;
  }

  .amount-sent::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 3em;
    border: 0.8rem solid transparent;
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
    width: 60%;
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
    width: 30%;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: #2775c9;
  }

  .disabled {
    background-color: #63a6ee;
  }
</style>
