import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN as BigNumber } from "bn.js";
import type { Currency, CurrencyDetails } from "../backend/types";
import { mintToCurrencyMap } from "./mint-to-currency-map";

export const IDENTITY_TOKEN_NAME = "Portal Identity Token";

// Shaq is one of the only people I know
// with a verified Twitter handle and a Solana wallet.
export const SHAQS_WALLET = "gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv";
export const JOE_MCCANNS_WALLET =
  "2EfiRdR97jnSknN7KiVwGqXATvuSgGiTypMdiwXxBbxh";
export const KEVIN_ROSES_WALLET =
  "3ikkFnEDBvUXPHfCmvXma4qBGZxMooveQ5eM6LLQgeuQ";

export const MIKES_WALLET = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
export const VAHEHS_WALLET = "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG";

export const MIKES_USDC_ACCOUNT = "Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc";
export const MIKES_USDH_ACCOUNT = "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2";
export const MIKES_USDT_ACCOUNT =
  "4JP7SxrFfQdGEarcGFwRx6S8WMTeP9MthrcCWXddJQVj";

export const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

// https://docs.lightprotocol.com/
export const LIGHT_PROGRAM = "2c54pLrGpQdGxJWUAoME6CReBrtDbsx5Tqx4nLZZo6av";

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

// Made by Vaheh 20221116
export const UNVERIFIED_ADDRESS =
  "9KbuEUjtkCgZYvZ8jKtyF97hHDCubUcE3UnakDUPeQbJ";

export const YCOMBINATOR_DEMO_WALLET_FOR_JARED =
  "Adyu2gX2zmLmHbgAoiXe2n4egp6x8PS7EFAqcFvhqahz";

export const PORTAL_IDENTITY_TOKEN_ISSUER_WALLET =
  "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9";

export const JOHN_TESTUSER_DEMO_WALLET =
  "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7";

export const GREGS_WALLET = "CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs";

export const SOLANA_SPACES_WALLET =
  "4iDRFnp2N4UAsZEePHAxs7ozBanQcGtLYd12HG2HJm4s";

export const DECAF_PROMO_WALLET =
  "AAB98aGddTYoprM78e5i3fxYwCr98fAToDH19WU6vJQ3";

// Artist that made Agiza and Kimzo
export const ARTIST = new PublicKey(
  "9z8XUe1ak38Pg6MBnHgKB2riUN3sUSgyNL1Dzw179hTX"
);

// From https://docs.solana.com/integrations/exchange
export const SOLANA_WALLET_REGEX = "[1-9A-HJ-NP-Za-km-z]{32,44}";

// https://solscan.io/account/HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP
export const AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT =
  "HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP";
// Solscan calls this the 'SPL Token Address'
export const AGIZA_NFT_ADDRESS = new PublicKey(
  "8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk"
);

// https://solscan.io/account/6YDDeYLruEUeeJ1Y2GDXQ1wSrr4wJvZZefiVEtcsnpCp
export const KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT =
  "6YDDeYLruEUeeJ1Y2GDXQ1wSrr4wJvZZefiVEtcsnpCp";
export const KIMZO_NFT_ADDRESS = new PublicKey(
  "C5veJJL3hUq9s3aUymWjREGYoqbWSzX8aNRaZ9STSCNM"
);

export const WRAPPED_SOL_MAINNET_MINT_ACCOUNT =
  "So11111111111111111111111111111111111111112";

// From https://www.circle.com/en/usdc/developers
export const USDC_MAINNET_MINT_ACCOUNT =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// 'USDH ID' from https://docs.hubbleprotocol.io/resources/technical-resources
export const USDH_MAINNET_MINT_ACCOUNT =
  "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX";

// From https://tether.to/en/supported-protocols/
export const USDT_MAINNET_MINT_ACCOUNT =
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

// https://developers.circle.com/docs/usdc-on-testnet#usdc-on-solana-testnet
export const USDC_SOLANA_SPL_TOKEN_ON_DEVNET =
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// https://orca-so.gitbook.io/orca-developer-portal/whirlpools/interacting-with-the-protocol/orca-whirlpools-parameters
export const ORCA_WHIRLPOOL_MAINNET_ACCOUNT =
  "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

export const JUPITER = "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB";

// https://solana.com/rpc
export const URLS = {
  // From https://solanacookbook.com/references/local-development.html#connecting-to-environments
  localhost: "http://127.0.0.1:8899",
  // From https://solanacookbook.com/references/local-development.html#starting-a-local-validator
  devNet: clusterApiUrl("devnet"),
  mainNetBeta: clusterApiUrl("mainnet-beta"),
  testNet: clusterApiUrl("testnet"),
  // From https://www.quicknode.com/endpoints/49328
  quickNodeMainNetBeta:
    "https://proportionate-greatest-needle.solana-mainnet.quiknode.pro/",
  quickNodeMainNetBetaBackup:
    "https://orbital-polished-rain.solana-mainnet.quiknode.pro/aa92ba0b474b53f9ee8473aaa0a0370ef3dcfb0e/",
};

export const HELIUS_RPC_URL =
  "https://rpc.helius.xyz/?api-key=9e66be52-acf4-44a1-8bbe-a9852f8ab3c7";

export const DECAF_APP = "dcafKdWLATod3BLRngsqZ7CrQwcrUxrLjFWYJwYP1Fy";

export const SOLANA_DECIMALS = Math.log10(LAMPORTS_PER_SOL);

export const SOL = LAMPORTS_PER_SOL;

export const NOT_FOUND = -1;

export const EMPTY = "";

export const getCurrencyBySymbol = (name: string) => {
  return (
    Object.values(mintToCurrencyMap).find(
      (currencyDetails: CurrencyDetails) => {
        return currencyDetails.symbol === name;
      }
    ) || null
  );
};

export const getMintAddressBySymbol = (symbol: string) => {
  return getCurrencyBySymbol(symbol).mintAddress;
};

export const getCurrencyByMint = (mint: string) => {
  const isKnownCurrency = Object.hasOwn(mintToCurrencyMap, mint);
  if (!isKnownCurrency) {
    throw new Error(`Unknown currency for mint '${mint}'`);
  }
  return mintToCurrencyMap[mint];
};

export const getCurrencySymbolByMint = (mint: string) => {
  const currency = getCurrencyByMint(mint);
  return currency.symbol;
};

// Older were minted with test storage URLs, timed out, etc.
export const LATEST_IDENTITY_TOKEN_VERSION = 7;

// Oldest that's acceptable to use in UI
export const MINIMUM_IDENTITY_TOKEN_VERSION = LATEST_IDENTITY_TOKEN_VERSION;

// TODO: reducing this to 1_000 makes wallets not visible
// which seems to be the rent requirement -
// see https://docs.solana.com/developing/programming-model/accounts#rent
// but too many lamports may hit airdrop limit for some test networks.
export const DEPOSIT = 1_000_000;

export const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;
export const NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN = 500_000;

// BIP44
// From https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#purpose
export const PURPOSE = 44;

// From https://github.com/satoshilabs/slips/blob/master/slip-0044.md
export const SOLANA_COIN_TYPE = 501;

// Per https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#change
// Constant 0 is used for external chain and constant 1 for internal chain (also known as change addresses). External chain is used for addresses that are meant to be visible outside of the wallet (e.g. for receiving payments).
export const EXTERNAL_CHAIN = 0;

// From https://solana-labs.github.io/solana-web3.js/classes/Keypair.html#fromSeed
// 'Generate a keypair from a 32 byte seed.'
export const SOLANA_SEED_SIZE_BYTES = 32;

export const MILLISECOND = 1;
export const MILLISECONDS = MILLISECOND;

export const SECOND = 1000;
export const SECONDS = SECOND;

export const MINUTE = 60 * SECONDS;
export const MINUTES = MINUTE;

// Make zero and one work
// Hopefully one day BigNumber will be replaced by BigInt (which is native to JS)
export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

// https://solscan.io/account/11111111111111111111111111111111
export const SOLANA_SYSTEM_PROGRAM = new PublicKey(
  "11111111111111111111111111111111"
);

// The standard Solana SPL MEMO program
export const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

// Similar to MEMO but added by Glow (has a longer length)
export const NOTE_PROGRAM = "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93";
