import { PublicKey, type Connection } from "@solana/web3.js";
import {
  getAllDomains,
  getTwitterRegistry,
  getHandleAndRegistryKey,
  reverseLookup,
} from "@bonfida/spl-name-service";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import * as http from "../lib/http-client";
import { TldParser } from "@onsol/tldparser";
import type { MainDomain } from "@onsol/tldparser/dist/types/state/main-domain";
import { URLS } from "./constants";
import type { TwitterApiReadOnly } from "twitter-api-v2";
import dotenv from "dotenv";
// https://www.npmjs.com/package/@onsol/tldparser

dotenv.config();

const removeExtension = (string: string, extension: string): string => {
  const extensionWithDot = `.${extension}`;
  if (string.endsWith(extensionWithDot)) {
    return string.split(extensionWithDot)[0];
  }
  return string;
};

// https://www.npmjs.com/package/@onsol/tldparser
export const dotAbcDotBonkOrDotPoorToWallet = async (
  connection: Connection,
  dotAbcDotBonkOrDotPoorDomain: string
): Promise<string> => {
  const parser = new TldParser(connection);
  const ownerPublicKey = await parser.getOwnerFromDomainTld(
    dotAbcDotBonkOrDotPoorDomain
  );
  return ownerPublicKey.toBase58();
};

// https://www.npmjs.com/package/@onsol/tldparser
// Docs for this suck, so check out
// https://github.com/onsol-labs/tld-parser/blob/main/tests/tld-parser.spec.ts#L97
// getMainDomain() is what we want
export const walletToDotAbcDotBonkOrDotPoor = async (
  connection: Connection,
  wallet: PublicKey
): Promise<string> => {
  const parser = new TldParser(connection);
  let mainDomain: MainDomain;
  try {
    mainDomain = await parser.getMainDomain(wallet);
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("Unable to find MainDomain account")) {
      return null;
    }
  }
  if (!mainDomain?.domain) {
    return null;
  }
  // Yes the . is already included in the tld
  const domainString = `${mainDomain.domain}${mainDomain.tld}`;
  return domainString;
};

// https://docs.glow.app/reference/resolve-glow-id
// The 'API' node module has a bunch of issues running in the browser so just use http module directly
export const dotGlowToWallet = async (
  dotGlowDomain: string
): Promise<string> => {
  const dotGlowUserName = removeExtension(dotGlowDomain, "glow");
  const responseBody = await http.get(
    `https://api.glow.app/glow-id/resolve?handle=${dotGlowUserName}`
  );
  const walletAddress = responseBody?.info?.resolved || null;
  return walletAddress;
};

export const walletToDotGlow = async (wallet: PublicKey) => {
  const walletString = wallet.toBase58();
  const responseBody = await http.get(
    `https://api.glow.app/glow-id/resolve?wallet=${walletString}`
  );
  const dotGlowUsername = responseBody?.info?.handle || null;
  const dotGlow = `${dotGlowUsername}.glow`;
  return dotGlow;
};

// See https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-query-solana-naming-service-domains-sol/#set-up-your-environment
export const dotSolDomainToWallet = async (
  connection: Connection,
  dotSolDomain: string
): Promise<string> => {
  try {
    const { pubkey } = getDomainKeySync(dotSolDomain);
    const owner = (
      await NameRegistryState.retrieve(connection, pubkey)
    ).registry.owner.toBase58();
    return owner;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message === "Invalid name account provided") {
      return null;
    }
    throw error;
  }
};

// See https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-query-solana-naming-service-domains-sol/#reverse-lookup-find-all-domains-owned-by-a-wallet
export const walletToDotSol = async (
  connection: Connection,
  wallet: PublicKey
): Promise<string> => {
  try {
    const ownerWallet = new PublicKey(wallet);
    const allDomainKeys = await getAllDomains(connection, ownerWallet);
    if (!allDomainKeys.length) {
      return null;
    }
    const firstDomainKey = allDomainKeys[0];
    const domainKeyName = await reverseLookup(connection, firstDomainKey);
    const domainName = `${domainKeyName}.sol`;
    return domainName;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message === "Invalid wallet account provided") {
      return null;
    }
    throw error;
  }
};

export const dotBackpackToWallet = async (
  dotBackpackDomainName: string
): Promise<string> => {
  dotBackpackDomainName = removeExtension(dotBackpackDomainName, "backpack");
  const backpackAPIEndpoint = `https://backpack-api.xnfts.dev/users/primarySolPubkey/${dotBackpackDomainName}`;
  const responseBody = await http.get(backpackAPIEndpoint);
  const result = responseBody.publicKey || null;
  return result;
};

export const walletToDotBackpackDomain = async (
  wallet: PublicKey,
  jwt: string
): Promise<string> => {
  const walletString = wallet.toBase58();
  // const backpackAPIEndpoint = `https://backpack-api.xnfts.dev/users?usernamePrefix=${wallet}`;
  const backpackAPIEndpoint = `https://backpack-api.xnfts.dev/users?usernamePrefix=${walletString}`;
  const responseBody = await http.get(backpackAPIEndpoint, null, {
    cookie: `jwt=${jwt}`,
  });

  const users = responseBody?.users || null;
  if (!users?.length) {
    return null;
  }
  const firstUser = users[0];
  const username = firstUser.username;
  const domainName = `${username}.backpack`;
  return domainName;
};

export const twitterHandleToWallet = async (
  connection: Connection,
  twitterHandle: string
) => {
  // Normalise the @ symbol. We don't need it.
  if (twitterHandle.startsWith("@")) {
    twitterHandle = twitterHandle.slice(1);
  }
  try {
    const registry = await getTwitterRegistry(connection, twitterHandle);
    return registry.owner.toString();
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message === "Invalid name account provided") {
      return null;
    }
  }
};

export const walletToTwitterHandle = async (
  connection: Connection,
  wallet: PublicKey
) => {
  try {
    const [handle, _RegistryKey] = await getHandleAndRegistryKey(
      connection,
      wallet
    );

    return `@${handle}`;
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

export const resolveWalletName = async (
  connection: Connection,
  walletName: string
): Promise<string> => {
  // This seems to be the nicest maintained and less land-grab naming service
  // It also has multiple TLDs
  if (
    walletName.endsWith(".abc") ||
    walletName.endsWith(".bonk") ||
    walletName.endsWith(".poor")
  ) {
    return dotAbcDotBonkOrDotPoorToWallet(connection, walletName);
  }
  // Requires people to buy a custom token
  // and is complex to set up, but was more popular
  if (walletName.endsWith(".sol")) {
    return dotSolDomainToWallet(connection, walletName);
  }
  if (walletName.endsWith(".glow")) {
    return dotGlowToWallet(walletName);
  }
  if (walletName.endsWith(".backpack")) {
    return dotBackpackToWallet(walletName);
  }
  if (walletName.startsWith("@")) {
    return twitterHandleToWallet(connection, walletName);
  }
  return null;
};

export const resolveWalletAddress = async (
  connection: Connection,
  wallet: PublicKey
): Promise<string> => {
  // Order chosen to match resolveWalletName() above.
  const dotAbcOrBonkOrPoor = await walletToDotAbcDotBonkOrDotPoor(
    connection,
    wallet
  );
  if (dotAbcOrBonkOrPoor) {
    return dotAbcOrBonkOrPoor;
  }
  const dotSol = await walletToDotSol(connection, wallet);
  if (dotSol) {
    return dotSol;
  }
  const dotGlow = await walletToDotGlow(wallet);
  if (dotGlow) {
    return dotGlow;
  }
  return null;
};
