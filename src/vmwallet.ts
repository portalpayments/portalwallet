import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { log } from "./functions";
import { URLS, USDC_MAINNET_MINT_ACCOUNT } from "./constants";
import base58 from "bs58";

export const getKeypairFromString = (privateKeyString: string) => {
  let decodedPrivateKey: Buffer;
  try {
    decodedPrivateKey = base58.decode(privateKeyString);
  } catch (throwObject) {
    throw new Error("Invalid private key! See README.md");
  }
  return Keypair.fromSecretKey(decodedPrivateKey);
};

export const getUSDCAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  usdcMintAccount = USDC_MAINNET_MINT_ACCOUNT
) => {
  let parsedTokenAccountsByOwner =
    await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(usdcMintAccount),
    });
  return parsedTokenAccountsByOwner.value;
};

export const connect = async (
  networkName: keyof typeof URLS
): Promise<Connection> => {
  log(`⚡ Connecting to ${networkName}`);
  const connection = new Connection(URLS[networkName], "confirmed");
  return connection;
};

// See https://github.com/Bonfida/bonfida-utils/blob/main/js
export const checkAccountExists = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<boolean> => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    return false;
  }
  return true;
};

export const getAccountBalance = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  let accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    throw new Error(`Could not find account '${publicKey}'`);
  }
  log("💰 Account balance:", accountInfo.lamports);
  return accountInfo.lamports;
};

export const putSolIntoWallet = async (
  connection: Connection,
  publicKey: PublicKey,
  lamports: number
) => {
  log(`💸 Putting Sol into wallet`);
  // Generate a new wallet keypair and airdrop SOL
  var airdropSignature = await connection.requestAirdrop(publicKey, lamports);

  const latestBlockHash = await connection.getLatestBlockhash();

  //wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};
