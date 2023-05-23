<script lang="ts">
  export let declineLabel: string;
  export let onDecline: () => any;
  export let approveLabel: string;
  export let onApprove: () => any;
</script>

<div class="choices">
  <div class="rounded-gradient-border-hack decline">
    <button on:click={onDecline}>
      <!-- Since the previous hack needs a white background, we need another div to the 'background as gradient text' hack -->
      <div class="gradient-text-hack">{declineLabel}</div></button
    >
  </div>

  <div class="rounded-gradient-border-hack agree">
    <button on:click={onApprove}>{approveLabel}</button>
  </div>
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .choices {
    display: grid;
    grid-auto-flow: column;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
  }

  .rounded-gradient-border-hack {
    display: grid;
    align-content: center;
    padding: 0.5px;
    width: 100%;
    height: 36px;

    border-radius: 24px;
    place-items: center;
    @include shadow;
  }

  // TODO: we don't want to prefer either button
  // maybe make both buttons white (so neither is 'active')?

  .rounded-gradient-border-hack.decline {
    padding: 0.5px;
    background: var(--blue-green-gradient);
  }

  .rounded-gradient-border-hack.decline button {
    background: var(--white);
  }

  .rounded-gradient-border-hack.decline button .gradient-text-hack {
    @include blue-green;
  }
  .rounded-gradient-border-hack.agree {
    background: var(--blue-green-gradient);
    color: var(--white);
  }

  .rounded-gradient-border-hack.agree button {
    color: var(--white);
    background: transparent;
  }

  button {
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 16px;
    // 36px parent plus 2 x 0.5px border
    height: 35px;
    width: 100%;
    // 35px / 2
    border-radius: 17.5px;
  }
</style>
