// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//

import {
  IDENTITY_TOKEN_NAME,
  RECOVERY_TOKEN_NAME,
  SECONDS,
  SOLANA_SEED_SIZE_BYTES,
} from "./constants";
import {
  base64ToString,
  log,
  sleep,
  stringToBase64,
  toArrayBuffer,
} from "./functions";
import ESSerializer from "esserializer";
// Looks like a small bug in scryptsy types
// @ts-ignore
import { async as scryptAsync } from "scryptsy";
import { buffer } from "stream/consumers";
import {
  getRandomValues,
  encryptWithAESGCM,
  decryptWithAESGCM,
} from "./encryption";
import {
  cleanPhrase,
  secretKeyToHex,
  getKeypairFromString,
} from "./solana-functions";
import type { Connection, Keypair } from "@solana/web3.js";
import type {
  Sft,
  SftWithToken,
  Nft,
  NftWithToken,
  CreateNftBuilderParams,
} from "@metaplex-foundation/js";
import {
  makeTokenMetaDataForIndividual,
  makeTokenMetaDataForOrganization,
  getMetaplex,
} from "./identity-tokens";
import type {
  CipherTextAndInitialisationVector,
  NonFungibleTokenMetadataStandard,
} from "./types";

if (!globalThis.setImmediate) {
  // Fixes 'ReferenceError: setImmediate is not defined' when running in browser
  // @ts-ignore
  globalThis.setImmediate = (func: Function) => setTimeout(func, 0);
}

// Also called the 'seed'.
export const personalPhraseToEntropy = async (
  phrase: string,
  password: string
): Promise<ArrayBuffer> => {
  // scryptsy is an ascrypt implementation that works in both the browser and node

  // CPU/memory cost parameter – must be a power of 2, also called 'N'
  const numberOfIterations = 2 ** 14;
  // Values from https://www.npmjs.com/package/scryptsy#scryptkey-salt-n-r-p-keylenbytes-progresscallback
  const memory = 8;
  const parellisation = 8;
  // @ts-ignore - types are out of date I think
  let entropy = (await scryptAsync(
    phrase,
    password,
    numberOfIterations,
    memory,
    parellisation,
    SOLANA_SEED_SIZE_BYTES
  )) as Buffer;

  // Webcrypto prefers ArrayBuffer
  // but our scrypt implementation uses Buffer
  // TODO: we could use a browser version of node crypto?
  const arrayBuffer = toArrayBuffer(entropy);
  return arrayBuffer;
};

// WebCrypto ingests secrets as CryptoKeys to stop malicious apps from say extracting keys
export const importKey = async (entropy: ArrayBuffer): Promise<CryptoKey> => {
  return crypto.subtle.importKey("raw", entropy, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const makeRecoveryTokenPayload = async (
  secretKey: Uint8Array,
  personalPhrase: string,
  walletUnlockPassword: string
): Promise<string> => {
  // Step 0 - normalize personal phrase
  const cleanedPersonalPhrase = cleanPhrase(personalPhrase);

  // Step 1 - use personal phrase and wallet unlock to build entropy
  const entropy = await personalPhraseToEntropy(
    cleanedPersonalPhrase,
    walletUnlockPassword
  );

  const tokenEncryptionKey = await importKey(entropy);

  // Step 2 - make an IV and store it in the resulting NFT
  const initialisationVector: Uint8Array = await getRandomValues();

  // Step 3 - encrypt the secret key, using the entropy and IV we just made
  const cipherText = await encryptWithAESGCM(
    secretKeyToHex(secretKey),
    initialisationVector,
    tokenEncryptionKey
  );

  const serialized = ESSerializer.serialize({
    cipherText,
    initialisationVector,
  });

  const recoveryTokenPayload = stringToBase64(serialized);
  return recoveryTokenPayload;
};

// Create an identityToken, it will be owned by identityTokenIssuer
export const mintIdentityToken = async (
  connection: Connection,
  user: Keypair,
  cipherText: ArrayBuffer,
  initialisationVector: Uint8Array
): Promise<Sft | SftWithToken | Nft | NftWithToken> => {
  log(`🏦 Minting identity token...`);

  const metaplex = getMetaplex(connection, user, false);
  const metaplexNFTs = metaplex.nfts();

  // See https://github.com/metaplex-foundation/js-examples/blob/main/getting-started-expressjs/createNFT.cjs too

  let createdNFT: Sft | SftWithToken | Nft | NftWithToken;
  try {
    const recoveryTokenPayload = ESSerializer.serialize({
      cipherText,
      initialisationVector,
    });

    const createNftOptions: CreateNftBuilderParams = {
      uri: recoveryTokenPayload,
      name: RECOVERY_TOKEN_NAME,
      sellerFeeBasisPoints: 0, // 500 would represent 5.00%.
    };

    // TODO: metaplexNFTs.create() has a bug, see identity-tokens for details.
    // when this is fixed we can mvoe to metaplex.create() ad save some code
    const transactionBuilder = await metaplexNFTs
      .builders()
      .create(createNftOptions);
    const { mintAddress } = transactionBuilder.getContext();
    await metaplex.rpc().sendAndConfirmTransaction(transactionBuilder);

    // https://github.com/metaplex-foundation/js#usage
    createdNFT = await metaplex.nfts().findByMint({ mintAddress });
    // End of hack for metaplex error
  } catch (thrownError) {
    const error = thrownError as Error;

    // See https://github.com/metaplex-foundation/js/issues/148
    if (error.message.includes("Failed to pack instruction data")) {
      throw new Error(
        `Increase Sol balance of wallet for user ${user.publicKey.toBase58()}`
      );
    }

    if (error.message.includes("insufficient lamports")) {
      throw new Error(
        `⚠️ The user account has run out of Sol. Please send a small amount of Sol to the user account ${user.publicKey.toBase58()}`
      );
    }

    log(`Unexpected error creating NFT:`, error.message);
    throw error;
  }

  log(
    `🎟️ The recoveryToken has been created, and is in the token account at address ${createdNFT.address}.`
  );

  return createdNFT;
};

export const recoverFromToken = async (
  personalPhrase: string,
  walletUnlockPassword: string,
  recoveryTokenPayload: string
): Promise<Keypair | null> => {
  try {
    // It's a base64 encoded ESSerialiser JSON
    const toDeserialize = base64ToString(recoveryTokenPayload);

    // Decode the ESSerializer JSON back to JS
    const decodedDataFromURIField = ESSerializer.deserialize(
      toDeserialize
    ) as CipherTextAndInitialisationVector;
    // Step 0 - normalize personal phrase
    const cleanedPersonalPhrase = cleanPhrase(personalPhrase);

    // Step 1 - use personal phrase and wallet unlock to rebuild entropy
    const entropy = await personalPhraseToEntropy(
      cleanedPersonalPhrase,
      walletUnlockPassword
    );

    const tokenDecryptionKey = await importKey(entropy);

    // Step 3 - decrypt the AES
    const decryptedData = (await decryptWithAESGCM(
      decodedDataFromURIField.cipherText,
      decodedDataFromURIField.initialisationVector,
      tokenDecryptionKey
    )) as string;

    // We're done decrypting, now let's turn it back into a KeyPair
    const restoredWallet = getKeypairFromString(decryptedData as string);
    return restoredWallet;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("Invalid secret key")) {
      return null;
    }
    throw error;
  }
};
