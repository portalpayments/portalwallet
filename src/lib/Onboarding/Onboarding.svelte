<script lang="ts">
  import Logo from "../../assets/portal-logo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import TextArea from "../Shared/TextArea.svelte";
  import Password from "../Shared/Password.svelte";
  import ProgressBar from "../Shared/ProgressBar.svelte";
  import { Circle } from "svelte-loading-spinners";
  import { log } from "../../backend/functions";
  import {
    personalPhraseToEntopy,
    entropyToMnemonic,
    mnemonicToKeypairs,
    checkIfSecretKeyIsValid,
    checkIfMnemonicPhraseIsValid,
  } from "../../backend/brainwallet";
  import base58 from "bs58";
  import { saveSettings, checkIfOnboarded } from "../settings";

  import Heading from "../Shared/Heading.svelte";

  const MINIMUM_PASSWORD_LENGTH = 8;
  const MINIMUM_PERSONAL_PHRASE_LENGTH = 30;

  const steps = ["first", "second", "third", "final"];
  const stepCount = steps.length;
  let currentStep = 0;

  let secretKeyToImport: string | null = null;
  let personalPhraseToUse: string | null = null;
  let passwordToUse: string | null = null;

  let isSuggestedSecretOrMnemonicPhraseValid: Boolean | null = null;
  let isPasswordSecure: Boolean | null = null;
  let isPersonalPhraseSecure: Boolean | null = null;

  let isOnboarded = false;
  let isBuildingWallet = false;

  let walletImportedFrom: "secret key" | "mnemonic phrase" | null = null;

  let restoringOrMakingNewWallet: "restoring" | "makingNewWallet" = "restoring";

  const checkSecretKeyOrMnemonicPhrase = (event) => {
    // null while we check...
    isSuggestedSecretOrMnemonicPhraseValid = null;
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
      }
    }
  };

  const checkPersonalPhrase = (event) => {
    // null while we check...
    isPersonalPhraseSecure = null;
    const suggestedPersonalPhrase = event.target.value;

    isPersonalPhraseSecure =
      suggestedPersonalPhrase.length > MINIMUM_PERSONAL_PHRASE_LENGTH;
    log(`Finished checking, isPersonalPhraseSecure:`, isPersonalPhraseSecure);
    if (isPersonalPhraseSecure) {
      personalPhraseToUse = suggestedPersonalPhrase;
    }
  };

  const checkPassword = (event) => {
    // null while we check...
    log(`Checking password...`);
    isPasswordSecure = null;
    const suggestedPassword = event.target.value;

    isPasswordSecure = suggestedPassword.length > MINIMUM_PASSWORD_LENGTH;
    log(`Finished checking, isPasswordSecure:`, isPasswordSecure);
    if (isPasswordSecure) {
      personalPhraseToUse = suggestedPassword;
    }
  };

  const move = (isForward: boolean) => {
    log(`Moving ${isForward ? "forwward" : "back"}`);
    if (isForward) {
      currentStep = currentStep + 1;
      return;
    }
    currentStep = currentStep - 1;
  };
</script>

<!-- A peep hole that only shows one step at a time -->
<div class="letterbox">
  <!-- All the steps, beside each other in a columnn -->
  <div
    class="steps"
    style="width:{stepCount * 300}px; transform: translateX(-{currentStep *
      300}px);"
  >
    {#each steps as stepName, stepNumber}
      <div class="step {stepName}">
        {#if stepName === "first"}
          <div class="content">
            <img class="logo" src={Logo} alt="Portal logo" />
            <p>Send money directly to anyone, instantly.</p>
          </div>
          <div class="buttons">
            <button
              type="button"
              on:click={() => {
                restoringOrMakingNewWallet = "makingNewWallet";
                move(true);
              }}
              class="next small-caps ">Make a new wallet</button
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
              <p>Paste your secret key or mnemonic phrase below.</p>
              <TextArea
                placeholder="Secret key"
                onInputDelay={checkSecretKeyOrMnemonicPhrase}
              />

              {#if isSuggestedSecretOrMnemonicPhraseValid !== null}
                {#if isSuggestedSecretOrMnemonicPhraseValid === true}
                  <p class="subtle">✅ {walletImportedFrom} is valid!</p>
                {/if}
                {#if isSuggestedSecretOrMnemonicPhraseValid === false}
                  <p class="subtle">
                    🤔 This is not a valid secret key or mnemonic phrase!
                  </p>
                {/if}
              {/if}
            </div>

            <button
              type="button"
              on:click={() => {
                if (isSuggestedSecretOrMnemonicPhraseValid) {
                  move(true);
                }
              }}
              class="next small-caps  {isSuggestedSecretOrMnemonicPhraseValid
                ? ''
                : 'disabled'}">Next</button
            >
          {:else}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              <Heading>Set a password</Heading>

              <Password
                bind:value={passwordToUse}
                onInputDelay={checkPassword}
              />

              {#if isPasswordSecure !== null}
                {#if isPasswordSecure === true}
                  <p class="subtle">✅ That's a good password.</p>
                {/if}
                {#if isPasswordSecure === false}
                  <p class="subtle">🤔 That's too simple.</p>
                {/if}
              {/if}
            </div>
            <button
              type="button"
              on:click={async () => {
                move(true);
              }}
              class="next small-caps  {isPasswordSecure ? '' : 'disabled'}"
              >Next</button
            >
          {/if}
        {/if}

        {#if stepName === "third"}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              <Heading>Set a password</Heading>

              <Password
                bind:value={passwordToUse}
                onInputDelay={checkPassword}
              />

              {#if isPasswordSecure !== null}
                {#if isPasswordSecure === true}
                  <p class="subtle">✅ That's a good password.</p>
                {/if}
                {#if isPasswordSecure === false}
                  <p class="subtle">🤔 That's too simple.</p>
                {/if}
              {/if}
            </div>

            <button
              type="button"
              on:click={async () => {
                const secretKey = base58.decode(secretKeyToImport);
                await saveSettings(
                  {
                    version: 1,
                    secretKey,
                    personalPhrase: null,
                    // it's not possible to recover a mnemonic from a secret key
                    // (since the mnemonic was used to create the entropy used for the secret)
                    mnemonic: null,
                  },
                  passwordToUse
                );
                isOnboarded = await checkIfOnboarded();
                move(true);
              }}
              class="next small-caps  {passwordToUse?.length ? '' : 'disabled'}"
              >Open wallet</button
            >
          {:else}
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="content">
              <Heading>Set Recovery Phrase</Heading>
              <p>
                If you lose your devices, you can access your wallet using this
                phrase.
              </p>
              <TextArea
                placeholder="When I was six my brother Finian got a train set for Christmas."
                onInputDelay={checkPersonalPhrase}
              />

              {#if isPersonalPhraseSecure !== null}
                {#if isPersonalPhraseSecure === true}
                  <p class="subtle">
                    ✅ Excellent. We'll test you occasionally to help you
                    remember the recovery phrase.
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
              on:click={async () => {
                if (isPersonalPhraseSecure) {
                  log(`Making wallet (this will take a moment)....`);
                  isBuildingWallet = true;
                  const entropy = await personalPhraseToEntopy(
                    personalPhraseToUse,
                    passwordToUse
                  );
                  const mnemonic = entropyToMnemonic(entropy);
                  const keypairs = await mnemonicToKeypairs(
                    mnemonic,
                    passwordToUse
                  );

                  const firstWallet = keypairs[0];

                  const secretKey = firstWallet.secretKey;
                  await saveSettings(
                    {
                      version: 1,
                      secretKey,
                      personalPhrase: personalPhraseToUse,
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
                }
              }}
              class="next small-caps  {(!isPersonalPhraseSecure ||
                isBuildingWallet) &&
                'disabled'} {isBuildingWallet && 'building-wallet'}"
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
          <button
            type="button"
            on:click={() => window.location.reload()}
            class="next small-caps ">Log in and go!</button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
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
    color: var(--actually-dark-grey);
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
    color: white;
    font-weight: 600;
    padding: 6px 24px;
    height: 42px;
    border-radius: 24px;
    font-size: 14px;
    background: var(--blue-green-gradient);
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
