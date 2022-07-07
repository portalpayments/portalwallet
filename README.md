# vmwallet

## A crypto wallet for regular people

![example workflow](https://github.com/mikemaccana/vmwallet/actions/workflows/tests/badge.svg)

## Development

See [coding guidelines](CODING_GUIDELINES.md).

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
