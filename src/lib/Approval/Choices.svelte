<script lang="ts">
  export let declineLabel: string;
  export let onDecline: () => any;
  export let approveLabel: string;
  export let onApprove: () => any;
</script>

<div class="choices">
  <button class="decline" on:click={onDecline}> {declineLabel}</button>
  <button class="agree" on:click={onApprove}>{approveLabel}</button>
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .choices {
    grid-auto-flow: column;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
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

  button.decline {
    color: var(--mid-blue);
    @include gradient-border(0.5px);
  }

  button.agree {
    color: var(--white);
    background: var(--blue-green-gradient);
    @include shadow;
  }
</style>
