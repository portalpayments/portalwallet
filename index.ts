#!/usr/bin/env ts-node

import { log } from "./lib/utils";
import {
  convertPhraseToSeed,
  seedToWallet,
  connect,
  getAccountBalance,
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

const makeFullWalletWithTokens = async (
  phrase: string,
  birthday: string,
  password: string
) => {
  try {
    const seed = await convertPhraseToSeed(phrase, birthday);
    const wallet = await seedToWallet(seed, password);
    const connection = await connect();
    const balanceBefore = await getAccountBalance(connection, wallet.publicKey);
    await putSolIntoWallet(connection, wallet.publicKey);
    const balanceAfter = await getAccountBalance(connection, wallet.publicKey);
    log(
      `balanceBefore ${balanceBefore}, ${balanceAfter}, Visit https://explorer.solana.com/address/${wallet.publicKey.toString()}?cluster=devnet`
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error.message);
    throw error;
  }
};

(async () => {
  await makeFullWalletWithTokens(phrase, birthday, password);
})();
