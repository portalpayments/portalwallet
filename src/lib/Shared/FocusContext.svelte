<!-- Handles what to focus when multiple children might want focus. 
From https://stackoverflow.com/questions/73680072/how-can-i-use-useregisterfocus-conditionally-in-svelte/73680833#73680833 -->
<script context="module">
  import { getContext } from "svelte";
  export const getFocusContext = () => getContext("FocusContext");
</script>

<script>
  import { useFocus } from "svelte-navigator";
  import { setContext } from "svelte";

  const focus = useFocus();
  setContext("FocusContext", focus);
</script>

<slot />
