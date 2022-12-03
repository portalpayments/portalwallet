# Portal Wallet

**[Investors - see README-TEST-WALLET.md](./README-TEST-WALLET.md)**

## A crypto wallet for regular people

[![Build status](https://github.com/mikemaccana/vmwallet/actions/workflows/tests.yaml/badge.svg)](https://github.com/portalwallet/portalwallet/actions)

## Development

See [coding guidelines](CODING_GUIDELINES.md).

## To package the Web Extension and run a User Test

> ⚠️ WHEN DONE, CLOSE THE TERMINAL WINDOW. OTHERWISE YOU WILL MINT ADDITIONAL TOKENS WHEN YOU ARE RUNNING TESTS.

In the top level of this repo (eg, where this `README.md` file is):

### Make zip file

```
npm run make-zip-file
```

### Get Selfie and Wallet Address from User

Save the selfie as a `jpeg` or `png` image in the top level of this repo.

### Set options for identity token

Then edit `src/backend/mint-identity-token.test.ts` with the wallet address, first name, etc.

Eg:

```
const WALLET_ADDRESS = "2R1Qv2fDwfBo9XtMxS1Ca6EhrW7nmczYyATpuLcr6N1p";
const GIVEN_NAME = "Janet";
const FAMILY_NAME = "Testuser";
const IMAGE_FILE = "janet.jpeg";
```

### Make identity token

Then **open a new terminal** and run:

```
export MINT_IDENTITY_TOKENS_USING_TEST_HACK='true'
npx jest src/backend/mint-identity-token.test.ts
```

> ⚠️ WHEN DONE, CLOSE THE TERMINAL WINDOW. OTHERWISE YOU WILL MINT ADDITIONAL TOKENS WHEN YOU ARE RUNNING TESTS.

## For browser work

### Start the development server

`npm run dev`

## To test the Web Extension

```
npm run build
```

Then in Chrome / Edge etc, click **manage Extensions**, turn on **Developer Mode**, **Load unpacked** and pick the `dist` folder.

## For tests

You'll need an `.env` file with:

```
TWITTER_API_KEY_BEARER_TOKEN=somebearertoken
SECRET_KEY=somesecretkeyextractedfromphantom
```

Ask your colleagues for a copy of this file (not checked into GitHub for security reasons).

Install [a local validator](https://solanacookbook.com/references/local-development.html#starting-a-local-validator):

```

sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="~/.local/share/solana/install/active_release/bin:$PATH"

```

Then run:

```

npm run start-validator

```

## How to save Token Metadata & Memo programs for use on localhost

From https://solanacookbook.com/references/local-development.html#how-to-load-accounts-from-mainnet
and https://solana.stackexchange.com/questions/1879/metaplex-create-fails-on-localhost-with-attempt-to-load-a-program-that-does-n/1887#1887

```bash

# Token Metadata program

export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
solana program dump -u m ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} metaplex_token_metadata_program.so

# Memo program

export MEMO_PROGRAM_ADDRESS="MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
solana program dump -u m ${MEMO_PROGRAM_ADDRESS} memo_program.so

```

## How the Portal Identity Token works

### Getting verified

1. There's a mint account with a small balance of Sol
2. The mint account mints a Portal Identity Token (which is an NFT) directly to a recipient's wallet

### Verifying a user

1. The verifying account looks for a ATA for the portal identity token mint on the recipient account
2. We then read the token and check:

- That the token has been signed by our mint account
- That the token is for our recipient account

## How the portal verification token works

1. We have a personal phrase and a password
2. We make a new random IV
3. We use the personal phrase and the password and the IV to create some entropy/a key
4. The portal identity token stores:

- The IV [it's OK to store the IV](https://security.stackexchange.com/questions/17044/when-using-aes-and-cbc-is-it-necessary-to-keep-the-iv-secret)
- The secret key, encrypted with the entropy

## Minting

Each mint has a single accounts - the docs at https://solanacookbook.com/references/token.html#how-to-get-a-token-mint.

New tokens are issued directly into users Associated Token Accounts. For example: some USDC is minted directly into Joe User's USDC wallet.

```
HD keypair
  HD Wallet 1 (keypair generated from HD keypairs) [owned by system account] - Mike MacCana
    Native Token Account
    SPL Token account for USDC (associated with USDCs mint) [owned by HD wallet 1]
      USDC
    SPL Token account for an NFT (associated with the NFTs mint) [owned by HD wallet 1]
      NFT
  HD Wallet 2 (keypair generated from HD keypairs) - Anonymous
    Native Token Account
    SPL Token account for USDC (associated with USDCs mint)
      USDC

```

## References

- https://yihau.github.io/solana-web3-demo/tour/create-keypair.html
- https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://solana-labs.github.io/solana-web3.js/
- https://solana-labs.github.io/wallet-adapter/example/
  https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://buildspace.so/
- https://crypto.stackexchange.com/questions/11269/can-keys-from-bitcoins-hierarchical-deterministic-wallets-be-correlated-reduci

### TODO

Make logout a different color

Add version number to settings page

Maybe try gradient underline
Try just using face for link with blue bordwer
