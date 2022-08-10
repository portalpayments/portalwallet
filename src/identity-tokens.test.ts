import { Metaplex } from "@metaplex-foundation/js";
import { getMetaplex, mintIdentityToken } from "./identity-tokens";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { connect, putSolIntoWallet } from "./vmwallet";
import { log } from "./functions";
import { URLS } from "./constants";

describe(`identity tokens`, () => {
  let metaplex: Metaplex;
  let connection: Connection;
  let testIdentityTokenIssuer = new Keypair();

  beforeAll(async () => {
    connection = await connect("localhost");
    metaplex = getMetaplex(connection, testIdentityTokenIssuer);
    await putSolIntoWallet(
      connection,
      testIdentityTokenIssuer.publicKey,
      1_000_000_000
    );
  });

  afterAll(async () => {
    // Close connection?
  });

  test(`we can mint an identity token`, async () => {
    await mintIdentityToken(metaplex);
  });
});
