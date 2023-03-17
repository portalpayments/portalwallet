## Contributing

Portal uses current generation web tech. 

 - The frontend is built using **Svelte** and **TypeScript**. See `src`.

 - Frontend components (`.svelte`) files are for display purposes only - most of the data is sorted, processed, filtered etc. on the 'backend for the frontend' stored in the `/src/backend` directory. The files in the `src/backend` directory do not involve the browser UI (DOM) at all, but are rather pure TypeScript, that can be iterated and tested on without using a browser.

 - Layout is handled by CSS Grid

 - The backend is, or course, the Solana blockchain.

 - Data is stored in **Svelte stores**, see `stores.ts`, where it can be accessed directly from any component that needs them without having to pass properties around. The Svelte store is the source of truth.

 - Some common concepts (see `types.ts`):
  - `AccountSummary` - an account (either for Sol, or an Associated Token account), and the transactions. Each user has a `NativeAccountSummary` (for Sol) and a list of `TokenAccountSummaries`.
  - `TransactionSummary` - a Solana `ParsedTransactionWithMeta` turned into a quick summary of who did what to who.
  - `Contact` - someone that owns a wallet, potentially with `VerifiedClaims` showing who they are, based on Portal identity Token.
 
 - A serviceworker is used for caching when running as a browser extension. This allows Portal to now have to fetch transaction information, account information etc from Solana each time the extension is clicked. Functions in the **store** will often check the serviceworker for cached data - if there's nothing in the cache, we'l ask Solana. Service workers in modern Chrome extensions don't actually run persistently - they're shut down after a little while. So the service worker often saves things to local storage, using the popular `LocalForage` library. Since service workers aren't persistent, it may be better to move saving data into the `stores.ts` and thus remove sending messages between the service worker and store at the expense of multithreading - we'll have to see! Also note re: service workers - we currently don't use vite, https://crxjs.dev/ seems to be the best way to build service workers with vite, but has issues https://github.com/crxjs/chrome-extension-tools/issues/617
 
See [coding guidelines](CODING_GUIDELINES.md).

### Tests

Tests are in jest. Note that logging is disabled in tests - comment out `jest.mock("./functions");` at the top of your test file to re-enable logging during TDD.

## Quick reminder of all Solana Accounts

https://whitepaper.metaplex.com/whitepaper.pdf

 - Wallet account: me
 - Associated token account: my account for this token
 - Mint account: where thi token is minted (controls supply)
 - For NFTs: metadata account (Creators, Collection, etc.)
 - For NFTs: Off chain metadata (traits)

Standards for off chain metadata are at: https://docs.metaplex.com/programs/token-metadata/token-standard#the-non-fungible-standard
