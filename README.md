# Portal Wallet

Portal is a wallet with a strong focus on transfers and payments, and is built to be used by everyone.

[![Build status](https://github.com/portalwallet/portalwallet/actions/workflows/tests.yaml/badge.svg)](https://github.com/portalwallet/portalwallet/actions)

## Portal is alpha software

We don't recommend you use Portal as your main Solana wallet yet.

## Want to contribute?

See [contributing](CONTRIBUTING.md) and [coding guidelines](CODING_GUIDELINES.md) to get started building!

## For browser development

### Install packages

`npm i`

### Start the development server

`npm run dev`

## To test the Web Extension

```
npm run build
```

Then in Chrome / Edge etc, click **manage Extensions**, turn on **Developer Mode**, **Load unpacked** and pick the `dist` folder.


## To package the Web Extension 

### Make zip file

```
npm run make-zip-file
```

## For tests

You'll need an `.env` file. Ask your colleagues for a copy of this file (not checked into GitHub for security reasons).

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

```
npm run update-on-chain-programs
```

