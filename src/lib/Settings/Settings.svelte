<script lang="ts">
  import { Link } from "svelte-navigator";
  import BackButton from "../Shared/BackButton.svelte";
  import helpIconURL from "../../assets/Icons/help.svg";
  import fullScreenIconURL from "../../assets/Icons/fullscreen.svg";
  import logoutIconURL from "../../assets/Icons/logout.svg";
  import twitterIconURL from "../../assets/Icons/twitter.svg";
  import { log } from "../../backend/functions";
  import { PORTAL_IDENTITY_TOKEN_ISSUER_WALLET } from "../../backend/constants";
  import { secretKeyToBase58 } from "../../backend/solana-functions";
  import Modal from "../Shared/Modal.svelte";
  import { getSettings } from "../../lib/settings";
  import BlurredText from "./BlurredText.svelte";
  import Heading from "../Shared/Heading.svelte";
  import Password from "../Shared/Password.svelte";
  import { authStore } from "../../lib/stores";

  const logout = function () {
    $authStore.keyPair = null;
    location.assign("/");
  };

  const PORTAL_VERSION = process.env.PORTAL_VERSION || "Unknown";

  // We load up the home page, not this Settings page
  // thisis why we don't use (window.location.href)
  const HOME_PAGE = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/index.html`;

  const MOCK_MNEMONIC_FOR_BLURRING = "some words that look like they might be a mnemonic but arent";

  const MOCK_SECRET_KEY_FOR_BLURRING = "iamamocksecretkeywithasimilarlengthtoarealsecretkeybutactuallyihavenorealvalue";

  let enteredPassword: string | null = null;
  let isMnemonicShown = false;
  let isSecretKeyShown = false;
  let isModalOpen = false;

  let mnemonic: string | null = null;
  let secretKey: string | null = null;

  let itemToConfirm: null | "secret key" | "mnemonic" = null;

  const openConfirmSheet = (newItemToConfirm: typeof itemToConfirm) => {
    isModalOpen = true;
    itemToConfirm = newItemToConfirm;
  };

  const checkPasswordAndShowItem = async (suppliedPassword: string, newItemToConfirm: typeof itemToConfirm) => {
    log(`Trying to get settings...`);
    const settings = await getSettings(suppliedPassword);

    log(`Got settings:`, settings);
    if (!settings) {
      // TODO: error UI - copy lock screen
      log(`password was bad`);
      return;
    }
    if (newItemToConfirm === "mnemonic") {
      mnemonic = settings.mnemonic;
      isMnemonicShown = true;
      isSecretKeyShown = false;
    }
    if (newItemToConfirm === "secret key") {
      secretKey = secretKeyToBase58(settings.secretKey);
      isSecretKeyShown = true;
      isMnemonicShown = false;
    }
    isModalOpen = false;
  };
</script>

<div class="settings">
  {#if isModalOpen}
    <Modal>
      <Heading>Attention</Heading>
      <p>
        Anyone with the {itemToConfirm} has
        <strong>full, irrevocable access to your money</strong>.
      </p>
      <p>Portal Support will never ask for your {itemToConfirm}.</p>
      <p>
        Only enter your {itemToConfirm} into a wallet application that you trust. Regular DeFi, web3 and crypto apps don't
        need your {itemToConfirm} to work.
      </p>
      <Password bind:value={enteredPassword} />

      <div class="buttons">
        <button
          class="go-back"
          on:click={() => {
            isModalOpen = false;
          }}
        >
          Leave
        </button>
        <button
          class="enter-password-button"
          on:click={async () => await checkPasswordAndShowItem(enteredPassword, itemToConfirm)}
        >
          View {itemToConfirm}
        </button>
      </div>
    </Modal>
  {/if}

  <div class="hack">
    <BackButton />
    <Heading>Settings</Heading>
  </div>

  <Link class="button with-icon" to={`/contacts/${PORTAL_IDENTITY_TOKEN_ISSUER_WALLET}`}>
    <img src={helpIconURL} alt="Help" />
    Get help from the Portal team
  </Link>

  <a class="button with-icon" href={HOME_PAGE} target="_blank">
    <img src={fullScreenIconURL} alt="New tab" />
    Open Portal in new tab
  </a>

  <a class="button with-icon" href="https://twitter.com/portalpayments">
    <img src={twitterIconURL} alt="Help" />
    Follow @portalpayments on Twitter
  </a>

  <button type="button" class="logout with-icon" on:click|preventDefault={logout}>
    <img src={logoutIconURL} alt="Log out" />
    Lock wallet
  </button>

  <BlurredText
    text={mnemonic || MOCK_MNEMONIC_FOR_BLURRING}
    onClick={() => {
      openConfirmSheet("mnemonic");
    }}
    isShown={isMnemonicShown}
    heading="mnemonic"
    description="mnemonic"
  />

  <BlurredText
    text={secretKey || MOCK_SECRET_KEY_FOR_BLURRING}
    onClick={() => {
      openConfirmSheet("secret key");
    }}
    isShown={isSecretKeyShown}
    heading="Secret Key"
    description="secret key"
  />

  <p>Portal version: {PORTAL_VERSION}</p>
</div>

<style lang="scss">
  /* TODO: stop using absolute position for the back button */
  .hack {
    padding: 18px;
    height: 100%;
  }
  .settings {
    overflow-y: scroll;
    display: grid;
    padding: 0 6px;
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    gap: 8px;
    justify-content: center;
    align-items: start;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
  }

  .buttons {
    grid-auto-flow: row;
  }

  .go-back {
    width: 70%;
    position: relative;
    top: 15px;
    left: 0;
    padding: 10px 0px;
    margin: auto;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 24px;
    background: var(--blue-green-gradient);
  }

  .enter-password-button {
    color: var(--black);
    background: transparent;
  }

  p {
    font-size: 14px;
    line-height: 16px;
  }

  .buttons {
    grid-template-rows: 64px 48px;
    grid-auto-flow: row;
    align-content: center;
    align-items: center;
  }
</style>
