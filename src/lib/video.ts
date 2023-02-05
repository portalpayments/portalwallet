// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// Slightly odd import, but it's from the docs and it works.
import tsWhammy from "ts-whammy/src/libs";

// From https://stackoverflow.com/questions/934012/get-image-data-url-in-javascript?answertab=modifieddesc#tab-top
const imageToDataURL = async (imageUrl) => {
  let imageResponse = await fetch(imageUrl);
  const image = await imageResponse.blob();
  let bitmap = await createImageBitmap(image);
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
  return canvas.toDataURL("image/png");
  // image compression?
  // return canvas.toDataURL("image/png", 0.9);
};

// images can from: canvas.toDataURL(type, encoderOptions)
const images = [
  "data:image/webp;base64,UklGRkZg....",
  "data:image/webp;base64,UklGRkZg....",
];

// fixed video's duration(seconds)
const blob = tsWhammy.fromImageArrayWithOptions(images, { duration: 5 });

console.log(blob.type, blob.size);
