import {
  VerifiedClaimsForIndividual,
  VerifiedClaimsForOrganization,
} from "./src/backend/types";

// ------------------------------------------------------------------------------
// CONFIGURE TOKEN FOR AN INDIVIDUAL

// const WALLET_ADDRESS = "2EfiRdR97jnSknN7KiVwGqXATvuSgGiTypMdiwXxBbxh";
// const GIVEN_NAME = "Joseph";
// const FAMILY_NAME = "McCann";
// const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "joe.jpg";
// const COVER_IMAGE_FILE = "identity-token-cover-image-for-joe.png";

// const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE = null;

// const ALREADY_UPLOADED_COVER_IMAGE = null;

// // Partial because we haven't filled in image URL yet
// const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
//   type: "INDIVIDUAL",
//   givenName: GIVEN_NAME,
//   familyName: FAMILY_NAME,
// };

// ------------------------------------------------------------------------------
// CONFIGURE TOKEN FOR AN ORGANIZATION

const WALLET_ADDRESS = "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF";
const LEGAL_NAME = "Helius Blockchain Technologies, Inc.";
const STATE = "California";
const COUNTRY = "United States of America";
const JURISDICTION = "State";
const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "helius.jpg";
const COVER_IMAGE_FILE = "identity-token-cover-image-for-helius.png";
const IS_NOTABLE = true;

const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE = null;
const ALREADY_UPLOADED_COVER_IMAGE = null;

// Partial because we haven't filled in image URL yet
const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForOrganization, "imageUrl"> = {
  type: "ORGANIZATION",
  legalName: LEGAL_NAME,
  state: STATE,
  jurisdiction: JURISDICTION,
  country: COUNTRY,
  isNotable: IS_NOTABLE,
};

// ------------------------------------------------------------------------------
// No need to change anything below this line
export const config = {
  walletAddress: WALLET_ADDRESS,
  individualOrOrganizationImageFile: INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE,
  coverImageFile: COVER_IMAGE_FILE,
  alreadyUploadedIndividualOrOrganizationImage:
    ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE,
  alreadyUploadedCoverImage: ALREADY_UPLOADED_COVER_IMAGE,
  tokenClaimsNoImageUrl,
};
