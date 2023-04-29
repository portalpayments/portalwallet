// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//

import {
  RECOVERY_TOKEN_NAME,
  SECONDS,
  SOLANA_SEED_SIZE_BYTES,
} from "./constants";
import * as http from "fetch-unfucked";
import { log, stringify, sleep, toArrayBuffer } from "./functions";
import ESSerializer from "esserializer";
import scryptAsync from "scryptsy";
import {
  getRandomValues,
  encryptWithAESGCM,
  decryptWithAESGCM,
} from "./encryption";
import {
  cleanPhrase,
  secretKeyToHex,
  getKeypairFromString,
  getAttributesFromNFT,
} from "./solana-functions";
import type { Connection, Keypair, PublicKey } from "@solana/web3.js";
import type {
  Sft,
  SftWithToken,
  Nft,
  NftWithToken,
  CreateNftBuilderParams,
  JsonMetadata,
} from "@metaplex-foundation/js";
import {
  getAnonymousMetaplex,
  getMetaplex,
  identityTokenIssuerPublicKey,
} from "./identity-tokens";
import type {
  CipherTextAndInitializationVector,
  CipherTextAndInitializationVectorSerialized,
} from "./types";

if (!globalThis.setImmediate) {
  // Fixes 'ReferenceError: setImmediate is not defined' when running in browser
  // @ts-ignore
  globalThis.setImmediate = (func: Function) => setTimeout(func, 0);
}

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

export const makeRecoveryTokenCiphertextAndInitializationVector = async (
  secretKey: Uint8Array,
  personalPhrase: string,
  walletUnlockPassword: string
): Promise<CipherTextAndInitializationVectorSerialized> => {
  // Step 0 - normalize personal phrase
  const cleanedPersonalPhrase = cleanPhrase(personalPhrase);

  // Step 1 - use personal phrase and wallet unlock to build entropy
  const entropy = await personalPhraseToEntropy(
    cleanedPersonalPhrase,
    walletUnlockPassword
  );

  const tokenEncryptionKey = await importKey(entropy);

  // Step 2 - make an IV and store it in the resulting NFT
  const initializationVector: Uint8Array = await getRandomValues();

  // Step 3 - encrypt the secret key, using the entropy and IV we just made
  const cipherText = await encryptWithAESGCM(
    secretKeyToHex(secretKey),
    initializationVector,
    tokenEncryptionKey
  );

  const recoveryTokenCiphertextAndInitializationVector = {
    cipherText: ESSerializer.serialize(cipherText),
    initializationVector: ESSerializer.serialize(initializationVector),
  };

  return recoveryTokenCiphertextAndInitializationVector;
};

export const makeRecoveryTokenOffChainMetadata = async (
  user: Keypair,
  personalPhrase: string,
  walletUnlockPassword: string
): Promise<JsonMetadata> => {
  const recoveryTokenPayload =
    await makeRecoveryTokenCiphertextAndInitializationVector(
      user.secretKey,
      personalPhrase,
      walletUnlockPassword
    );

  return {
    name: "Portal Recovery Token",
    description:
      "Beta of Portal Recovery Token. This will eventually live on-chain but we're using Pinata temporarily while we create the on-chain app.",
    // TODO: we could add an image later if we wanted. I just don't have the time to draw right now.
    image: null,
    external_url: "https://getportal.app",
    attributes: [
      {
        trait_type: "about",
        value: "This is a proof of concept of the Portal Recovery token.",
      },
      {
        trait_type: "initializationVector",
        value: recoveryTokenPayload.initializationVector,
      },
      {
        trait_type: "cipherText",
        value: recoveryTokenPayload.cipherText,
      },
    ],
    properties: {
      files: [],
    },
  };
};

// Create an recoveryToken, it will be owned by user
export const mintRecoveryToken = async (
  connection: Connection,
  user: Keypair,
  externalMetaDataUri: string
): Promise<Sft | SftWithToken | Nft | NftWithToken> => {
  log(`🏦🛟 Minting recovery token...`);

  const metaplex = getMetaplex(connection, user, false);
  const metaplexNFTs = metaplex.nfts();

  // See https://github.com/metaplex-foundation/js-examples/blob/main/getting-started-expressjs/createNFT.cjs too

  let createdNFT: Sft | SftWithToken | Nft | NftWithToken;
  try {
    const createNftOptions: CreateNftBuilderParams = {
      uri: externalMetaDataUri,
      name: RECOVERY_TOKEN_NAME,
      sellerFeeBasisPoints: 0, // 500 would represent 5.00%.
    };

    // TODO: metaplexNFTs.create() has a bug, see identity-tokens for details.
    // when this is fixed we can move to metaplex.create() and save some code
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
  recoveryTokenPayload: CipherTextAndInitializationVectorSerialized
): Promise<Keypair | null> => {
  try {
    // Decode the ESSerializer JSON back to JS
    const cipherText = ESSerializer.deserialize(
      recoveryTokenPayload.cipherText
    );
    const initializationVector = ESSerializer.deserialize(
      recoveryTokenPayload.initializationVector
    );

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
      cipherText,
      initializationVector,
      tokenDecryptionKey
    )) as string;

    // We're done decrypting, now let's turn it back into a KeyPair
    const restoredWallet = getKeypairFromString(decryptedData);
    return restoredWallet;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("Invalid secret key")) {
      return null;
    }
    throw error;
  }
};

export const getRecoveryTokenFromWallet = async (
  connection: Connection,
  address: PublicKey
): Promise<CipherTextAndInitializationVectorSerialized | null> => {
  const metaplex = await getAnonymousMetaplex(connection);
  const nfts = await metaplex.nfts().findAllByOwner({
    owner: address,
  });

  const allSelfIssuedRecoveryTokens = nfts.filter((nft) => {
    // Look for Portal Recovery Token issued by user
    // Quick note we need to toBase58() both addresses for the comparison to work.
    const firstCreator = nft.creators?.[0]?.address?.toBase58();
    return (
      nft.name === RECOVERY_TOKEN_NAME && firstCreator === address.toBase58()
    );
  });

  if (!allSelfIssuedRecoveryTokens.length) {
    return null;
  }
  const firstRecoveryToken = allSelfIssuedRecoveryTokens[0];

  const { body } = await http.get(firstRecoveryToken.uri);

  const attributes = getAttributesFromNFT(body);

  if (!attributes.cipherText || !attributes.initializationVector) {
    log(
      `Warning: could not get cipherText or initializationVector from recovery token!`
    );
    return null;
  }

  return {
    cipherText: attributes.cipherText as string,
    initializationVector: attributes.initializationVector as string,
  };
};
