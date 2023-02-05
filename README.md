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
