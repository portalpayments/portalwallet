import { PublicKey, clusterApiUrl, Connection } from "@solana/web3.js";
import { getHandleAndRegistryKey } from "@bonfida/spl-name-service";
import { URLS } from "./constants";
import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";
import dotenv from "dotenv";
import { log, stringify } from "./functions";

dotenv.config();

let _twitterClient: TwitterApiReadOnly | null;

export const getHandleAndRegistryKeyForWallet = async (wallet: string) => {
  const connection = new Connection(URLS["mainNetBeta"]);
  // Pubkey of the wallet you want to retrieve the Twitter handle
  const pubkey = new PublicKey(wallet);

  return getHandleAndRegistryKey(connection, pubkey);
};

export const isVerified = async (handle: string) => {
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
    log(`🐦 Made new Twitter API client`);
  }

  // Play with the built in methods
  const user = await _twitterClient.v2.userByUsername(handle, {
    "user.fields": "verified",
  });
  log(stringify(user));
  return user.data.verified || null;
};
