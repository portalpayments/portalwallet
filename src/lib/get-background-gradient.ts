import colorsea from "colorsea";
// Note types may be missing, see https://github.com/briangonzalez/rgbaster.js/issues/66
import analyze from "rgbaster";

const getDominantColor = async (imageURL) => {
  // https://www.npmjs.com/package/rgbaster#configuration-options
  const results = await analyze(imageURL, {
    ignore: ["rgb(255,255,255)", "rgb(0,0,0)"],
    scale: 0.1,
  });
  if (results.length === 0) {
    return null;
  }
  return results[0].color;
};

const colorToString = (color) => {
  const colorRGB = color.rgb();
  return `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`;
};

export const getBackgroundGradient = async (imageUrl) => {
  const colorRGBString = await getDominantColor(imageUrl);
  const color = colorsea(colorRGBString);
  const topColor = color;
  const bottomColor = color.darken(10);
  const gradient = `linear-gradient(180deg, ${colorToString(
    topColor
  )}, ${colorToString(bottomColor)})`;
  return gradient;
};
