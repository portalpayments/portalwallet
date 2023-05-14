import { getCoverImage, getBestMediaAndType, nftToCollectable } from "./collectables";
import { rawNFTOffChainData } from "./test-data/nft-off-chain-data";
import { mcBurgerNFTOnChainData } from "./test-data/nft-on-chain-data";
import { PublicKey } from "@solana/web3.js";
import { connect } from "./wallet";
import { MIKES_WALLET, SECONDS } from "./constants";
import { getCollectables } from "./collectables";
import { describe } from "node:test";

describe(`collectables`, () => {
  test(
    `getCollectables`,
    async () => {
      const connection = await connect("heliusMainNet");
      const wallet = new PublicKey(MIKES_WALLET);
      const collectables = await getCollectables(connection, wallet);

      const flagMonkez = collectables.find((collectable) => {
        return collectable.description.includes("@flagmonkez");
      });

      expect(flagMonkez).toBeTruthy();
    },
    // Can be slow
    // TODO: we could add some kind of on-demand metadata loading
    10 * SECONDS
  );

  test(`getCoverImage`, () => {
    const coverImage = getCoverImage(rawNFTOffChainData);
    expect(coverImage).toEqual(
      "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra---Isolmetric.png"
    );
  });

  test(`getBestMediaAndType`, () => {
    const bestMedia = getBestMediaAndType(rawNFTOffChainData);
    expect(bestMedia).toEqual({
      file: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra%20-%20iSolmetric.mp4",
      type: "video/mp4",
    });
  });

  test(`nftToCollectable`, async () => {
    const collectable = await nftToCollectable(mcBurgerNFTOnChainData);
    expect(collectable).toEqual({
      id: expect.any(String),
      name: "McBurger Demo",
      description: "Demo of composable loyalty. Not redeemable for a burger.",
      coverImage: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/mcdonalds_nft.png",
      media: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/mcdonalds_nft.png",
      type: "image/png",
      attributes: {},
    });
  });
});
