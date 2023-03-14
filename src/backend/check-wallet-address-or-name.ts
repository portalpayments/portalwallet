import { walletNameToAddressAndProfilePicture } from "@portal-payments/solana-wallet-names";
import type { Connection } from "@solana/web3.js";
import { log } from "./functions";
import { checkIfValidWalletAddress } from "./solana-functions";

interface walletAddressAndProfilePicture {
  destinationWalletAddress: string | null;
  profilePictureURL: string | null;
  isUsingWalletname: boolean;
}

export const checkWalletAddressOrName = async (
  connection: Connection,
  walletNameEnteredByUser: string
): Promise<walletAddressAndProfilePicture> => {
  let isValidWalletAddressOrName = checkIfValidWalletAddress(
    walletNameEnteredByUser
  );

  if (isValidWalletAddressOrName) {
    log(`This is a valid wallet address`);
    return {
      destinationWalletAddress: walletNameEnteredByUser,
      profilePictureURL: null,
      isUsingWalletname: false,
    };
  }
  log(
    `'${walletNameEnteredByUser}' is not a valid wallet address, trying to resolve '${walletNameEnteredByUser}' as a name...`
  );
  // We're assuming any name that resolves to a wallet address is a valid wallet address
  // Eg if banana.sol resolves to abc123, then abc123 is a valid address
  // TODO: we may wish to check the resolved address is a valid address
  const foundAddressAndProfilePicture =
    await walletNameToAddressAndProfilePicture(
      connection,
      walletNameEnteredByUser
    );

  return {
    destinationWalletAddress: foundAddressAndProfilePicture.walletAddress,
    profilePictureURL: foundAddressAndProfilePicture.profilePicture,
    isUsingWalletname: true,
  };
};
