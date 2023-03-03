import { PublicKey, Connection } from "@solana/web3.js";
import {
  getTwitterRegistry,
  getHandleAndRegistryKey,
} from "@bonfida/spl-name-service";
import { MIKES_WALLET, URLS } from "./constants";
import type { TwitterApiReadOnly } from "twitter-api-v2";
import dotenv from "dotenv";
// https://www.npmjs.com/package/@onsol/tldparser

dotenv.config();

let _twitterClient: TwitterApiReadOnly | null;

export const walletToTwitterHandle = async (wallet: string) => {
  const connection = new Connection(URLS["mainNetBeta"]);
  // Pubkey of the wallet you want to retrieve the Twitter handle
  const pubkey = new PublicKey(wallet);

  try {
    const [handle, _RegistryKey] = await getHandleAndRegistryKey(
      connection,
      pubkey
    );

    return handle;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    // They SNS user just doesn't have a Twitter reverse mapping set up
    // This is super common
    if (error.message === "Invalid reverse Twitter account provided") {
      return null;
    }
    // An unexpected error
    throw error;
  }
};

export const twitterHandleToWallet = async (
  connection: Connection,
  twitterHandle: string
) => {
  const registry = await getTwitterRegistry(connection, "mikemaccana");
  return registry.owner.toString();
};

export const resolveAnyName = async (string: String) => {
  // Try .sol
  // Try .twitter
  // Try .abc
  // Try .glow
  // Try .backpack
};

export const closeConnection = async () => {
  if (!_twitterClient) {
    return;
  }
  // TODO: close socket when issue below is resolved
  // See https://github.com/PLhery/node-twitter-api-v2/issues/326
  return;
};
