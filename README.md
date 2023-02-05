# Portal Wallet

Portal is a DeFi wallet with a built-in real-human identity layer that makes using Solana similar to traditional payment apps. 

[![Build status](https://github.com/portalwallet/portalwallet/actions/workflows/tests.yaml/badge.svg)](https://github.com/portalwallet/portalwallet/actions)

## Verified recipients through Portal’s Identity Token

Portal’s payment flow uses real-human identity verification to allow senders to have complete confidence about who will receive their money before they hit the ‘Send’ button.

## Wallet-To-Wallet Messaging

Portal uses Dialect to offer wallet-to-wallet messaging and p2p payments through a single chat-like interface. Right now people typically switch between crypto wallets and other apps, which means users have to make sure the people involved, and the amounts discussed, remain the same. Putting payments and messaging together means Portal’s users can communicate with their contacts before and after sending and recieving money. 

<img src="readme-images/contact-chat.png" alt="Chatting with a contact" />

Additionally, Portal uses the integrated chat feature to offer customer support to its users right from within the Portal app. Users can contact the Portal support team from the settings page.

<img src="readme-images/support-chat.png" alt="A support cat with the Portal Company" />

## Human Readable and Searchable Transaction History
Portal has a human readable bank-like transaction history, with recipient names and transaction notes. It also allows the users to search through the history, find a specific transaction, an array of transactions or a receipt.

<img src="readme-images/transactions-list.png" alt="A list of transactions" />

## Ultrafast Transactions

Portal makes use of Solana's recent update, transaction priority fees, to enable ultrafast transactions. Currently, the average transaction on Portal takes about 2 seconds to go through. 

<img src="readme-images/sending-payment.png" alt="Sending a payment" />
<img src="readme-images/payment-sent.png" alt="Sent a payment" />

## Portal is For Everyone
Portal is a wallet with a strong focus on transfers and payments, and is built to be used by everyone.


# Development

See [coding guidelines](CODING_GUIDELINES.md).

Also note re: service workers - we currently don't use vite, https://crxjs.dev/ seems to be the best way to build service workers with vite, but has issues https://github.com/crxjs/chrome-extension-tools/issues/617

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
