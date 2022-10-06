<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/PortalLogo.svg";

  import { useFocus } from "svelte-navigator";

  let password = "";
  // TODO: get name from wallet
  export let name = "Mike";

  async function login(password) {
    // TODO: implement a real check using encryption on localStorage item.
    $authStore.isLoggedIn = true;
  }

  function logout() {
    $authStore.isLoggedIn = false;
    location.assign("/");
  }

  const registerFocus = useFocus();
</script>

<div>
  {#if !$authStore.isLoggedIn}
    <div class="login">
      <img class="logo" src={PortalLogoSVG} alt="Portal Logo" />
      <span class="welcome-message"> Welcome Back! </span>
      <form
        on:submit|preventDefault={() => {
          // Small trick to use an async function in a click handler
          login(password);
          return false;
        }}
      >
        <div class="password-container">
          <div class="password-prompt">Enter your password</div>
          <input type="password" use:registerFocus bind:value={password} />

          <button type="submit" class="login-button">Log in</button>
        </div>
      </form>
    </div>
  {:else}
    <form on:submit|preventDefault={logout}>
      <button type="submit" class="logout-button logout-button-top-bar"
        >log out</button
      >
    </form>
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
</style>
