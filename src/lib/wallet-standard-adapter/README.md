## Solana Wallet Standard

The name of this packagew was originally `@solana/wallet-standard-ghost`. 

The instructions at https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md ask us to rename it it `portal` but it has no Portal code in it so we refuse to do that.

https://github.com/wallet-standard/wallet-standard

It seems to have a shitty wallet in it. There is 

## Usage
```ts
// Import the `initialize` function from your wallet-standard package.
import { registerWallet } from './register.js';
import { GhostWallet } from './wallet.js';
import type { Ghost } from './types.js';

// Create a reference to your wallet's existing API.
const portal = new Portal();

// Register your wallet using the Wallet Standard, passing the reference.
registerWallet(new GhostWallet(ghost));

// Attach the reference to the window, guarding against errors.
try {
  Object.defineProperty(window, 'portal', { value: portal });
}
catch (error) {
  console.error(error);
}
```
