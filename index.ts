#!/usr/bin/env ts-node

import { log } from "./lib/utils";
import {
  convertPhraseToSeed,
  seedToWallet,
  connect,
  getAccountInfo,
  putSolIntoWallet,
} from "./lib/vmwallet";

const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

const birthday = "19810321";

const password = "swag";

(async () => {
  try {
    const seed = await convertPhraseToSeed(phrase, birthday);
    const wallet = await seedToWallet(seed, password);
    const connection = await connect();
    await getAccountInfo(connection, wallet.publicKey);
    await putSolIntoWallet(connection, wallet.publicKey);
    await getAccountInfo(connection, wallet.publicKey);
    log(
      `Visit https://explorer.solana.com/address/${wallet.publicKey.toString()}?cluster=devnet`
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error.message);
  }
})();
