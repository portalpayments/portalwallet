<script lang="ts">
  import Logo from "../../assets/PortalLogo.svg";
  import BackButton from "../Shared/BackButton.svelte";
  import { log } from "../../backend/functions";

  enum Steps {
    Welcome,
    SecretKey,
    Verify,
    Done,
  }

  const stepCount = Object.keys(Steps).length / 2;

  let currentStep = Steps.Welcome;

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
          <h1>Import your secret key</h1>
          <BackButton />
          <button
            type="button"
            on:click={() => move(true)}
            class="next-previous">Next</button
          >
        {/if}
        {#if index === Steps.Verify}
          <h1>Get verified</h1>
          <BackButton />
          <button
            type="button"
            on:click={() => move(true)}
            class="next-previous">Next</button
          >
        {/if}
        {#if index === Steps.Done}
          <BackButton />
          <h1>done</h1>
          <button
            type="button"
            on:click={() => move(true)}
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
</style>
