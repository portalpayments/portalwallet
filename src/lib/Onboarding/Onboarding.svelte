<script lang="ts">
  import Logo from "../../assets/PortalLogo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import TextArea from "../Shared/TextArea.svelte";
  import Password from "../Shared/Password.svelte";
  import ProgressBar from "../Shared/ProgressBar.svelte";
  import { log } from "../../backend/functions";
  import {
    personalPhraseToEntopy,
    entropyToMnemonic,
    mnemonicToKeypairs,
  } from "../../backend/brainwallet";
  import base58 from "bs58";
  import {
    checkIfSecretKeyIsValid,
    saveSettings,
    checkIfOnboarded,
  } from "../settings";
  import Heading from "../Shared/Heading.svelte";

  const MINIMUM_LENGTH = 30;

  const steps = ["first", "second", "third", "fourth"];
  const stepCount = steps.length;
  let currentStep = 0;

  let secretKeyToImport: string | null = null;
  let personalPhraseToUse: string | null = null;
  let passwordToUse: string | null = null;

  let isSuggestedSecretValid: Boolean | null = null;
  let isPersonalPhraseSecure: Boolean | null = null;

  let isOnboarded = false;

  let restoringOrMakingNewWallet: "restoring" | "makingNewWallet" = "restoring";

  const checkSecretKey = (event) => {
    // null while we check...
    isSuggestedSecretValid = null;
    const suggestedSecretKey = event.target.value;
    // Now set the actual value
    isSuggestedSecretValid = checkIfSecretKeyIsValid(suggestedSecretKey);
    if (isSuggestedSecretValid) {
      secretKeyToImport = suggestedSecretKey;
    }
  };

  const checkIfPersonalPhraseIsSecure = (personalPhrase) => {
    return personalPhrase.length > MINIMUM_LENGTH;
  };

  const checkPersonalPhrase = (event) => {
    // null while we check...
    isPersonalPhraseSecure = null;
    const suggestedPersonalPhrase = event.target.value;

    isPersonalPhraseSecure = checkIfPersonalPhraseIsSecure(
      suggestedPersonalPhrase
    );
    log(`Finished checking, isPersonalPhraseSecure:`, isPersonalPhraseSecure);
    if (isPersonalPhraseSecure) {
      personalPhraseToUse = suggestedPersonalPhrase;
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
      <div class="step {stepNumber}">
        {#if stepName === "first"}
          <img class="logo" src={Logo} alt="Portal logo" />
          <p>Send money directly to anyone instantly.</p>

          <div class="buttons">
            <button
              type="button"
              on:click={() => {
                restoringOrMakingNewWallet = "restoring";
                move(true);
              }}
              class="subtle">I already have a wallet</button
            >

            <button
              type="button"
              on:click={() => {
                restoringOrMakingNewWallet = "makingNewWallet";
                move(true);
              }}
              class="next small-caps ">Make a new wallet</button
            >
          </div>
        {/if}

        {#if stepName === "second"}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <Heading>Import your secret key</Heading>
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <p>
              Paste your secret key (sometimes called 'private key') into the
              box below.
            </p>
            <TextArea placeholder="Secret key" onKeyUpDelay={checkSecretKey} />
            {#if isSuggestedSecretValid !== null}
              {#if isSuggestedSecretValid === true}
                <p>✅ Secret key is valid!</p>
              {/if}
              {#if isSuggestedSecretValid === false}
                <p>🤔 This is not a valid secret key!</p>
              {/if}
            {/if}

            <button
              type="button"
              on:click={() => {
                if (isSuggestedSecretValid) {
                  move(true);
                }
              }}
              class="next small-caps  {isSuggestedSecretValid
                ? ''
                : 'disabled'}">Next</button
            >
          {:else}
            <Heading>Set a password</Heading>
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <p>This will be used to unlock your wallet before using it.</p>

            <Password bind:value={passwordToUse} />

            <button
              type="button"
              on:click={async () => {
                move(true);
              }}
              class="next small-caps  {passwordToUse?.length ? '' : 'disabled'}"
              >Set password</button
            >
          {/if}
        {/if}

        {#if stepName === "third"}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <Heading>Set an unlock phrase</Heading>
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <p>
              Set an unlock phrase. This will be used to unlock your wallet
              before using it.
            </p>

            <Password bind:value={passwordToUse} />

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
              >Save settings</button
            >
          {:else}
            <Heading>Set a Personal Phrase</Heading>
            <ProgressBar steps={steps.length} currentStep={stepNumber} />
            <div class="help">
              <p>
                If you lose your devices, you can access your wallet using this
                phrase.
              </p>
              <TextArea
                placeholder="When I was six my brother Finian got a train set for Christmas."
                onInputDelay={checkPersonalPhrase}
              />
            </div>

            {#if isPersonalPhraseSecure !== null}
              {#if isPersonalPhraseSecure === true}
                <p>
                  ✅ That works as a personal phrase. We'll test you every so
                  often to help you remember it.
                </p>
              {/if}
              {#if isPersonalPhraseSecure === false}
                <p>🤔 That's too simple.</p>
              {/if}
            {/if}

            <button
              type="button"
              on:click={async () => {
                if (isPersonalPhraseSecure) {
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
                }
              }}
              class="next small-caps  {isPersonalPhraseSecure
                ? ''
                : 'disabled'}">Next</button
            >
          {/if}
        {/if}
        {#if stepName === "final"}
          <BackButton clickHandler={() => move(false)} />
          <Heading>You're now ready to use Portal.</Heading>
          <ProgressBar steps={steps.length} currentStep={stepNumber} />
          <p>Log in and go!</p>
          <button
            type="button"
            on:click={() => window.location.reload()}
            class="next small-caps ">Finish</button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .logo {
    width: 80%;
  }

  p {
    /* Eyeball, it just looks nicer if we don't use full width */
    width: 198px;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
  }

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
    padding: 12px;
    justify-items: center;
    align-items: center;
    /* Required so backbutton will be positioned relative to this step */
    position: relative;
  }

  .buttons {
    width: 100%;
  }

  /* TODO: make some kind of utility class to use for primary buttons and link buttons */
  button.next {
    color: white;
    font-weight: 600;
    padding: 6px 24px;
    height: 36px;
    border-radius: 24px;
    font-size: 12px;
    background: var(--blue-green-gradient);
  }

  button.subtle {
    padding: 12px;
    background-color: transparent;
    border: none;
    color: var(--black);
    font-size: 14px;
  }

  button.next.disabled {
    background: gray;
    color: #b5b5b5;
  }
</style>
