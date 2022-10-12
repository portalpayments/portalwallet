import { log } from "./functions";
import { JOHN_TESTUSER_DEMO_WALLET, MINUTES } from "./constants";
import { mintAndTransferIdentityToken } from "./mint-identity-tokens";

log(`Running token minter...`);

describe(`mint an identity token`, () => {
  // Only needed for the investor demo
  // (would normally be a script but I couldn't get ts-node
  // to work properly)
  test.skip(
    `can mint a real identity token for demo purposes`,
    async () => {
      log(`🎫 Minting identity token...`);
      const transactionId = await mintAndTransferIdentityToken(
        JOHN_TESTUSER_DEMO_WALLET,
        "John",
        "Testuser"
      );
      log(transactionId);

      log(`✅ Completed successfully`);
    },
    3 * MINUTES
  );
});
