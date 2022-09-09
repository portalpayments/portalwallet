import { log } from "./functions";
import { YCOMBINATOR_DEMO_WALLET_FOR_JARED } from "./constants"
import { mintAndTransferIdentityToken } from "./mint-identity-tokens"

describe(`mint an identity token`, () => {
  test(`can mint an identity token for YC demo`, async () => {

    const transactionId = await mintAndTransferIdentityToken(YCOMBINATOR_DEMO_WALLET_FOR_JARED, "Jared", "Friedman");
    log(transactionId)

    
    log(`✅ Completed successfully`);
  })
})
