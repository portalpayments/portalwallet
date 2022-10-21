<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";

  import { log, isEmpty } from "../../backend/functions";
  import Modal from "../Shared/Modal.svelte";
  import { getSettingsOrNull } from "../../lib/settings";
  import BlurredText from "./BlurredText.svelte";
  import Heading from "../Shared/Heading.svelte";
  import Password from "../Shared/Password.svelte";

  const MOCK_MNEMONIC_FOR_BLURRING =
    "some words that look like they might be a mnemonic but arent";

  const MOCK_SECRET_KEY_FOR_BLURRING =
    "iamamocksecretkeywithasimilarlengthtoarealsecretkeybutactuallyihavenorealvalue";

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

  const checkPasswordAndShowItem = async (
    suppliedPassword: string,
    newItemToConfirm: typeof itemToConfirm
  ) => {
    log(`Trying to get settings...`);
    const settings = await getSettingsOrNull(suppliedPassword);

    log(`Got settings`, settings);

    const isPasswordCorrect = Boolean(settings);
    if (!isPasswordCorrect) {
      // TODO: error UI
      log(`password was bad`);
      return;
    }
    if (newItemToConfirm === "mnemonic") {
      mnemonic = settings.mnemonic;
      isMnemonicShown = true;
    }
    if (newItemToConfirm === "secret key") {
      mnemonic = settings.personalPhrase;
      isSecretKeyShown = true;
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
        Only enter your {itemToConfirm} into a wallet application that you trust.
        Regular DeFi, web3 and crypto apps don't need your {itemToConfirm} to work.
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
          on:click={async () =>
            await checkPasswordAndShowItem(enteredPassword, itemToConfirm)}
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
</div>

<style>
  /* TODO: stop using absolute position for the back button */
  .hack {
    padding: 18px;
    height: 100%;
  }
  .settings {
    display: grid;
    padding: 0 6px;
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    grid-template-rows: 120px 1fr 1fr;
    gap: 20px;
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
