<script lang="ts">
  import Logo from "../../assets/PortalLogo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import Input from "../Shared/Input.svelte";
  import TextArea from "../Shared/TextArea.svelte";
  import { log } from "../../backend/functions";
  import { SECOND } from "../../backend/constants";
  import {
    checkIfSecretKeyIsValid,
    saveSettingsForOnboarding,
    checkIfOnboarded,
  } from "../settings";
  import Heading from "../Shared/Heading.svelte";

  enum Steps {
    Welcome,
    SecretKey,
    Password,
    Done,
  }

  const stepCount = Object.keys(Steps).length / 2;

  let currentStep = Steps.Welcome;

  let secretKeyToImport: string | null = null;
  let secretKeyToImportIsValid: Boolean | null = null;
  let passwordToSet: string | null = null;

  let isOnboarded = false;

  const checkSecretKey = (event) => {
    // null while we check...
    secretKeyToImportIsValid = null;
    const suggestedSecretKey = event.target.value;
    // Now set the actual value
    secretKeyToImportIsValid = checkIfSecretKeyIsValid(suggestedSecretKey);
    if (secretKeyToImportIsValid) {
      secretKeyToImport = suggestedSecretKey;
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
          <button
            type="button"
            on:click={() => move(true)}
            class="next-previous">Next</button
          >
        {/if}

        {#if index === Steps.SecretKey}
          <BackButton clickHandler={() => move(false)} />
          <Heading>Import your secret key</Heading>
          <p>
            Paste your secret key (sometimes called 'private key') into the box
            below.
          </p>
          <TextArea placeholder="Secret key" onInputDelay={checkSecretKey} />
          {#if secretKeyToImportIsValid !== null}
            {#if secretKeyToImportIsValid === true}
              <p>✅ Secret key is valid!</p>
            {/if}
            {#if secretKeyToImportIsValid === false}
              <p>🤔 This is not a valid secret key!</p>
            {/if}
          {/if}

          <button
            type="button"
            on:click={() => {
              if (secretKeyToImportIsValid) {
                move(true);
              }
            }}
            class="next-previous {secretKeyToImportIsValid ? '' : 'disabled'}"
            >Next</button
          >
        {/if}

        {#if index === Steps.Password}
          <BackButton clickHandler={() => move(false)} />
          <Heading>Set an unlock phrase</Heading>
          <p>
            Set an unlock phrase. This will be used to unlock your wallet before
            using it.
          </p>

          <input
            type="password"
            title="password"
            placeholder=""
            bind:value={passwordToSet}
            class="password"
          />

          <button
            type="button"
            on:click={async () => {
              log(`Setting PORTAL_SETTINGS`);
              await saveSettingsForOnboarding(secretKeyToImport, passwordToSet);
              isOnboarded = await checkIfOnboarded();
              move(true);
            }}
            class="next-previous {passwordToSet?.length ? '' : 'disabled'}"
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
            class="next-previous">Finish</button
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
    gap: 48px;
    justify-items: center;
    align-items: center;
    /* Required so backbutton will be positioned relative to this step */
    position: relative;
  }

  /* TODO: make some kind of utility class to use for primary buttons and link buttons */
  button.next-previous {
    color: white;
    font-weight: 600;
    padding: 7px 0px;
    font-size: 14px;
    height: 36px;
    width: 100%;
    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }

  button.next-previous.disabled {
    background: gray;
    color: #b5b5b5;
  }
</style>
