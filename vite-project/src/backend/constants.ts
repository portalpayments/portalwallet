import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN as BigNumber } from "bn.js";

export const IDENTITY_TOKEN_NAME = "Portal Identity Token";

// Shaq is one of the only people I know
// with a verified Twitter handle and a Solana wallet.
export const SHAQS_WALLET = "gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv";
export const JOE_MCCANNS_WALLET =
  "5CJFJoKiZ14tdsjtWgKGQVuVkYW7pcWUR4LFSvDELFod";
export const KEVIN_ROSES_WALLET =
  "3ikkFnEDBvUXPHfCmvXma4qBGZxMooveQ5eM6LLQgeuQ";

export const MIKES_WALLET = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
export const VAHEHS_WALLET = "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG";
export const PORTAL_IDENTITY_TOKEN_ISSUER_WALLET =
  "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9";

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

// From https://www.circle.com/en/usdc/developers
export const USDC_MAINNET_MINT_ACCOUNT =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// https://developers.circle.com/docs/usdc-on-testnet#usdc-on-solana-testnet
export const USDC_SOLANA_SPL_TOKEN_ON_DEVNET =
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export const URLS = {
  // From https://solanacookbook.com/references/local-development.html#connecting-to-environments
  localhost: "http://127.0.0.1:8899",
  // From https://solanacookbook.com/references/local-development.html#starting-a-local-validator
  devNet: clusterApiUrl("devnet"),
  mainNetBeta: clusterApiUrl("mainnet-beta"),
  testNet: clusterApiUrl("testnet"),
  // From https://www.quicknode.com/endpoints/49328
  quickNodeDevNet:
    "https://red-aged-dream.solana-devnet.quiknode.pro/cb0472330c14ad913e8a4430c70c182570f96047/",
  // From https://shdw.genesysgo.com/genesysgo/the-genesysgo-rpc-network
  // The SSC DAO network handles both https and wss connections. It provides unlimited data, global DNS load balancing for the lowest latency possible, backed by 300+ bare metal servers in 9 countries across 3 different continents. Additionally, the SSC DAO network has the full ledger history back to the genesis block.
  genesysGoMain: "https://ssc-dao.genesysgo.net/",
  genesysGoDevNet: "https://devnet.genesysgo.net/",
};

export const USD_DECIMALS = 2;

export const SOL = LAMPORTS_PER_SOL;

// Older were minted with test storage URLs, timed out, etc.
export const LATEST_IDENTITY_TOKEN_VERSION = 6;

// Oldest that's acceptable to use in UI
export const MINIMUM_IDENTITY_TOKEN_VERSION = LATEST_IDENTITY_TOKEN_VERSION;

// TODO: reducing this to 1_000 makes wallets not visible
// which seems to be the rent requirement -
// see https://docs.solana.com/developing/programming-model/accounts#rent
// but too many lamports may hit airdrop limit for some test networks.
export const DEPOSIT = 1_000_000;

export const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;
export const NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN = 500_000;

export const USD = Number(`1e${USD_DECIMALS}`);

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
