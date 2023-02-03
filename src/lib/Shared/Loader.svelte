<script lang="ts">
  import { log } from "../../backend/functions";

  // From https://codepen.io/scottloway/pen/zqoLyQ

  let isComplete = false;

  const showTick = () => {
    log(`Setting complete`);
    isComplete = !isComplete;
  };
</script>

<div class="loader">
  <div class="circle {isComplete ? 'complete' : ''}">
    <div class="big-white-area" />
  </div>
  <div class="tick {isComplete ? 'complete' : ''}" />
</div>

<button id="toggle" type="button" on:click={showTick}>
  Toggle Completed
</button>

<style lang="scss">
  @import "../../mixins.scss";

  .loader {
    // Explicitly position for absolutely positioned children
    position: relative;
    width: 120px;
    height: 120px;
  }

  .circle {
    animation: spin 1.2s infinite linear;
    background-size: 100% 100%;
    background-position: 0px 0px;
    padding: 2px;
    align-items: center;
    justify-items: center;
    background-image: conic-gradient(
      from 0deg at 50% 50%,
      rgba(255, 255, 255, 0) 0%,
      #419cfd11 3%,
      #00a9fe22 6%,
      #00b4f744 9%,
      #00bde966 12%,
      #00c5d699 15%,
      #00cac1bb 18%,
      #38ceaccc 21%,
      #6ed199ff 24%,
      #ffffffff 24%,

      rgba(255, 255, 255, 0) 100%
    );
    position: relative;
    border-radius: 50%;
    width: 120px;
    height: 120px;
  }

  .big-white-area {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 50%;
  }

  .circle.complete {
    animation: none;
    // Fill entire circle solid when complete
    transition: all 200ms ease-in-out;
    background-image: conic-gradient(
      from 270deg at 50% 50%,
      #419cfd 0%,
      #00a9fe 7%,
      #00b4f7 14%,
      #00bde9 21%,
      #00c5d6 28%,
      #00cac1 35%,
      #38ceac 42%,
      #6ed199 50%,
      #38ceac 57%,
      #00cac1 64%,
      #00c5d6 71%,
      #00bde9 78%,
      #00b4f7 85%,
      #00a9fe 92%,
      #419cfd 100%
    );
    @include shadow;
  }

  .tick {
    display: none;
    opacity: 1;
    height: 60px;
    width: 30px;
    // transform-origin: left top;
    // it's a rectangle with two sides deleted
    border-right: 4px solid;
    border-top: none;
    border-bottom: 4px solid;
    border-left: none;
    border-image: linear-gradient(
        135deg,
        #419cfd,
        #00a9fe,
        #00b4f7,
        #00bde9,
        #00c5d6,
        #00cac1,
        #38ceac,
        #6ed199
      )
      1;

    transform: scale(-1) rotate(45deg) translateX(61px) translateY(28px);

    position: absolute;
  }

  .tick.complete {
    animation-duration: 800ms;
    animation-timing-function: ease;
    animation-name: fade-in;
    transform: rotate(45deg) translateX(45px) translateY(-15px);
    display: unset;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
