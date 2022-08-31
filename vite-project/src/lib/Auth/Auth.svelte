<script lang="ts">
  import { authStore } from "../stores";
  import PortalLogoSVG from "../../assets/PortalLogo.svg";
  import { sleep } from "../../../../src/functions";
  import { SECOND } from "../../../../src/constants";

  let password = "";
  export let name = "Mike";

  const TEMPORARY_PASSWORD = "password";

  async function login(password) {
    await sleep(1 * SECOND);
    if (password === "password") {
      $authStore.isLoggedIn = true;
    } else {
      alert("entered password is wrong");
    }
  }

  function logout() {
    $authStore.name = "";
    $authStore.isLoggedIn = false;
    location.assign("/");
  }
</script>

<div>
  {#if !$authStore.isLoggedIn}
    <div class="login">
      <img src={PortalLogoSVG} alt="Portal Logo" />
      <div class="welcomeMessage">
        Welcome Back <span style="font-weight:700;">{name}</span>!
      </div>
      <form
        on:submit|preventDefault={() => {
          // Small trick to use an async function in a click handler
          login(password);
          return false;
        }}
      >
        <div class="passwordContainer">
          <div class="password-prompt">Enter your password</div>
          <input type="password" bind:value={password} />

          <button type="submit" class="loginButton">Log in</button>
        </div>
      </form>
    </div>
  {:else}
    <form on:submit|preventDefault={logout}>
      <button type="submit" class="logoutButton logout-button-topBar"
        >Log out</button
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
  }
  .login img {
    width: 180px;
    justify-self: center;
  }
  .welcomeMessage {
    font-size: 1.2rem;
    font-weight: 500;
    color: #4d4d4d;
  }
  input {
    border-radius: 9px;
    padding: 0px 0px 0px 6px;
    border: 1px solid rgba(217, 217, 217, 0.7);
    background-color: rgba(217, 217, 217, 0.1);
    width: 200px;
    height: 38px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  .passwordContainer {
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
  .loginButton {
    background-color: #2775c9;
    color: #fff;
  }
  .logoutButton {
    background-color: rgba(255, 96, 134, 0.33);
    color: rgb(255, 96, 134);
  }
  .logout-button-topBar {
    padding: 8px 0px;
    background-color: transparent;
    font-size: 1rem;
  }
</style>
