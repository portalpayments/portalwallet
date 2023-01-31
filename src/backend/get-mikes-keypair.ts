import type { Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import { getKeypairFromString } from "./wallet";

dotenv.config();

const mikesSecretKey = process.env.MIKES_SECRET_KEY;

if (!mikesSecretKey) {
  throw new Error(`Please set MIKES_SECRET_KEY in .env file`);
}

export const mikesKeypair = getKeypairFromString(mikesSecretKey);
