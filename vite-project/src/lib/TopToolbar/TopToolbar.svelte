<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import NotifiactionBell from "../../assets/notification-bell.svg";
  export let name = "anonymous";
  export let verified = false;
</script>

<div class="header">
  <div class="username">
    <button>
      {name}
      {#if verified}
        <img src={Checkmark} alt="User is Verified" />
      {/if}
    </button>
  </div>
  <button style="justify-self: end; background: none; padding: 0;">
    <img src={NotifiactionBell} alt="Notifiactions" class="bellIcon" />
  </button>
</div>

<style>
  .header {
    display: grid;
    grid-auto-flow: column;
    padding: 0px 10px 0px 10px;
    grid-template-columns: 1fr 100px;
    align-items: center;
    justify-items: start;
    gap: 4px;
  }
  button {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: #2d5177;
    font-weight: 600;
    font-size: 1rem;
  }
  button > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
  .bellIcon {
    filter: invert(37%) sepia(30%) saturate(2457%) hue-rotate(184deg)
      brightness(97%) contrast(87%);
  }
</style>
