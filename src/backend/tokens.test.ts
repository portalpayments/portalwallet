// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { getMint, getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Account } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  SECONDS,
  ENOUGH_TO_MAKE_A_NEW_TOKEN,
  getCurrencyBySymbol,
} from "./constants";
import { log, minorUnitsToDecimal, stringify } from "./functions";
import {
  createMintAccount,
  mintTokens,
  makeTokenAccount,
  makeTransaction,
  getFeeForTransaction,
} from "./tokens";
import {
  connect,
  putSolIntoWallet,
  checkAccountExists,
  getTokenAccountsByOwner,
  getTransactionsForAddress,
} from "./wallet";
import type { BasicTokenAccount } from "./types";

// jest.mock("./functions");

const AMOUNT_OF_USDC_TO_SEND = 50;

// Our fake currency will have 6 decimals like USDC
const DECIMALS = getCurrencyBySymbol("USDC").decimals;

describe("minting and USDC-like transfers", () => {
  let connection: Connection;
  let testUSDCAuthority: Keypair;
  let mintAccountPublicKey: PublicKey;
  const alice = new Keypair();
  const bob = new Keypair();
  let alicesTokenAccount: BasicTokenAccount;
  let bobsTokenAccount: BasicTokenAccount;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(
    `createNewToken makes a mint account and new tokens`,
    async () => {
      testUSDCAuthority = new Keypair();
      await putSolIntoWallet(
        connection,
        testUSDCAuthority.publicKey,
        ENOUGH_TO_MAKE_A_NEW_TOKEN
      );

      mintAccountPublicKey = await createMintAccount(
        connection,
        testUSDCAuthority,
        testUSDCAuthority.publicKey,
        DECIMALS
      );
      const doesMintAccountExist = await checkAccountExists(
        connection,
        mintAccountPublicKey
      );
      expect(doesMintAccountExist).toBeTruthy();

      let mintInformation = await getMint(connection, mintAccountPublicKey);

      expect(mintInformation).toEqual({
        address: expect.any(PublicKey),
        decimals: DECIMALS,
        freezeAuthority: null,
        isInitialized: true,
        mintAuthority: testUSDCAuthority.publicKey,
        // Tokens when initially created by spl-token have no supply
        supply: 0n,
        tlvData: expect.anything(),
      });
    },
    30 * SECONDS
  );

  test(`we can make a token account for Alice`, async () => {
    alicesTokenAccount = await makeTokenAccount(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      alice.publicKey
    );

    expect(alicesTokenAccount.address).toBeInstanceOf(PublicKey);

    const alicesTokenAccountUpdated = await getAccount(
      connection,
      alicesTokenAccount.address
    );

    expect(alicesTokenAccountUpdated).toEqual({
      address: alicesTokenAccount.address,
      // No tokens are minted yet
      amount: 0n,
      closeAuthority: null,
      delegate: null,
      delegatedAmount: 0n,
      isFrozen: false,
      isInitialized: true,
      isNative: false, // It's an SPL token, not Sol.
      mint: mintAccountPublicKey,
      owner: alice.publicKey,
      rentExemptReserve: null,
      tlvData: expect.anything(),
    });

    // Redundant as we already have alicesTokenAccountUpdated.amount above, but let's
    // test getTokenAccountBalance() anyway
    let tokenAmount = await connection.getTokenAccountBalance(
      alicesTokenAccount.address
    );

    const NO_TOKENS_MINTED_YET = 0;
    expect(tokenAmount).toMatchObject({
      context: {
        slot: expect.any(Number),
      },
      value: {
        amount: String(NO_TOKENS_MINTED_YET),
        decimals: DECIMALS,
        uiAmount: NO_TOKENS_MINTED_YET,
        uiAmountString: String(NO_TOKENS_MINTED_YET),
      },
    });
  });

  test(`Can mint tokens into Alice's token account`, async () => {
    const MINT_AMOUNT = 420;
    const MINT_AMOUNT_UI = minorUnitsToDecimal(MINT_AMOUNT, DECIMALS);

    const transactionHash = await mintTokens(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      alicesTokenAccount.address,
      testUSDCAuthority.publicKey,
      MINT_AMOUNT,
      DECIMALS
    );

    expect(transactionHash).toEqual(expect.any(String));

    let alicesTokens = await connection.getTokenAccountBalance(
      alicesTokenAccount.address
    );

    expect(alicesTokens).toMatchObject({
      context: {
        slot: expect.any(Number),
      },
      value: {
        amount: String(MINT_AMOUNT),
        decimals: DECIMALS,
        uiAmount: MINT_AMOUNT_UI,
        uiAmountString: String(MINT_AMOUNT_UI),
      },
    });
  });

  test(`Can make a token account for bob`, async () => {
    await putSolIntoWallet(connection, bob.publicKey, 1_000_000_000);

    const balanceOfPayerBeforeMakingRecipientTokenAccount =
      await connection.getBalance(testUSDCAuthority.publicKey);

    bobsTokenAccount = await makeTokenAccount(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      bob.publicKey
    );

    log(
      `🆕 Made associated token account for Bob at address ${bobsTokenAccount.address}`
    );

    expect(bobsTokenAccount).toBeTruthy();

    const balanceOfPayerAfterMakingRecipientTokenAccount =
      await connection.getBalance(testUSDCAuthority.publicKey);

    log(
      `Balance of token account`,
      balanceOfPayerBeforeMakingRecipientTokenAccount,
      balanceOfPayerAfterMakingRecipientTokenAccount
    );

    const costOfMakingBobsTokenAccount =
      balanceOfPayerBeforeMakingRecipientTokenAccount -
      balanceOfPayerAfterMakingRecipientTokenAccount;

    const EXPECTED_COST_TO_MAKE_ACCOUNT = 2_044_280;

    expect(costOfMakingBobsTokenAccount).toEqual(EXPECTED_COST_TO_MAKE_ACCOUNT);
  });

  test(`Can send token from Alice's token account to Bob's token account`, async () => {
    // Alice needs some money to pay transaction fee to send the USDC
    await putSolIntoWallet(
      connection,
      alice.publicKey,
      ENOUGH_TO_MAKE_A_NEW_TOKEN
    );

    const transaction = await makeTransaction(
      connection,
      alicesTokenAccount.address,
      bob.publicKey,
      alice,
      AMOUNT_OF_USDC_TO_SEND,
      mintAccountPublicKey,
      "Cinema tickets"
    );

    const fee = await getFeeForTransaction(connection, transaction);

    expect(fee).toEqual(5000);

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [alice],
      {
        // https://solanacookbook.com/guides/retrying-transactions.html#facts
        maxRetries: 6,
      }
    );

    expect(signature);
  });

  test(`Can find Bob's USDC account from his regular account and he has recieved the money`, async () => {
    // See https://solana.stackexchange.com/questions/1685/how-do-i-prevent-open-handles-issues-when-using-the-solana-connection-object
    let parsedTokenAccountsByOwner =
      await connection.getParsedTokenAccountsByOwner(bob.publicKey, {
        mint: mintAccountPublicKey,
      });

    const firstAccount = parsedTokenAccountsByOwner.value[0];

    const UI_AMOUNT = minorUnitsToDecimal(AMOUNT_OF_USDC_TO_SEND, DECIMALS);

    expect(firstAccount).toEqual({
      // Bob's first (and only) USDC account
      account: {
        data: {
          parsed: {
            info: {
              isNative: false,
              // This is a USDC account
              mint: mintAccountPublicKey.toString(),
              // It is owned by Bob
              owner: bob.publicKey.toString(),
              state: "initialized",
              tokenAmount: {
                // Bob has recievd the fifty cents
                amount: String(AMOUNT_OF_USDC_TO_SEND),
                decimals: DECIMALS,
                uiAmount: UI_AMOUNT,
                uiAmountString: String(UI_AMOUNT),
              },
            },
            type: "account",
          },
          program: "spl-token",
          space: 165,
        },
        executable: false,
        lamports: 2039280,
        // The SPL token program
        owner: TOKEN_PROGRAM_ID,
        rentEpoch: expect.any(Number),
      },
      // Tested above
      pubkey: bobsTokenAccount.address,
    });
  });

  test(`Get all Bob's token accounts`, async () => {
    const tokenAccounts = await getTokenAccountsByOwner(
      connection,
      bob.publicKey
    );

    const tokenAccount = tokenAccounts[0];
    expect(tokenAccount.mint).toEqual(mintAccountPublicKey);
    expect(tokenAccount.amount).toEqual(50n);
  });

  test(`We can get previous transactions from Alice's wallet`, async () => {
    const transactions = await getTransactionsForAddress(
      connection,
      alice.publicKey,
      5
    );

    const lastTransaction = transactions[0];

    expect(lastTransaction).toBeTruthy();
  });
});
