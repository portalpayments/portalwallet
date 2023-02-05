// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { RawDecafReceipt } from "../types";
import { JSDOM } from "jsdom";

// Mock this (as node doesn't have a DOM)
export const receiptHTMLToObject = (html: string): RawDecafReceipt => {
  const dom = new JSDOM(html);
  const nextData = dom.window.document.getElementById("__NEXT_DATA__");
  if (!nextData) {
    throw new Error(`Couldn't find nextdata in DOM`);
  }
  const jsonInsideHTML = nextData.textContent;
  return JSON.parse(jsonInsideHTML);
};
