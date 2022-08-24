<script type="ts">
  import { authStore } from "../stores";
  let mode = "signup";
  let username = "";
  let password = "";
  let email = "";
  let promise; // nothing to start with
  function toggleMode() {
    if (mode === "signup") mode = "signin";
    else mode = "signup";
  }
  function handleSubmit() {
    if (mode === "signup") {
      promise = new Promise((yay) =>
        setTimeout(() => yay("logged in!"), 1000)
      ).then((data) => {
        console.log(data);
        $authStore = data;
      });
    } else {
      promise = new Promise((yay, nay) =>
        setTimeout(() => nay("error 418"), 1000)
      ).then((data) => {
        console.log(data);
        $authStore = data;
      });
    }
  }
</script>

<div>
  {#await promise}
    <p>Logging in...</p>
  {:catch error}
    <p class="error">Something went wrong: {error}</p>
  {/await}
  <div class="SwitchContainer">
    <label class="switch">
      <input type="checkbox" on:click={toggleMode} value={mode === "signin"} />
      <span class="slider round" />
    </label>
    {#if mode === "signin"}
      Switch to Sign Up
    {:else}
      Switch to Sign In
    {/if}
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Username:
      <input type="text" bind:value={username} placeholder="your username" />
    </label><label>
      Password:
      <input type="password" bind:value={password} />
    </label>
    {#if mode === "signup"}
      <label>
        Email:
        <input type="email" bind:value={email} />
      </label>
    {/if}
    <button type="submit">Submit</button>
  </form>
</div>

<style></style>
