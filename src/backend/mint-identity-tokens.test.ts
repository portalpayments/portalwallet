import { log } from "./functions";
import {
  JOE_MCCANNS_WALLET,
  MINUTE,
  MINUTES,
  YCOMBINATOR_DEMO_WALLET_FOR_JARED,
} from "./constants";
import { mintAndTransferIdentityToken } from "./mint-identity-tokens";

describe(`mint an identity token`, () => {
  // Only needed for the YC demo
  // (would normally be a script but I couldn't get ts-node
  // to work properly)
  test.skip(
    `can mint a real identity token for demo purposes`,
    async () => {
      const transactionId = await mintAndTransferIdentityToken(
        JOE_MCCANNS_WALLET,
        "Joseph Isaac",
        "McCann"
      );
      log(transactionId);

      log(`✅ Completed successfully`);
    },
    3 * MINUTES
  );
});
