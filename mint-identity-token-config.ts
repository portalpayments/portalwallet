import { VerifiedClaimsForIndividual } from "./src/backend/types";

const WALLET_ADDRESS = "2EfiRdR97jnSknN7KiVwGqXATvuSgGiTypMdiwXxBbxh";
const GIVEN_NAME = "Joseph";
const FAMILY_NAME = "McCann";
const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "joe.jpg";
const COVER_IMAGE_FILE = "identity-token-cover-image-for-joe.png";

const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE = null;

const ALREADY_UPLOADED_COVER_IMAGE = null;

// Partial because we haven't filled in image URL yet
const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
  type: "INDIVIDUAL",
  givenName: GIVEN_NAME,
  familyName: FAMILY_NAME,
};

export const config = {
  walletAddress: WALLET_ADDRESS,
  individualOrOrganizationImageFile: INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE,
  coverImageFile: COVER_IMAGE_FILE,
  alreadyUploadedIndividualOrOrganizationImage:
    ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE,
  alreadyUploadedCoverImage: ALREADY_UPLOADED_COVER_IMAGE,
  tokenClaimsNoImageUrl,
};

// const WALLET_ADDRESS = "7bz4h6T4p39ozCnz7vpDmmiFNssyV1d1Hu3TKcDXmSXu";
// const LEGAL_NAME = "Bridgesplit, Inc.";
// const STATE = "Delaware";
// const COUNTRY = "United States of America";
// const JURISDICTION = "State";
// const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "bridgesplit.jpg";
// const COVER_IMAGE_FILE = "identity-token-cover-image-for-bridgesplit.png";
// const IS_NOTABLE = true;

// const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE =
//   "https://gateway.pinata.cloud/ipfs/QmYtohFcvN3DT9pdEofWd7meYA87gRpFnBRAKgRPMp5XBW";
// const ALREADY_UPLOADED_COVER_IMAGE = null;

// // Partial because we haven't filled in image URL yet
// const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForOrganization, "imageUrl"> = {
//   type: "ORGANIZATION",
//   legalName: LEGAL_NAME,
//   state: STATE,
//   jurisdiction: JURISDICTION,
//   country: COUNTRY,
//   isNotable: IS_NOTABLE,
// };

// No need to change anything below this line
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
