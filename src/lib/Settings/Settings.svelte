<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";

  import { log, isEmpty } from "../../backend/functions";
  import Modal from "../Shared/Modal.svelte";
  import { getSettingsOrNull } from "../../lib/settings";
  import BlurredText from "./BlurredText.svelte";
  import Password from "../Shared/Password.svelte";

  const MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING =
    "I am a mocked phrase to show as blurred text before the real personal recovery phrase has been decrypted";

  let enteredPassword = "";
  let isRecoveryPhraseBlurred = true;
  let isPrivateKeyBlurred = true;
  let isModalOpen = false;
  let showRecoveryPhrase = false;
  let showPrivateKey = false;

  let secretKeyText: string | null = null;

  const checkPassword = async (
    suppliedPassword,
    showRecoveryPhrase: boolean = false,
    showPrivateKey: boolean = false
  ) => {
    //  TODO make this secure. Get the private key and personal recovery phrase on demand
    const settings = await getSettingsOrNull(suppliedPassword);
    const isPasswordCorrect = Boolean(settings);
    if (showRecoveryPhrase && isPasswordCorrect) {
      isModalOpen = false;
      isRecoveryPhraseBlurred = false;
    }
    if (showPrivateKey && isPasswordCorrect) {
      isModalOpen = false;
      isPrivateKeyBlurred = false;
    }
    // TODO: error UI
    log(`password was bad`);
  };
</script>

<div class="settings">
  {#if isModalOpen}
    <Modal buttonType="transfer">
      <div>enter your password</div>
      <Password bind:value={enteredPassword} />
      <button
        class="enter-password-button"
        on:click={() =>
          checkPassword(enteredPassword, showRecoveryPhrase, showPrivateKey)}
        >submit</button
      >
    </Modal>
  {/if}

  <div>
    <BackButton>Home</BackButton>
  </div>

  <BlurredText
    text={MOCK_PERSONAL_RECOVERY_PHRASE_FOR_BLURRING}
    heading="Personal recovery phrase"
    description="recovery phrase"
  />

  <BlurredText
    text={secretKeyText}
    heading="Secret Key"
    description="secret key"
  />
</div>

<style>
  .settings {
    display: grid;
    padding: 0 6px;
    width: var(--wallet-width);
    height: var(--wallet-height);
    grid-auto-flow: row;
    grid-template-rows: 64px 80px 1fr 1fr;
    gap: 20px;
    justify-content: center;
    align-items: start;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
  }

  .enter-password-button {
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
</style>
