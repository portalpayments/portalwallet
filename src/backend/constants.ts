// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//

// This file has zero dependencies, so we can load it from the service worker etc.
const LAMPORTS_PER_SOL = 1_000_000_000;

export const IDENTITY_TOKEN_NAME = "Portal Identity Token";
export const RECOVERY_TOKEN_NAME = "Portal Recovery Token";

// Shaq is one of the only people I know
// with a verified Twitter handle and a Solana wallet.
export const SHAQS_WALLET = "gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv";
export const JOE_MCCANNS_WALLET = "2EfiRdR97jnSknN7KiVwGqXATvuSgGiTypMdiwXxBbxh";
export const KEVIN_ROSES_WALLET = "3ikkFnEDBvUXPHfCmvXma4qBGZxMooveQ5eM6LLQgeuQ";
export const VIDOR_SOLRISE_WALLET = "Hp8SsZZZot8UB28HTfEuxxCXECoSiwHfpzqwenjrMPKF";

export const MIKES_WALLET = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
export const VAHEHS_WALLET = "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG";

export const MIKES_USDC_ACCOUNT = "Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc";
export const MIKES_USDH_ACCOUNT = "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2";
export const MIKES_USDT_ACCOUNT = "4JP7SxrFfQdGEarcGFwRx6S8WMTeP9MthrcCWXddJQVj";

export const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const COMPUTE_BUDGET_PROGRAM = "ComputeBudget111111111111111111111111111111";

// From https://github.com/Squads-Protocol/squads-mpl#addresses
export const SQUADS_ADDRESS = "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu";

export const HELIUS = "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF";

// https://docs.lightprotocol.com/
export const LIGHT_PROGRAM = "2c54pLrGpQdGxJWUAoME6CReBrtDbsx5Tqx4nLZZo6av";

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

// Made by Vaheh 20221116
export const UNVERIFIED_ADDRESS = "9KbuEUjtkCgZYvZ8jKtyF97hHDCubUcE3UnakDUPeQbJ";

export const YCOMBINATOR_DEMO_WALLET_FOR_JARED = "Adyu2gX2zmLmHbgAoiXe2n4egp6x8PS7EFAqcFvhqahz";

export const PORTAL_IDENTITY_TOKEN_ISSUER_WALLET = "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9";

export const JOHN_TESTUSER_DEMO_WALLET = "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7";

export const GREGS_WALLET = "CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs";

export const SOLANA_SPACES_WALLET = "4iDRFnp2N4UAsZEePHAxs7ozBanQcGtLYd12HG2HJm4s";

export const DECAF_PROMO_WALLET = "AAB98aGddTYoprM78e5i3fxYwCr98fAToDH19WU6vJQ3";

// Artist that made Agiza and Kimzo
export const ARTIST = "9z8XUe1ak38Pg6MBnHgKB2riUN3sUSgyNL1Dzw179hTX";

// From https://docs.solana.com/integrations/exchange
export const SOLANA_WALLET_REGEX = "[1-9A-HJ-NP-Za-km-z]{32,44}";

// https://solscan.io/account/HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP
export const AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT = "HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP";
// Solscan calls this the 'SPL Token Address'
export const AGIZA_NFT_ADDRESS = "8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk";

// https://solscan.io/account/6YDDeYLruEUeeJ1Y2GDXQ1wSrr4wJvZZefiVEtcsnpCp
export const KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT = "6YDDeYLruEUeeJ1Y2GDXQ1wSrr4wJvZZefiVEtcsnpCp";
export const KIMZO_NFT_ADDRESS = "C5veJJL3hUq9s3aUymWjREGYoqbWSzX8aNRaZ9STSCNM";

export const WRAPPED_SOL_MAINNET_MINT_ACCOUNT = "So11111111111111111111111111111111111111112";

// From https://www.circle.com/en/usdc/developers
export const USDC_MAINNET_MINT_ACCOUNT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// 'USDH ID' from https://docs.hubbleprotocol.io/resources/technical-resources
export const USDH_MAINNET_MINT_ACCOUNT = "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX";

// From https://tether.to/en/supported-protocols/
export const USDT_MAINNET_MINT_ACCOUNT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

// https://developers.circle.com/docs/usdc-on-testnet#usdc-on-solana-testnet
export const USDC_SOLANA_SPL_TOKEN_ON_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// https://orca-so.gitbook.io/orca-developer-portal/whirlpools/interacting-with-the-protocol/orca-whirlpools-parameters
export const ORCA_WHIRLPOOL_MAINNET_ACCOUNT = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

export const ORCA_SOL_USDC = "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm";

export const JUPITER = "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB";

// https://solana.com/rpc
export const URLS = {
  // From https://solanacookbook.com/references/local-development.html#connecting-to-environments
  localhost: "http://127.0.0.1:8899",
  // From https://dev.helius.xyz/rpcs/my
  heliusMainNet: "https://rpc.helius.xyz/?api-key=9e66be52-acf4-44a1-8bbe-a9852f8ab3c7",
  // From https://www.quicknode.com/endpoints/110566
  quickNodeMainNetBeta:
    "https://orbital-polished-rain.solana-mainnet.discover.quiknode.pro/aa92ba0b474b53f9ee8473aaa0a0370ef3dcfb0e/",
};

export const DECAF_APP = "dcafKdWLATod3BLRngsqZ7CrQwcrUxrLjFWYJwYP1Fy";

export const SOLANA_DECIMALS = Math.log10(LAMPORTS_PER_SOL);

export const SOL = LAMPORTS_PER_SOL;

export const NOT_FOUND = -1;

export const EMPTY = "";

// Older were minted with test storage URLs, timed out, etc.
export const LATEST_IDENTITY_TOKEN_VERSION = 7;

// Oldest that's acceptable to use in UI
export const MINIMUM_IDENTITY_TOKEN_VERSION = 6;

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

// https://solscan.io/account/11111111111111111111111111111111
export const SOLANA_SYSTEM_PROGRAM = "11111111111111111111111111111111";

// The standard Solana SPL MEMO program
export const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

// Similar to MEMO but added by Glow (has a longer length)
export const NOTE_PROGRAM = "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93";
