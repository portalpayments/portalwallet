import type { JsonMetadata } from "@metaplex-foundation/js";

export const rawNFTOffChainData: JsonMetadata = {
  name: "iSolmetric",
  symbol: "",
  description:
    "iSolmetric, 2023 — Bass recorded & performed by Stacey Shopsowitz | @StaceyPlaysBass — Music Produced, Mixed & Mastered in Ableton Live 11 by Fevra | @Fevra_ 87 BPM | Bb Minor | Time: 1:36 — Artwork created with AI & Photoshop 60 FPS | MP4 | 2304x2304",
  seller_fee_basis_points: 0,
  image:
    "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra---Isolmetric.png",
  animation_url:
    "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra%20-%20iSolmetric.mp4",
  attributes: [
    {
      trait_type: "artist",
      value: "@Fevra_",
    },
    {
      trait_type: "drop",
      value: "18",
    },
    {
      trait_type: "presented_by",
      value: "@solanaspaces",
    },
    {
      trait_type: "bpm",
      value: "87",
    },
    {
      trait_type: "genre",
      value: "Electric Soul",
    },
    {
      trait_type: "key signature",
      value: "Bb Minor",
    },
    {
      trait_type: "time signature",
      value: "4/4",
    },
    {
      trait_type: "license",
      value: "General Consumption",
    },
    {
      trait_type: "type",
      value: "Instrumental",
    },
  ],
  properties: {
    files: [
      {
        type: "image/png",
        uri: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra---Isolmetric.png",
      },
      {
        type: "video/mp4",
        uri: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra%20-%20iSolmetric.mp4",
      },
      {
        type: "audio/wav",
        uri: "https://shdw-drive.genesysgo.net/52zh6ZjiUQ5UKCwLBwob2k1BC3KF2qhvsE7V4e8g2pmD/Fevra%20-%20Isolmetric.wav",
      },
    ],
    // TypeScript and actual NFTs that exist are very different
    // @ts-ignore
    category: "video",
    creators: [],
  },
};
