// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { log, stringify } from "../backend/functions";

// A little leeway to allow for rounding errors.
// And because of above, occasionally a 100 pixel element can be scrolled 101 pixels, so allow 'greater than' too.
// In pixels
const leeWay = 50;

export const checkIfScrolledAllTheWay = (element: svelte.JSX.Element) => {
  // Round because sometimes an element that's 70 pixels high can be scrolled 69.7 pixels down (and that's 'all the way')
  const howFarScrolled = Math.round(element.scrollTop + element.clientHeight);
  const scrollableArea = element.scrollHeight;
  const hasScrolledAllTheWay = howFarScrolled + leeWay >= scrollableArea;
  return hasScrolledAllTheWay;
};
