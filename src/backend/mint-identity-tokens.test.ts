import { log } from "./functions";
import { JOHN_TESTUSER_DEMO_WALLET, MINUTES } from "./constants";
import { mintAndTransferIdentityToken } from "./mint-identity-tokens";

log(`Running token minter...`);

// Only needed for alpha tests
// (would normally be a script not a test but I couldn't get ts-node to work properly)
describe(`mint a real identity token`, () => {
  const WALLET_ADDRESS = "";
  const firstName = "";
  const lastName = "";

  // DO NOT RE-ENABLE THIS TEST AND COMMIT THAT CHANGE
  // (IT IS A HACK WHILE I GET TS-NODE WORKING)
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
