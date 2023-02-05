// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import { getKeypairFromString } from "./wallet";

dotenv.config();

const mikesSecretKey = process.env.MIKES_SECRET_KEY;

if (!mikesSecretKey) {
  throw new Error(`Please set MIKES_SECRET_KEY in .env file`);
}

export const mikesKeypair = getKeypairFromString(mikesSecretKey);
