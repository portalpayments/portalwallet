# Portal Wallet


## A crypto wallet for regular people

[![Build status](https://github.com/portalwallet/portalwallet/actions/workflows/tests.yaml/badge.svg)](https://github.com/portalwallet/portalwallet/actions)

## Development

See [coding guidelines](CODING_GUIDELINES.md).

Also note re: servic workers - we currently don't use vite, https://crxjs.dev/ seems to be th best way to build service workers with vite, but has issues https://github.com/crxjs/chrome-extension-tools/issues/617

## To package the Web Extension 

### Make zip file

```
npm run make-zip-file
```

## For browser work

### Install packages

`npm i`

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

# Compute budget program

export COMPUTE_BUDGET_PROGRAM="ComputeBudget111111111111111111111111111111"
solana program dump -u m ${COMPUTE_BUDGET_PROGRAM} memo_program.so

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

