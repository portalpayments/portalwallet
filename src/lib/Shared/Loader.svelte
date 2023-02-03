<script lang="ts">
  import { log } from "../../backend/functions";

  // From https://codepen.io/scottloway/pen/zqoLyQ

  let isComplete = false;

  const showTick = () => {
    log(`Settin complete`);
    isComplete = !isComplete;
  };
</script>

<div class="circle {isComplete ? 'load-complete' : ''}">
  <div class="checkmark draw {isComplete ? 'load-complete' : ''}" />
</div>

<p>
  <button id="toggle" type="button" class="btn btn-success" on:click={showTick}>
    Toggle Completed
  </button>
</p>

<style lang="scss">
  @import "../../mixins.scss";
  body {
    padding: 5em;
    text-align: center;
  }

  :root {
    --loader-size: 7em;
    --check-height: calc(var(--loader-size) / 2);
    --check-width: calc(var(--check-height) / 2);
    --check-left: calc((var(--loader-size) / 6) + (var(--loader-size) / 12));
    --check-thickness: 3px;
    --check-color: var(--mid-blue);
  }

  .circle {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left-color: var(--check-color);
    animation: loader-spin 1.2s infinite linear;
    // used to position after on checkmark
    // TODO: clean this up when I have time, make it use grid
    position: relative;
    border-radius: 50%;
    width: var(--loader-size);
    height: var(--loader-size);
  }

  .circle.load-complete {
    animation: none;
    // Fill entire circle solid when complete
    border-color: var(--check-color);
    transition: all 500ms ease-out;
    @include shadow;
  }

  .checkmark {
    display: none;
  }

  .checkmark:after {
    opacity: 1;
    height: var(--check-height);
    width: var(--check-width);
    transform-origin: left top;
    // it's a rectangle with two sides deleted
    border-right: var(--check-thickness) solid;
    border-top: var(--check-thickness) solid;
    border-bottom: none;
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

    content: "";
    left: var(--check-left);
    top: var(--check-height);
    position: absolute;
  }

  .checkmark.draw:after {
    animation-duration: 800ms;
    animation-timing-function: ease;
    animation-name: checkmark;
    transform: scaleX(-1) rotate(135deg);
  }

  .checkmark.load-complete {
    display: unset;
  }

  @keyframes loader-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes checkmark {
    0% {
      height: 0;
      width: 0;
      opacity: 1;
    }
    20% {
      height: 0;
      width: var(--check-width);
      opacity: 1;
    }
    40% {
      height: var(--check-height);
      width: var(--check-width);
      opacity: 1;
    }
    100% {
      height: var(--check-height);
      width: var(--check-width);
      opacity: 1;
    }
  }
</style>
