import { PublicKey, Connection } from "@solana/web3.js";
import { getHandleAndRegistryKey } from "@bonfida/spl-name-service";
import { URLS } from "./constants";
import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";
import dotenv from "dotenv";
import { log, stringify } from "./functions";

dotenv.config();

let _twitterClient: TwitterApiReadOnly | null;

export const getHandleForWallet = async (wallet: string) => {
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

export const checkIsVerified = async (handle: string) => {
  // Instantiate with desired auth type (here's Bearer v2 auth)
  if (!_twitterClient) {
    let bearerToken = process.env.TWITTER_API_KEY_BEARER_TOKEN || null;
    if (!bearerToken) {
      throw new Error(
        `Please set TWITTER_API_KEY_BEARER_TOKEN (see README.md for details)`
      );
    }
    // Tell typescript it's a readonly app
    _twitterClient = new TwitterApi(bearerToken).readOnly;
  }

  // Play with the built in methods
  const user = await _twitterClient.v2.userByUsername(handle, {
    "user.fields": "verified",
  });
  return user.data.verified || null;
};

export const checkIsWalletVerifiedViaTwitter = async (wallet: string) => {
  const handle = await getHandleForWallet(wallet);
  if (!handle) {
    return null;
  }
  return checkIsVerified(handle);
};
