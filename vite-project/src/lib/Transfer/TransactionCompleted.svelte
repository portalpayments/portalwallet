<script type="ts">
  import SuccessfulAction from "../../assets/SuccessfulAction.svg";
  import { truncateWallet } from "../utils";
  import USDCSVG from "../../assets/usdc.svg";
  import Checkmark from "../../assets/Checkmark.svg";
  import UnverifiedTag from "../Shared/Label.svelte";
  export let verifiedAddress: boolean;
  export let destinationWalletAddress: string | null;
  export let name: string | null;
  export let transferAmount: number | null;
</script>

<div class="transaction-details">
  <div style="color: #9d9d9d; font-size: 1rem;">Transaction Complete!</div>
  <img src={SuccessfulAction} alt="money sent successfully" />
  <div class="recipient-and-amount">
    <div class="amount">
      <div>Amount:</div>

      <img src={USDCSVG} alt="usdc symbol" />

      <div style="font-weight: 600;">{transferAmount}</div>
    </div>
    <div class="recipient">
      Recipient:
      {#if verifiedAddress}
        <div>
          <div class="recipient-name">
            {name}<img src={Checkmark} alt="verified recipient" />
          </div>
          <div
            style="text-align: left; font-weight: 600; color: #9d9d9d; font-size: 0.9rem;"
          >
            {truncateWallet(destinationWalletAddress)}
          </div>
        </div>
      {:else}
        <div>
          <div class="recipient-name">
            <UnverifiedTag color="grey" size="medium">UNVERIFIED</UnverifiedTag>
          </div>
          <div
            style="text-align: left; font-weight: 600; color: #9d9d9d; font-size: 0.9rem;"
          >
            {truncateWallet(destinationWalletAddress)}
          </div>
        </div>{/if}
    </div>
  </div>
</div>

<style>
  img {
    width: 60px;
    justify-self: center;
    align-self: center;
  }

  .transaction-details {
    position: relative;
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 20px 60px 1fr;
    justify-content: center;
    align-items: start;
    gap: 10px;
    color: #4d4d4d;
    font-size: 1.1rem;
  }
  .recipient-and-amount {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 24px 24px;
    gap: 15px;
    justify-content: center;
    align-items: center;
  }
  .recipient {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 80px 1fr;
    gap: 3px;
  }
  .amount {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 80px 24px 20px;
    gap: 3px;
    align-items: baseline;
  }
  .amount img {
    width: 22px;
    transform: translateY(-1px);
  }
  .recipient-name img {
    width: 15px;
  }
  .recipient-name {
    font-weight: 600;
    display: grid;
    grid-auto-flow: column;
    gap: 5px;
  }
</style>
