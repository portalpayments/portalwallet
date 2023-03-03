import { PublicKey, Connection } from "@solana/web3.js";
import {
  getTwitterRegistry,
  getHandleAndRegistryKey,
} from "@bonfida/spl-name-service";
import { URLS } from "./constants";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import * as http from "../lib/http-client";
import { log, stringify } from "./functions";
import { TldParser } from "@onsol/tldparser";
import API from "api";

const glowAPI = API("@glowwallet/v1.0#145h1el95ur09a");

const removeExtension = (string: string, extension: string): string => {
  const extensionWithDot = `.${extension}`;
  if (string.endsWith(extensionWithDot)) {
    return string.split(extensionWithDot)[0];
  }
  return string;
};

// https://www.npmjs.com/package/@onsol/tldparser
export const dotAbcDotBonkOrDotPoorDomainToWallet = async (
  connection: Connection,
  dotAbcDotBonkOrDotPoorDomain: string
): Promise<String> => {
  const parser = new TldParser(connection);
  const ownerPublicKey = await parser.getOwnerFromDomainTld(
    dotAbcDotBonkOrDotPoorDomain
  );
  return ownerPublicKey.toBase58();
};

// https://docs.glow.app/reference/resolve-glow-id
export const dotGlowToWallet = async (
  dotGlowDomain: string
): Promise<String> => {
  const dotGlowUserName = removeExtension(dotGlowDomain, "glow");
  const response = await glowAPI.resolveGlowId({ handle: dotGlowUserName });
  const walletAddress = response?.data?.info?.resolved || null;
  return walletAddress;
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

export const dotBackpackToWallet = async (
  dotBackpackDomainName: string
): Promise<String> => {
  dotBackpackDomainName = removeExtension(dotBackpackDomainName, "backpack");
  const backpackAPIEndpoint = `https://backpack-api.xnfts.dev/users/primarySolPubkey/${dotBackpackDomainName}`;
  const responseBody = await http.get(backpackAPIEndpoint);
  const result = responseBody.publicKey || null;
  return result;
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

export const resolveAnyName = async (
  connection: Connection,
  string: string
) => {
  // This seems to be the nicest maintained and less land-grab naming service
  // It also has mutliple TLDs
  if (
    string.endsWith(".abc") ||
    string.endsWith(".bonk") ||
    string.endsWith(".poor")
  ) {
    return dotAbcDotBonkOrDotPoorDomainToWallet(connection, string);
  }
  if (string.endsWith(".sol")) {
    return dotSolDomainToWallet(connection, string);
  }
  if (string.endsWith(".glow")) {
    return dotGlowToWallet(string);
  }
  if (string.endsWith(".backpack")) {
    return dotBackpackToWallet(string);
  }
  if (string.startsWith("@")) {
    return twitterHandleToWallet(connection, string);
  }
  return null;
};

export const walletToTwitterHandle = async (wallet: string) => {
  const connection = new Connection(URLS["mainNetBeta"]);

  try {
    // Pubkey of the wallet you want to retrieve the Twitter handle
    const publickey = new PublicKey(wallet);

    const [handle, _RegistryKey] = await getHandleAndRegistryKey(
      connection,
      publickey
    );

    return handle;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message === "Invalid public key input") {
      return null;
    }
    // They SNS user just doesn't have a Twitter reverse mapping set up
    // This is super common
    if (error.message === "Invalid reverse Twitter account provided") {
      return null;
    }

    // An unexpected error
    throw error;
  }
};
