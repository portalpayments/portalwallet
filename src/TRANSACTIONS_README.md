# Portal Simple Transactions 

[Portal](https://getportal.app)'s Simple Transactions convert  `@solana/web3.js` transactions - the  `ParsedTransactionWithMeta` objects you get from `getTransactionsForAddress()` into human-readable transactions suitable for consumption by front end apps.

The library is in TypeScript with minimal dependencies.

## Example

### Before

A Solana `ParsedTransactionWithMeta`:

```typescript

```

### After 

```typescript

```

## Features
[Portal](https://getportal.app)'s wallet is aimed principally at payments and spending, rather than exotic options trading, digital art, or other popular activities. 

If you want to inspect transactions from on-chain programs that don't have their IDLs published or that aren't open-source, you should investigate [Helius' Enhanced Transactions API](https://docs.helius.xyz/api-reference/enhanced-transactions-api)

Portal Simple Transactions features include:

### Whether the user sent or recieved funds
'wallet A sent money to wallet B' isn't useful to end users. Users want to know whether they're getting or receiving money (or swapping their own tokens). When sproducing simple  transactions, we take both a transaction and a user's wallet address to provide a `direction` from that wallet's point of view.   
  - `0` Send
  - `1` Recieved
  - `2` Swapped

### Handle note and memos
Solana transactions can have notes and **note** or **memos** - attached  - little messages like 'thanks for the beer'. These are public, and you can use them like Venmo (as a public statement of what the transaction was for) or as a pointer to something private (like a receipt sent via wallet-to-wallet messaging).

### Proper handling of money
Our background is making trading apps. Because humans work in decimal, and computers work in binary, and because it's really hard to represent 0.1 in binary, money should *always* handled in **minor units** (like cents for USD, pence for GBP, wei for Ethereum, lamports for Solana). Portal Simple Transactions always uses whole `number`s. We looked at other transaction summary tools and they send figures using decimal point `number`s - these  won't because other tools inevitably try and do maths with them and fail due to decimal / binary issues!
Simple Transactions always uses whole numbers.

### Experimental: itemised receipts for physical items
Portal Simple Transactions can show users what they purchased at retail, using Decaf point of sale:

This uses the Dialect SDK for wallet-to-wallet messaging. As walled-to-wallet messages are encrypted, you'll need user's the private key. This is considered experimental as:
 - The message recieved in  
 - You'll also need a CORS proxy to request the receipt from Decaf. 
   
### Tools to display crypto consistently with fiat

USDC has 9 decimal places. USD has two. In many cases, particularly when dealing with amounts more than 1 cent, it's useful to be able to display USDC in a manner consistent with USD.

Using `getMajorAndMinor()`,  `2000000000` USDC is properly displayed as `"2.00"`. `200000000` USDC is properly displayed as `"0.20"`. You may even want to format it as something like `0.20`

## Usage

### Get a simple transaction for a `ParsedTransactionWithMeta`


### Get a simple transactions for multiple `ParsedTransactionWithMeta`s

## 