import type { Connection, Keypair } from "@solana/web3.js";
import {
  personalPhraseToEntopy,
  mnemonicToKeypairs,
  entropyToMnemonic,
} from "./brainwallet";
import { DEPOSIT } from "./constants";
import { connect, getAccountBalance, putSolIntoWallet } from "./vmwallet";
import { expectedCleanedPersonalPhrase } from "./__mocks__/mocks";

const firstName = `Joe`;
const lastName = `Cottoneye`;

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

describe(`restoration`, () => {
  let connection: Connection;
  let keypairs: Array<Keypair>;
  let restoredKeypairs: Array<Keypair>;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(`wallets can be created`, async () => {
    const entropy = await personalPhraseToEntopy(
      expectedCleanedPersonalPhrase,
      fullName
    );
    const mnemonic = entropyToMnemonic(entropy);
    keypairs = await mnemonicToKeypairs(mnemonic, password);

    // IMPORTANT: if we don't deposit any Sol the wallet won't exist
    const firstWallet = keypairs[0];
    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);

    const accountBalance = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );
    expect(accountBalance).toEqual(DEPOSIT);
  });

  test(`wallets can be restored using their seed phrases`, async () => {
    // Lets re-make the keypairs from the seed
    const entropy = await personalPhraseToEntopy(
      expectedCleanedPersonalPhrase,
      fullName
    );
    const mnemonic = entropyToMnemonic(entropy);
    restoredKeypairs = await mnemonicToKeypairs(mnemonic, password);

    const originalWallet = keypairs[0];
    const restoredWallet = restoredKeypairs[0];
    expect(restoredWallet.secretKey).toEqual(originalWallet.secretKey);
    expect(restoredWallet.publicKey.toBase58()).toEqual(
      originalWallet.publicKey.toBase58()
    );
  });
});
