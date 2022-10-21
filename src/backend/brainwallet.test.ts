import type { Connection, Keypair } from "@solana/web3.js";
import { log } from "./functions";
import {
  personalPhraseToEntopy,
  mnemonicToKeypairs,
  entropyToMnemonic,
  checkIfSecretKeyIsValid,
  checkIfMnemonicPhraseIsValid,
} from "./brainwallet";
import { DEPOSIT, SECONDS } from "./constants";
import { connect, getAccountBalance, putSolIntoWallet } from "./vmwallet";
import { expectedCleanedPersonalPhrase } from "./__mocks__/mocks";
import * as dotenv from "dotenv";
import * as base58 from "bs58";

const firstName = `Joe`;
const lastName = `Cottoneye`;

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

dotenv.config();

describe(`restoration`, () => {
  let connection: Connection;
  let keypairs: Array<Keypair>;
  let restoredKeypairs: Array<Keypair>;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(
    `wallets can be created`,
    async () => {
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
    },
    15 * SECONDS
  );

  test(
    `wallets can be restored using their seed phrases`,
    async () => {
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
    },
    15 * SECONDS
  );
});

describe(`recovery`, () => {
  test(`we show a valid secret key is valid`, () => {
    const mikesSecretKey = process.env.MIKES_SECRET_KEY;
    expect(mikesSecretKey).toBeDefined();
    const result = checkIfSecretKeyIsValid(mikesSecretKey);
    expect(result).toBeTruthy();
  });

  test(`we show a bad secret key is bad`, () => {
    const result = checkIfSecretKeyIsValid("im a bad secret key");
    expect(result).toBeFalsy();
  });

  test(`We can check if mnemonics are valid`, () => {
    const mikesMnemonic = process.env.MIKES_MNEMONIC;
    expect(mikesMnemonic).toBeDefined();
    const result = checkIfMnemonicPhraseIsValid(mikesMnemonic);
    expect(result).toBeTruthy();
  });

  test(`We show a bad mnemonic key is bad`, () => {
    const result = checkIfMnemonicPhraseIsValid("i am not a vlaid mnemonic");
    expect(result).toBeFalsy();
  });

  test(`Using a secretKey and using a nmemonic generate the same secret key`, async () => {
    const mikesSecretKey = process.env.MIKES_SECRET_KEY;
    const mikesMnemonic = process.env.MIKES_MNEMONIC;
    const secretKeyOne = base58.decode(mikesSecretKey);

    const keypairs = await mnemonicToKeypairs(mikesMnemonic, null);
    const firstWallet = keypairs[0];
    const secretKeyTwo = firstWallet.secretKey;

    expect(secretKeyOne).toEqual(secretKeyTwo);

    log(secretKeyOne);
    log(secretKeyTwo);
  });
});
