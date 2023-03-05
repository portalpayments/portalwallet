import { getSHA256Hash } from "./sha256";

export const getGradient = async (walletAddress: string) => {
  const hash = await getSHA256Hash(walletAddress);
  // 'as' because there could bdse no matches
  // but our strings will always have a match
  const hashParts = hash.match(/.{1,8}/g) as Array<string>;
  const hues = hashParts.map((hashPart) => parseInt(hashPart, 16) % 360);
  // Lightness values and positioning are just some 'nice' values
  return `
background-image:
radial-gradient(at 40% 20%, hsla(${hues[0]},100%,74%,1) 0px, transparent 50%),
radial-gradient(at 80% 0%, hsla(${hues[1]},100%,56%,1) 0px, transparent 50%),
radial-gradient(at 0% 50%, hsla(${hues[2]},100%,93%,1) 0px, transparent 50%),
radial-gradient(at 80% 50%, hsla(${hues[3]},100%,76%,1) 0px, transparent 50%),
radial-gradient(at 0% 100%, hsla(${hues[4]},100%,77%,1) 0px, transparent 50%),
radial-gradient(at 80% 100%, hsla(${hues[5]},100%,70%,1) 0px, transparent 50%),
radial-gradient(at 0% 0%, hsla(${hues[6]},100%,76%,1) 0px, transparent 50%);`;
};
