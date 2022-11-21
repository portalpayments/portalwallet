// Run with 'npx tsx mint-identity-token.ts'
// ts-node has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, stringify } from "./src/backend/functions";
import { mintAndTransferIdentityToken } from "./src/backend/mint-identity-tokens";

const WALLET_ADDRESS = "";
const FIRST_NAME = "";
const LAST_NAME = "";
const IMAGE_FILE = "";

const main = async () => {
  log(`🎟️ Running Portal Identity token minter ...`);
  log(
    stringify({
      WALLET_ADDRESS,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      imageFile: IMAGE_FILE,
    })
  );

  const transactionId = await mintAndTransferIdentityToken(
    WALLET_ADDRESS,
    FIRST_NAME,
    LAST_NAME,
    IMAGE_FILE
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
