<script lang="ts">
  import { connectionStore } from "../stores";
  import { checkWalletAddressOrName } from "../../backend/check-wallet-address-or-name";
  import type { CipherTextAndInitializationVectorSerialized } from "../../backend/types";
  import { PublicKey } from "@solana/web3.js";
  import type { Connection } from "@solana/web3.js";
  import Logo from "../../assets/portal-logo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import TextArea from "../Shared/TextArea.svelte";
  import Input from "../Shared/Input.svelte";
  import Password from "../Shared/Password.svelte";
  import ProgressBar from "../Shared/ProgressBar.svelte";
  import { Circle } from "svelte-loading-spinners";
  import { log } from "../../backend/functions";
  import { SECONDS } from "../../backend/constants";
  import { secretKeyToHex } from "../../backend/solana-functions";
  import { mnemonicToKeypairs, checkIfSecretKeyIsValid, checkIfMnemonicPhraseIsValid } from "../../backend/recovery";
  import base58 from "bs58";
  import { saveSettings, checkIfOnboarded } from "../settings";
  import { getRecoveryTokenFromWallet, recoverFromToken } from "../../backend/recovery-token";
  import debounce from "lodash.debounce";
  import Heading from "../Shared/Heading.svelte";

  const MINIMUM_PASSWORD_LENGTH = 8;
  const MINIMUM_PERSONAL_PHRASE_LENGTH = 30;

  const WALLET_WIDTH = 300;

  const steps = ["first", "second", "third", "final"];
  const stepCount = steps.length;

  let connection: Connection | null = null;

  let currentStep = 0;

  let secretKeyToImport: string | null = null;
  let mnemonicToImport: string | null = null;
  let walletImportedFrom: "secret key" | "mnemonic phrase" | null = null;

  let personalPhraseToUse: string | null = null;
  let passwordToUse: string | null = null;

  let isSuggestedSecretOrMnemonicPhraseValid: Boolean | null = null;
  let isPasswordSecure: Boolean | null = null;
  let isPersonalPhraseSecure: Boolean | null = null;

  let isOnboarded = false;
  let isBuildingWallet = false;

  let restoringOrMakingNewWallet: "restoring" | "makingNewWallet" = "restoring";

  // True for demo, since nmemonics suck.
  // TODO: We could switch false for now since most people importing wallets won't already have a recovery token
  let isUsingRecoveryToken = true;

  let recoveryTokenWalletAddress: string | null = null;

  let recoveryTokenUserEnteredWallet: string | null = null;
  let isRecoveryTokenNameOrAddressValid: Boolean | null = null;
  let recoveryTokenPayload: CipherTextAndInitializationVectorSerialized | null = null;
  let recoveryTokenPersonalPhrase: string | null = null;
  let recoveryTokenWalletUnlockPassword: string | null = null;

  connectionStore.subscribe((newValue) => {
    connection = newValue;
  });

  const toggleRecoveryMethod = () => {
    isUsingRecoveryToken = !isUsingRecoveryToken;
  };

  const checkSecretKeyOrMnemonicPhrase = (event) => {
    // Reset these while we check...
    isSuggestedSecretOrMnemonicPhraseValid = null;
    secretKeyToImport = null;
    mnemonicToImport = null;

    const suggestedSecretKeyOrMemonicPhrase = event.target.value;

    log(`Checking`, suggestedSecretKeyOrMemonicPhrase);
    // Now set the actual value
    if (checkIfSecretKeyIsValid(suggestedSecretKeyOrMemonicPhrase)) {
      log(`User pasted a valid secret key`);
      isSuggestedSecretOrMnemonicPhraseValid = true;
      walletImportedFrom = "secret key";
      secretKeyToImport = suggestedSecretKeyOrMemonicPhrase;
    } else {
      // It might not be a secret key - let's check if it's a phrase
      if (checkIfMnemonicPhraseIsValid(suggestedSecretKeyOrMemonicPhrase)) {
        log(`User pasted a valid mnemonic phrase`);
        isSuggestedSecretOrMnemonicPhraseValid = true;
        walletImportedFrom = "mnemonic phrase";
        mnemonicToImport = suggestedSecretKeyOrMemonicPhrase;
      }
    }
  };

  const checkNewPersonalPhrase = (event) => {
    // null while we check...
    isPersonalPhraseSecure = null;
    const suggestedPersonalPhrase = event.target.value;

    isPersonalPhraseSecure = suggestedPersonalPhrase.length > MINIMUM_PERSONAL_PHRASE_LENGTH;
    log(`Finished checking, isPersonalPhraseSecure:`, isPersonalPhraseSecure);
    if (isPersonalPhraseSecure) {
      personalPhraseToUse = suggestedPersonalPhrase;
    }
  };

  const checkPassword = (event) => {
    // null while we check...
    isPasswordSecure = null;
    const suggestedPassword = event.target.value;

    isPasswordSecure = suggestedPassword.length > MINIMUM_PASSWORD_LENGTH;
    if (isPasswordSecure) {
      log(`Password has sufficient length`);
      passwordToUse = suggestedPassword;
    }
  };

  const move = (isForward: boolean) => {
    log(`Moving ${isForward ? "forward" : "back"}`);
    if (isForward) {
      currentStep = currentStep + 1;
      return;
    }
    currentStep = currentStep - 1;
  };

  const makeWallet = async () => {
    log(`Making wallet (this will take a moment)....`);
    isBuildingWallet = true;

    let mnemonic: string | null = null;
    let personalPhrase: string | null = null;
    let secretKey: Uint8Array | null = null;

    if (restoringOrMakingNewWallet === "restoring") {
      if (isUsingRecoveryToken) {
        log(`Using recovery token, we have already made the wallet`);
        if (!recoveryTokenPersonalPhrase?.length) {
          return;
        }
        if (!recoveryTokenWalletUnlockPassword?.length) {
          return;
        }
        if (!recoveryTokenPayload) {
          return;
        }
        log(`Trying to recover wallet from token`);
        isBuildingWallet = true;
        const restoredWallet = await recoverFromToken(
          recoveryTokenPersonalPhrase,
          recoveryTokenWalletUnlockPassword,
          recoveryTokenPayload
        );

        if (!restoredWallet) {
          log(`Failed to recover wallet from token`);

          setTimeout(() => {
            isBuildingWallet = false;
          }, 0);
          return;
        }

        secretKey = restoredWallet.secretKey;
        personalPhrase = recoveryTokenPersonalPhrase;
        passwordToUse = recoveryTokenWalletUnlockPassword;
        // TODO: we should probably encrypt the mnemonic instead of the secret key
        mnemonic = null;
      } else {
        if (walletImportedFrom === "secret key") {
          secretKey = base58.decode(secretKeyToImport);
          // it's not possible to recover a mnemonic from a secret key
          // (since the mnemonic was used to create the entropy used for the secret)
          mnemonic = null;
        }
        if (walletImportedFrom === "mnemonic phrase") {
          mnemonic = mnemonicToImport;
          personalPhrase = null;
          const keypairs = await mnemonicToKeypairs(mnemonic, null);
          const firstWallet = keypairs[0];
          secretKey = firstWallet.secretKey;
        }
      }
    }
    if (restoringOrMakingNewWallet === "makingNewWallet") {
      if (!isPersonalPhraseSecure) {
        return;
      }
      throw new Error(`Not implemented`);
    }

    await saveSettings(
      {
        version: 1,
        secretKey,
        personalPhrase,
        mnemonic,
      },
      passwordToUse
    );
    isOnboarded = await checkIfOnboarded();
    move(true);

    // Wait till animation finished so button doesn't flash colorfully for a moment
    setTimeout(() => {
      isBuildingWallet = false;
    }, 0);
  };
</script>

<!-- A peep hole that only shows one step at a time -->
<div class="letterbox">
  <!-- All the steps, beside each other in a columnn -->
  <div
    class="steps"
    style="width:{stepCount * WALLET_WIDTH}px; transform: translateX(-{currentStep * WALLET_WIDTH}px);"
  >
    {#each steps as stepName, stepNumber}
      <div class="step {stepName}">
        {#if stepName === "first"}
          <div class="content">
            <img class="logo" src={Logo} alt="Portal logo" />
            <p>Instant global payments<br /> for less than a penny.</p>
          </div>
          <div class="buttons">
            <button
              type="button"
              on:click={() => {
                restoringOrMakingNewWallet = "makingNewWallet";
                move(true);
              }}
              class="next">Make a new wallet</button
            >

            <button
              type="button"
              on:click={() => {
                restoringOrMakingNewWallet = "restoring";
                move(true);
              }}
              class="subtle">I already have a wallet</button
            >
          </div>
        {/if}

        {#if stepName === "second"}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />

            <div class="content">
              <Heading size="large">Import wallet</Heading>
              {#if isUsingRecoveryToken}
                <p>Use a recovery token</p>
                <Input
                  value={recoveryTokenUserEnteredWallet}
                  shape="round"
                  isFocused={false}
                  label="Wallet name or address"
                  onTypingPause={async (event) => {
                    log(`Check wallet address:`, event.target);

                    // TODO: not sure why this is necessary
                    // @ts-ignore
                    recoveryTokenUserEnteredWallet = event.target?.value;
                    if (!connection) {
                      throw new Error(`No connection`);
                    }

                    const walletNameCheckResult = await checkWalletAddressOrName(
                      connection,
                      recoveryTokenUserEnteredWallet
                    );
                    if (!walletNameCheckResult) {
                      log(`Wallet name check failed`);
                      isRecoveryTokenNameOrAddressValid = false;
                      return;
                    }
                    recoveryTokenWalletAddress = walletNameCheckResult.destinationWalletAddress;
                    // Check for presence of recovery token
                    recoveryTokenPayload = await getRecoveryTokenFromWallet(
                      connection,
                      new PublicKey(recoveryTokenWalletAddress)
                    );
                  }}
                />

                <button class="toggle-recovery-method" on:click={toggleRecoveryMethod}
                  >Use a secret key or mnemonic instead</button
                >
              {:else}
                <p>Paste your secret key or mnemonic phrase below.</p>
                <TextArea placeholder="Secret key or mnemonic phrase" onInputDelay={checkSecretKeyOrMnemonicPhrase} />
                <button class="toggle-recovery-method" on:click={toggleRecoveryMethod}
                  >Use a recovery token instead</button
                >

                {#if isSuggestedSecretOrMnemonicPhraseValid !== null}
                  {#if isSuggestedSecretOrMnemonicPhraseValid === true}
                    <p class="subtle">✅ {walletImportedFrom} is valid!</p>
                  {:else}
                    <p class="subtle">🤔 This is not a valid secret key or mnemonic phrase!</p>
                  {/if}
                {/if}
              {/if}
            </div>

            <button
              type="button"
              on:click={() => {
                if (isSuggestedSecretOrMnemonicPhraseValid || recoveryTokenPayload) {
                  move(true);
                }
              }}
              class="next {isSuggestedSecretOrMnemonicPhraseValid || recoveryTokenPayload ? '' : 'disabled'}"
              >Next</button
            >
          {:else}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              <Heading>Set a password</Heading>

              <Password bind:value={passwordToUse} onInputDelay={checkPassword} />

              {#if isPasswordSecure !== null}
                {#if isPasswordSecure === true}
                  <p class="subtle">✅ That's a good password.</p>
                {:else}
                  <p class="subtle">🤔 That's too simple.</p>
                {/if}
              {/if}
            </div>
            <button
              type="button"
              on:click={async () => {
                move(true);
              }}
              class="next {isPasswordSecure ? '' : 'disabled'}">Next</button
            >
          {/if}
        {/if}

        {#if stepName === "third"}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              {#if isUsingRecoveryToken}
                <Heading>Enter your personal phrase</Heading>
                <TextArea
                  placeholder="Personal phrase"
                  onInputDelay={(event) => {
                    // TODO: not sure why this is necessary
                    // @ts-ignore
                    recoveryTokenPersonalPhrase = event.target.value;
                  }}
                />
                <Password bind:value={recoveryTokenWalletUnlockPassword} placeHolder="Unlock password" />
              {:else}
                <Heading>Set a password</Heading>
                <Password bind:value={passwordToUse} onInputDelay={checkPassword} />

                {#if isPasswordSecure !== null}
                  {#if isPasswordSecure === true}
                    <p class="subtle">✅ That's a good password.</p>
                  {/if}
                  {#if isPasswordSecure === false}
                    <p class="subtle">🤔 That's too simple.</p>
                  {/if}
                {/if}
              {/if}
            </div>

            <button
              type="button"
              on:click={() => makeWallet()}
              class="next {passwordToUse?.length || recoveryTokenWalletUnlockPassword?.length ? '' : 'disabled'}"
              >Open wallet</button
            >
          {:else}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              <Heading>Set Recovery Phrase</Heading>
              <p>If you lose your devices, you can access your wallet using this phrase.</p>
              <TextArea
                placeholder="When I was six my brother Finian got a train set for Christmas."
                onInputDelay={checkNewPersonalPhrase}
              />

              {#if isPersonalPhraseSecure !== null}
                {#if isPersonalPhraseSecure === true}
                  <p class="subtle">
                    ✅ Excellent. We'll test you occasionally to help you remember the recovery phrase.
                  </p>
                {/if}
                {#if isPersonalPhraseSecure === false}
                  <p class="subtle">🤔 That's too simple.</p>
                {/if}
              {/if}
            </div>

            <button
              type="button"
              disabled={!isPersonalPhraseSecure || isBuildingWallet}
              on:click={() => makeWallet()}
              class="next {(!isPersonalPhraseSecure || isBuildingWallet) && 'disabled'} {isBuildingWallet &&
                'building-wallet'}"
            >
              {#if isBuildingWallet}
                Making wallet <Circle color="var(--white)" size={12} />
              {:else}
                Make wallet
              {/if}
            </button>
          {/if}
        {/if}
        <!-- Remove entire step.... -->
        {#if stepName === "final"}
          <BackButton clickHandler={() => move(false)} />
          <Heading>You're now ready to use Portal.</Heading>
          <button type="button" on:click={() => window.location.reload()} class="next">Log in and go!</button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .letterbox {
    overflow: hidden;
    width: var(--wallet-width);
    height: var(--wallet-height);
  }

  .steps {
    grid-auto-flow: column;
    transition: all 200ms ease-in-out;
  }

  .step {
    width: var(--wallet-width);
    height: var(--wallet-height);
    padding: 24px;
    justify-items: center;
    align-items: center;
    /* Required so backbutton will be positioned relative to this step */
    position: relative;
  }

  .logo {
    width: 80%;
  }

  .content {
    gap: 8px;
  }

  button.toggle-recovery-method {
    background: none;
    font-size: 12px;
    color: var(--mid-grey);
    text-align: left;
    padding: 6px 0;
    margin: none;
    border: none;
  }

  p {
    font-size: 18px;
    line-height: 22px;
    text-align: left;
  }

  p.subtle {
    font-size: 14px;
    line-height: 18px;
    margin: 0;
  }

  .step.first .content {
    /* 5c */
    /* TODO: eyeball, probably better way of doing this */
    transform: translateX(24px);
    font-weight: 600;
    color: var(--dark-grey);
  }

  .step.first .buttons {
    justify-content: center;
  }

  /* You can't have step.1 - CSS won't allow it */
  .step.third .step.final {
    grid-template-rows: 1fr 100px;
  }

  .buttons {
    width: 100%;
  }

  /* TODO: make some kind of utility class to use for primary buttons and link buttons */
  button.next {
    width: 100%;
    align-content: center;
    color: white;
    font-weight: 600;
    padding: 6px 24px;
    height: 42px;
    border-radius: 24px;
    font-size: 14px;
    background: var(--blue-green-gradient);
    @include small-caps;
    @include shadow;
  }

  button.subtle {
    padding: 12px;
    background-color: transparent;
    border: none;
    color: var(--black);
    font-size: 16px;
  }

  button.next.disabled {
    opacity: 0.5;
  }

  button.building-wallet {
    grid-auto-flow: column;
    display: grid;
    grid-template-columns: 1fr 14px;
    align-content: center;
    gap: 6px;
    cursor: wait;
  }
</style>
