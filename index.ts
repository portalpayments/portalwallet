#!/usr/bin/env ts-node

// https://solana-labs.github.io/solana-web3.js/

// import { randomBytes } from "node:crypto";
// import { privateToPublic } from "ethereumjs-util";
import * as solanaWeb3 from "@solana/web3.js";
import * as crypto from "crypto";

const log = (object: unknown) {
  console.log(`>>>`, JSON.stringify(object, null, 2))
}

const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;
// (async function () {
  const convertPhraseToSeed = (phrase: string): Uint8Array => {
    // bitaddress.org / ninjawallet (really oldand lots of polyfills)
    // var seedString = Crypto.SHA256(key, { asBytes: true });

    const seedHashString = crypto.createHash('sha256').update(phrase)

    const seedBytes = Buffer.from(seedHashString)
    return seedBytes;
  };

  const seedToWallet = (seed: Uint8Array) => {
    // https://www.quicknode.com/guides/web3-sdks/how-to-create-an-address-in-solana-using-javascript

    // const privateKey = "0x" + randomBytes(32).toString("hex");
    // const publicKey = "0x" + privateToPublic(privateKey).toString("hex");

    // The keypair is the wallet!
    // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
    const wallet = solanaWeb3.Keypair.fromSeed(seed);

    return wallet
  };

  const putSolIntoWallet = (connection: solanaWeb3.Connection, publicKey: solanaWeb3.PublicKey) => {
    

    // Generate a new wallet keypair and airdrop SOL
    var airdropSignature = await connection.requestAirdrop(
      publicKey,
      solanaWeb3.LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    //wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
  };

  const seed = await convertPhraseToSeed(phrase);
  const wallet = await seedToWallet(seed);

  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet"),
    "confirmed"
  );

  log({
    public: wallet.publicKey.toString(),
    private: wallet.secretKey.toString(),
  })

  await putSolIntoWallet(connection, wallet.publicKey)
  
  let account = await connection.getAccountInfo(wallet.publicKey);
// })();
