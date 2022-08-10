import { clusterApiUrl } from "@solana/web3.js";

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

// TODO: reducing this to 1_000 makes wallets not visible
// which seems to be the rent requirement -
// see https://docs.solana.com/developing/programming-model/accounts#rent
// but too many lamports may hit airdrop limit for some test networks.
export const DEPOSIT = 1_000_000;
// Likewise 1_000_000 isn't enough to make a new token
export const NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000;

export const USD = Number(`1e${USD_DECIMALS}`);

// BIP44
// From https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#purpose
export const PURPOSE = 44;

// From https://github.com/satoshilabs/slips/blob/master/slip-0044.md
export const SOLANA_COIN_TYPE = 501;

// Per https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#change
// Constant 0 is used for external chain and constant 1 for internal chain (also known as change addresses). External chain is used for addresses that are meant to be visible outside of the wallet (e.g. for receiving payments).
export const EXTERNAL_CHAIN = 0;

// https://developers.circle.com/docs/usdc-on-testnet#usdc-on-solana-testnet
export const USDC_SOLANA_SPL_TOKEN_ON_DEVNET =
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// From https://solana-labs.github.io/solana-web3.js/classes/Keypair.html#fromSeed
// 'Generate a keypair from a 32 byte seed.'
export const SOLANA_SEED_SIZE_BYTES = 32;

export const SECOND = 1000;
export const SECONDS = SECOND;

export const MINUTE = 60 * SECONDS;
export const MINUTES = MINUTE;
