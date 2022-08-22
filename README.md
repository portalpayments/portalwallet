# Portal Wallet

## A crypto wallet for regular people

![Build status](https://github.com/mikemaccana/vmwallet/actions/workflows/tests.yaml/badge.svg)

## Development

See [coding guidelines](CODING_GUIDELINES.md).

You'll need an `.env` file with:

```
TWITTER_API_KEY_BEARER_TOKEN=somebearertoken
PRIVATE_KEY=someprivatekeyextractedfromphantom
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

## How to save Token Metadata program for use on localhost

From https://solanacookbook.com/references/local-development.html#how-to-load-accounts-from-mainnet
and https://solana.stackexchange.com/questions/1879/metaplex-create-fails-on-localhost-with-attempt-to-load-a-program-that-does-n/1887#1887

```bash

# Token Metadata program

export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
solana program dump -u m ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} metaplex_token_metadata_program.so

```

## Minting

Each mint has a single accounts - the docs at https://solanacookbook.com/references/token.html#how-to-get-a-token-mint.

New tokens are issued directly into users Associated Token Accounts. For example: some USDC is minted directly into Joe User's USDC wallet.

```
Keypairs
  Wallets
    Native Token Account
    USDC Account 1
      USDC
    USDC Account 2
      USDC
    Other Account
      Other token
```

## References

- https://yihau.github.io/solana-web3-demo/tour/create-keypair.html
- https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://solana-labs.github.io/solana-web3.js/
- https://solana-labs.github.io/wallet-adapter/example/
  https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://buildspace.so/
- https://crypto.stackexchange.com/questions/11269/can-keys-from-bitcoins-hierarchical-deterministic-wallets-be-correlated-reduci
