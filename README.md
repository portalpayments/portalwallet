# Portal Wallet

## A crypto wallet for regular people

![Build status](https://github.com/mikemaccana/vmwallet/actions/workflows/tests.yaml/badge.svg)

## Minting

Each mint has two accounts - the docs at https://solanacookbook.com/references/token.html#how-to-get-a-token-mint use a couple of terms, so to clarify:

1. Mint account - mints tokens
2. Token account - holds tokens. Usually made via Associated Token Accounts.

```
Keypairs
  Wallets
    Native Token Account
    USDC Account
      USDC
    Other Account
      Other token
```

## Development

See [coding guidelines](CODING_GUIDELINES.md).

You'll need an `.env` file with:

```
TWITTER_API_KEY_BEAyt of this file (not checked into GitHub for security reasons).

Install [a local validator](https://solanacookbook.com/references/local-development.html#starting-a-local-validator):

```

sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="~/.local/share/solana/install/active_release/bin:$PATH"

```

Then run:

```

solana-test-validator

```

## References

- https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://solana-labs.github.io/solana-web3.js/
- https://solana-labs.github.io/wallet-adapter/example/
  https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
- https://buildspace.so/
- https://crypto.stackexchange.com/questions/11269/can-keys-from-bitcoins-hierarchical-deterministic-wallets-be-correlated-reduci
```
