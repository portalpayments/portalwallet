<script lang="ts">
  import { onChangeActiveAccount } from "../../lib/stores";
  import TransactionComponent from "./Transaction.svelte";
  import { getTransactionsByDays } from "../../backend/transactions";
  import { checkIfScrolledAllTheWay } from "../../lib/dom-utils";
  import LoadingImage from "../../assets/transactions-loading.svg";
  import type {
    TransactionsByDay,
    AccountSummary,
    Contact,
  } from "../../backend/types";
  import { Link } from "svelte-navigator";
  import {
    log,
    stringify,
    isoDateToFriendlyName,
  } from "../../backend/functions";
  import {
    tokenAccountsStore,
    contactsStore,
    getActiveAccount,
  } from "../stores";
  import SkeletonTransactions from "../Shared/Skeletons/SkeletonTransactions.svelte";

  const EMPTY = "";

  export let filterValue: string = EMPTY;

  // TODO: maybe move transactionsByDays to a store?
  let transactionsByDays: Array<TransactionsByDay> = [];
  let contacts: Array<Contact> = [];
  let decimals: number;
  let isLoadingTransactionSummaries: boolean = true;

  const updateTransactionsByDays = (activeAccount: AccountSummary) => {
    log(`In updateTransactionsByDays, filterValue is '${filterValue}'`);
    if (!activeAccount) {
      // TODO: maybe change this so transactionsStore always sets the active account?
      // when it first loads?
      log(`No active account yet, no transactions store to load`);
      return;
    }
    isLoadingTransactionSummaries = true;

    transactionsByDays = getTransactionsByDays(
      activeAccount.transactionSummaries,
      contacts,
      filterValue,
      activeAccount.decimals
    );

    isLoadingTransactionSummaries = false;
  };

  contactsStore.subscribe(async (newValue) => {
    if (newValue) {
      contacts = newValue;
    }
  });

  tokenAccountsStore.subscribe((newValue: Array<AccountSummary>) => {
    if (newValue?.length) {
      log(
        `tokenAccountsStore has changed (eg a token account had been added or removed)`
      );
      const activeAccount = getActiveAccount();
      updateTransactionsByDays(activeAccount);
    }
  });

  onChangeActiveAccount((activeAccount) => {
    log(`Active account has changed`);
    decimals = activeAccount.decimals;
    updateTransactionsByDays(activeAccount);
  });

  const loadMoreTransactions = (event) => {
    const element = event.currentTarget;
    const hasScrolledAllTheWay = checkIfScrolledAllTheWay(element);

    if (hasScrolledAllTheWay) {
      // The element has been scrolled all the way down
      console.log("Element scrolled all the way down");
    }
  };

  const onFilterValueChanged = () => {
    log(`Filter value has changed! New value is: "${filterValue}"`);
    const activeAccount = getActiveAccount();
    updateTransactionsByDays(activeAccount);
  };

  $: {
    if (filterValue !== EMPTY) {
      onFilterValueChanged();
    }
  }
</script>

{#if !isLoadingTransactionSummaries}
  {#if transactionsByDays.length}
    <div class="days" on:scroll={loadMoreTransactions}>
      {#each transactionsByDays as transactionsByDay}
        <div class="day">
          <div class="day-summary">
            <div class="day-name">
              {isoDateToFriendlyName(transactionsByDay.isoDate)}
            </div>

            <div class="day-total">
              {transactionsByDay.totalSpendingDisplay}
            </div>
          </div>

          <div class="transactions">
            {#each transactionsByDay.transactions as transaction (transaction.id)}
              {#if transaction.counterParty}
                <Link to={`/contacts/${transaction.counterParty}`}>
                  <TransactionComponent {transaction} {decimals} />
                </Link>
              {:else}
                <TransactionComponent {transaction} {decimals} />
              {/if}
            {/each}
          </div>
        </div>
      {/each}
      {#if filterValue === EMPTY}
        <div class="loading-more">
          <img src={LoadingImage} alt="Loading more transactions" />
        </div>
      {/if}
    </div>
  {:else if filterValue === EMPTY}
    <p>No transactions.</p>
  {:else}
    <p>No matching transactions.</p>
  {/if}
{:else}
  <div class="days mock-days">
    <SkeletonTransactions />
  </div>
{/if}

<style lang="scss">
  @import "../../mixins.scss";
  .transactions {
    display: grid;
    grid-auto-flow: row;
    gap: 6px;
  }

  .days {
    align-content: start;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .mock-days {
    min-height: 400px;
  }

  .day {
    padding: 12px;
    gap: 6px;
    /* 24px for the heading line, auto for rest */
    grid-template-rows: 24px auto;
    align-content: start;
  }

  .day-summary {
    grid-auto-flow: column;
    grid-template-columns: 3fr 1fr;
  }

  .day-name {
    text-align: left;
    /* 16px can't quite fit 'Wednesday October 12' */
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }

  .day-total {
    text-align: right;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }

  .loading-more {
    height: 128px;
    justify-items: center;
    align-items: center;
    padding-bottom: 64px;
  }

  .loading-more img {
    width: 32px;
    aspect-ratio: 1 / 1;
  }
</style>
