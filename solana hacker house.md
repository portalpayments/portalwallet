each acount is row in the table

anchor framework

rent - payment for stored data on blockchain

digest: "sha256"
encrypted: "2wHY9k33P24JS8NgZGfA2aBweeeBpPNbLMsGwkfHEA3CBKj5Y2Vr9ivBfa8etQpdFG6Ni1k2JMPLny1XHGahNGUjApBxMxKXCLb2bHuWVet5LU95CCcbgH3xysqdLhyLSdsKCpxdH32soknN7kMtN5FmS7CSSsa44vcuUxwi5PBMJGwrLY9ADZnJcAMt6K3xaL6aWvPN2bgMsw8jZTqQB8MRAQne551xD3kfdWFbfzAMJRZ2zePbDGKmch6zbVQVknkmgGN2bdVYt9JCDdBtiRWcrNezYjijk5iYrqj1gS2srRVT3SmMGE1DTk4hdnAMCP6yUAh7JFArVknQ9i8ZVUDBikQQJcoGRTYcTKaEMMxgScX2Pm66np6n6iNwk6AFpUQMJCEtq6yvPCGhqaEMiVaMgGh9Q7wyQLSwnFp2AZZLdCyRdgezFgJUeNmfyB2g9wRXsRmsN9WZDPfVCDcVkskAx3ZY71zPdDdpP"
iterations: 100000
kdf: "pbkdf2"
nonce: "Gop5qwkQf5B4JABigxfDvB7idM1ni6xUR"
salt: "4Pxr5mhyHMA8C43AKu2Yz5"

The key may be one of:

an ed25519 public key
a program-derived account address (32byte value forced off the ed25519 curve)
a hash of an ed25519 public key with a 32 character string

---

Bitcoin is currently using the secp256k1 curve (not ed25519)

## Demos

https://keybase.io/warp/warp_1.0.9_SHA256_a2067491ab582bde779f4505055807c2479354633a2216b22cf1e92d1a6e4a87.html
https://www.bitaddress.org
https://github.com/boomdev/billify2
https://vanity-eth.tk/

https://ethereum.stackexchange.com/questions/32482/is-there-a-simple-ethereum-address-generator-that-consists-only-of-private-key-a?newreg=e1d10ca3c4b2483cb7932001fb44460d

> however, that will generate a mnemonic and resulting crypto vault (using BIP39, then BIP32 and BIP44), and not just a single private-public key pair.

> Again, most wallets now use BIP32 which is a Hierarchal Deterministic (HD) wallet that uses extended public/private keys that can derive up to 2 billion wallet addresses (and if using BIP44, this is 2 billion per supported cryptocurrency), versus generating a single address tied to a public/private key pair.

Bip44makes a heirarchy where keys can ve used for multiple addresses each with their owm keys

web3auth - shards key between different identity prividers

## Torus ;/ web3auth

https://docs.tor.us/key-infrastructure/technical-architecture

https://docs.web3auth.io/overview/web3auth-and-wallets

## web3auth / shamir secret sharing

1 gmail / safari origin
2 discord / safari private browsing
3 gmail and safari different website

If this techdoesn't suck, 1 and 3 should have been the same wallet
