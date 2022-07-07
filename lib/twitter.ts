import { PublicKey, clusterApiUrl, Connection } from "@solana/web3.js";
import { getHandleAndRegistryKey } from "@bonfida/spl-name-service";
import { URLS } from "./constants";

export const getHandleAndRegistryKeyForWallet = async (wallet: string) => {
  const connection = new Connection(URLS["mainNetBeta"]);
  // Pubkey of the wallet you want to retrieve the Twitter handle
  const pubkey = new PublicKey(wallet);

  return getHandleAndRegistryKey(connection, pubkey);
};
