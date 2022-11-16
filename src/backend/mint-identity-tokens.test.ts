import { log } from "./functions";
import { JOHN_TESTUSER_DEMO_WALLET, MINUTES } from "./constants";
import { mintAndTransferIdentityToken } from "./mint-identity-tokens";

log(`Running token minter...`);

describe(`mint an identity token`, () => {
  // Only needed for the investor demo
  // (would normally be a script but I couldn't get ts-node
  // to work properly)
  //
  // DO NOT RE-ENABLE THIS TEST AND COMMIT THAT CHANGE
  // (IT IS A HACK WHILE I GET TS-NODE WORKING)
  //
  const WALLET_ADDRESS = JOHN_TESTUSER_DEMO_WALLET;
  const firstName = "John";
  const lastName = "Testuser";

  test.skip(
    `can mint a real identity token for demo purposes`,

    async () => {
      log(`🎫 Minting identity token...`);
      const transactionId = await mintAndTransferIdentityToken(
        WALLET_ADDRESS,
        firstName,
        lastName
      );
      log(transactionId);

      log(`✅ Completed successfully`);
    },
    3 * MINUTES
  );
});
