<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/PortalLogo.svg";
  import { getSettings } from "../settings";
  import type { Settings } from "../types";
  import { SECOND } from "../../backend/constants";
  import { log, sleep } from "../../backend/functions";
  import { useFocus } from "svelte-navigator";

  let password = "";

  let isBadPassword = false;

  const login = async function (password) {
    if (!password.length) {
      throw new Error(`Type a password`);
    }
    let settings: Settings;
    try {
      settings = await getSettings(password);
    } catch (thrownObject) {
      // TODO: we're basically assuming all getSettings() failures are a bad password
      // The other option is: we simply don't have settings get
      // We should check localforage for PORTAL_SETTINSG and show the onboarding UI
      // if it doesn't exist.
      // const error = thrownObject as Error;
      isBadPassword = true;
      await sleep(1 * SECOND);
      isBadPassword = false;
    }

    if (settings) {
      $authStore.isLoggedIn = true;
      $authStore.secretKey = settings.secretKey;
      return;
    }
  };

  const logout = function () {
    $authStore.isLoggedIn = false;
    location.assign("/");
  };

  const registerFocus = useFocus();
</script>

<div>
  {#if !$authStore.isLoggedIn}
    <div class="login">
      <img class="logo" src={PortalLogoSVG} alt="Portal Logo" />
      <span class="welcome-message">Welcome Back!</span>

      <div class="password-container">
        <div class="password-prompt">Enter your password</div>
        <input
          type="password"
          title="password"
          placeholder=""
          use:registerFocus
          bind:value={password}
          on:keydown={(event) => {
            if (event.key === "Enter") {
              login(password);
            }
          }}
          class="password {isBadPassword ? 'bad-password' : ''}"
        />

        <button
          type="button"
          on:click|preventDefault={() => {
            login(password);
          }}
          class="login-button">Log in</button
        >
      </div>
    </div>
  {:else}
    <button
      type="button"
      on:click|preventDefault={logout}
      class="logout-button logout-button-top-bar">log out</button
    >
  {/if}
</div>

<style>
  .login {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr 30px 50px 1fr;
    gap: 20px;
    color: #3a3a3a;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #ddfff6 0, #fff 80%, #fff 100%);
  }
  .logo {
    width: 180px;
    justify-self: center;
  }
  .welcome-message {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--black);
  }

  .password-container {
    display: grid;
    gap: 10px;
    grid-auto-flow: row;
    grid-template-rows: 30px 1fr 1fr;
  }

  .password {
    transition: all 200ms ease-out;
  }

  button {
    width: 100%;
    padding: 8px 0px;
    margin: auto;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .login-button {
    background-color: var(--mid-blue);
    color: #fff;
    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
  .logout-button {
    background-color: rgba(255, 96, 134, 0.33);
    color: rgb(255, 96, 134);
  }
  .logout-button-top-bar {
    padding: 8px 0px;
    background-color: transparent;
    font-size: 1rem;
  }

  .bad-password {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    background-color: var(--error-pink);
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
