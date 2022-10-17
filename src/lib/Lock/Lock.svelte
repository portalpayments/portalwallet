<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/PortalLogo.svg";
  import Password from "../Shared/Password.svelte";
  import { getSettings } from "../settings";
  import type { Settings } from "../types";
  import { SECOND } from "../../backend/constants";
  import { log, sleep } from "../../backend/functions";

  let password = "";

  let isBadPassword = false;

  const login = async function (password) {
    if (!password.length) {
      isBadPassword = true;
      await sleep(1 * SECOND);
      isBadPassword = false;
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
</script>

<div>
  {#if !$authStore.isLoggedIn}
    <div class="login">
      <img class="logo" src={PortalLogoSVG} alt="Portal Logo" />
      <span class="welcome-message">Welcome Back!</span>

      <div class="password-container">
        <div class="password-prompt">Enter your password</div>

        <Password
          bind:value={password}
          onEnter={() => login(password)}
          bind:isBadPassword
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
    <button type="button" on:click|preventDefault={logout} class="logout-button"
      >log out</button
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
    background: var(--blue-green-gradient);
  }

  .logout-button {
    background-color: rgba(255, 96, 134, 0.33);
    color: rgb(255, 96, 134);
    padding: 8px 0px;
    background-color: transparent;
    font-size: 1rem;
  }
</style>
