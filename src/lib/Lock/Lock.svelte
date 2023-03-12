<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/portal-logo.svg";
  import Password from "../Shared/Password.svelte";
  import { SECOND } from "../../backend/constants";
  import { log, sleep } from "../../backend/functions";
  import { getSettings } from "../../lib/settings";
  import { Keypair } from "@solana/web3.js";

  let password = "";

  let isBadPassword = false;

  const login = async function (password) {
    if (!password.length) {
      isBadPassword = true;
      await sleep(1 * SECOND);
      isBadPassword = false;
    }
    let settings = await getSettings(password);

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

{#if !$authStore.isLoggedIn}
  <div class="login">
    <img class="logo" src={PortalLogoSVG} alt="Portal Logo" />
    <span class="welcome-message">Welcome Back!</span>

    <div class="password-container">
      <div class="password-prompt">Enter your password</div>

      <!-- Form only to prevent annoying 'Password field is not contained in a form' message in devtools -->
      <form on:submit={(event) => event.preventDefault()}>
        <div class="fancy-border">
          <!-- Only to prevent annoying 'Use hidden fields for implicit information' message in devtools -->
          <input
            class="fake-username-input"
            type="text"
            autocomplete="username"
          />
          <Password
            bind:value={password}
            onEnter={() => login(password)}
            bind:isBadPassword
            isNewPassword={false}
            onMount={(element) => {
              element.focus();
            }}
          />
        </div>
      </form>

      <button
        type="button"
        on:click|preventDefault={() => {
          login(password);
        }}
        class="login-button primary">Log in</button
      >
    </div>
  </div>
{/if}

<style lang="scss">
  @import "../../mixins.scss";

  .login {
    display: grid;
    align-content: center;
    grid-auto-flow: row;
    gap: 24px;
    padding: 48px;
    color: #3a3a3a;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #ddfff6 0, #fff 80%, #fff 100%);
  }

  .fake-username-input {
    display: none;
  }

  .login-button {
    @include small-caps;
    @include shadow;
  }

  .fancy-border {
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
