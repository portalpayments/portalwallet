<script lang="ts">
  let address: string | null = null;
  address = window.location.href.split("/").pop();
  import { authStore } from "../../../lib/stores";
  let loggedIn = $authStore.isLoggedIn;
</script>

<div>
  {loggedIn}
  sending money to {address}
</div>
