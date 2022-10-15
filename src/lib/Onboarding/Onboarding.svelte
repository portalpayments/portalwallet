<script lang="ts">
  import Logo from "../../assets/PortalLogo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import TextArea from "../Shared/TextArea.svelte";
  import Password from "../Shared/Password.svelte";
  import { log } from "../../backend/functions";
  import {
    checkIfSecretKeyIsValid,
    saveSettingsForOnboarding,
    checkIfOnboarded,
  } from "../settings";
  import Heading from "../Shared/Heading.svelte";

  enum Steps {
    Welcome, // Pick I have a wallet / make a wallet
    SecretKeyOrMnemonicOrPhrase, // Make a wallet - select a personal phrase
    Password,
    Done,
  }

  const MINIMUM_LENGTH = 30;

  // Enums lengths is always doubled. Just how TS works.
  const stepCount = Object.keys(Steps).length / 2;

  let currentStep = Steps.Welcome;

  let secretKeyToImport: string | null = null;
  let personalPhraseToUse: string | null = null;
  let isSuggestedSecretValid: Boolean | null = null;

  let passwordToSet: string | null = null;

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
    {#each { length: stepCount } as _, index}
      <div class="step {Steps[index].toLowerCase()}">
        {#if index === Steps.Welcome}
          <img class="logo" src={Logo} alt="Portal logo" />
          <h1>
            Welcome to Portal. This process will import your wallet, and verify
            your identity so other people can pay you.
          </h1>
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
              class="next">Make a new wallet</button
            >
          </div>
        {/if}

        {#if index === Steps.SecretKeyOrMnemonicOrPhrase}
          <BackButton clickHandler={() => move(false)} />
          {#if restoringOrMakingNewWallet === "restoring"}
            <Heading>Import your secret key</Heading>
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
              class="next {isSuggestedSecretValid ? '' : 'disabled'}"
              >Next</button
            >
          {:else}
            <Heading>Set a Personal Phrase</Heading>
            <div class="help">
              <p>
                If you lose your devices, you can access your wallet using your <strong
                  >personal phrase</strong
                >.
              </p>
              <p>
                <strong>Pick something only you would know</strong> - a personal
                memory is good.
              </p>
              <p>
                <strong>Don't use published works</strong> like song lyrics, or parts
                of books.
              </p>
            </div>
            <TextArea
              placeholder="When I was six my brother Finian got a train set for Christmas."
              onInputDelay={checkPersonalPhrase}
            />
            {#if isPersonalPhraseSecure !== null}
              {#if isPersonalPhraseSecure === true}
                <p>
                  ✅ That can work as work as a personal phrase. We'll make sure
                  you remember it!
                </p>
              {/if}
              {#if isPersonalPhraseSecure === false}
                <p>🤔 That's too simple.</p>
              {/if}
            {/if}

            <button
              type="button"
              on:click={() => {
                if (isPersonalPhraseSecure) {
                  move(true);
                }
              }}
              class="next {isPersonalPhraseSecure ? '' : 'disabled'}"
              >Next</button
            >
          {/if}
        {/if}

        {#if index === Steps.Password}
          <BackButton clickHandler={() => move(false)} />
          <Heading>Set an unlock phrase</Heading>
          <p>
            Set an unlock phrase. This will be used to unlock your wallet before
            using it.
          </p>

          <Password bind:value={passwordToSet} />

          <button
            type="button"
            on:click={async () => {
              log(`Setting PORTAL_SETTINGS`);
              await saveSettingsForOnboarding(secretKeyToImport, passwordToSet);
              isOnboarded = await checkIfOnboarded();
              move(true);
            }}
            class="next {passwordToSet?.length ? '' : 'disabled'}"
            >Save settings</button
          >
        {/if}
        {#if index === Steps.Done}
          <BackButton clickHandler={() => move(false)} />
          <Heading>You're now ready to use Portal.</Heading>
          <p>Log in and go!</p>
          <button
            type="button"
            on:click={() => window.location.reload()}
            class="next">Finish</button
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

  h1 {
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
  }

  p {
    font-size: 12px;
    line-height: 16px;
    text-align: left;
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
    font-size: 14px;
    height: 36px;
    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
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
