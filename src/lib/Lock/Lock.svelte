<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/portal-logo.svg";
  import Password from "../Shared/Password.svelte";
  import { SECOND } from "../../backend/constants";
  import { log, sleep } from "../../backend/functions";
  import { getSettingsOrNull } from "../../lib/settings";
  import { Keypair } from "@solana/web3.js";

  let password = "";

  let isBadPassword = false;

  const login = async function (password) {
    if (!password.length) {
      isBadPassword = true;
      await sleep(1 * SECOND);
      isBadPassword = false;
    }
    let settings = await getSettingsOrNull(password);

    if (!settings) {
      throw new Error(`Password was bad`);
    }

    let keyPair: Keypair | null = null;
    try {
      keyPair = Keypair.fromSecretKey(settings.secretKey);
    } catch (error) {
      throw new Error(`Could not get keypair from secret key ${error.message}`);
    }

    if (settings) {
      $authStore.isLoggedIn = true;
      $authStore.keyPair = keyPair;
      return;
    }
  };
</script>

<div>
  {#if !$authStore.isLoggedIn}
    <div class="login">
      <img class="logo" src={PortalLogoSVG} alt="Portal Logo" />
      <span class="welcome-message">Welcome Back!</span>

      <div class="password-container">
        <div class="password-prompt">Enter your password</div>

        <div class="gradient-border">
          <Password
            bind:value={password}
            onEnter={() => login(password)}
            bind:isBadPassword
            autoFocus={true}
          />
        </div>

        <button
          type="button"
          on:click|preventDefault={() => {
            login(password);
          }}
          class="primary small-caps login-button">Log in</button
        >
      </div>
    </div>
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

  .gradient-border {
    height: 48px;
    border-radius: 24px;
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
</style>
