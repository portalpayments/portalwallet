<script type="ts">
  import { authStore } from "../stores";

  let password = "";

  let promise; // nothing to start with

  function login(password) {
    if (password === "testUser") {
      promise = new Promise((yay) =>
        setTimeout(() => yay("logged in!"), 1000)
      ).then((res) => {
        $authStore.isLoggedIn = true;
      });
    } else {
      promise = new Promise((yay) =>
        setTimeout(() => yay("logging in failed!"), 1000)
      ).then((res) => {
        alert("entered password is wrong");
      });
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
    <form on:submit|preventDefault={login(password)}>
      <label>
        Password:
        <input type="password" bind:value={password} />
      </label>
      <button type="submit">Log in</button>
    </form>
  {:else}
    <form on:submit|preventDefault={logout}>
      <button type="submit">Log out</button>
    </form>
  {/if}
</div>

<style></style>
