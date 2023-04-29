// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { log } from "./backend/functions";

export const setBadge = (text: string, backgroundColor: string) => {
  log(`Setting badge text and background color`);

  chrome.action.setBadgeText({
    text,
  });

  // Does not appear in docs, but does actually work!
  // @ts-ignore
  chrome.action.setBadgeTextColor({
    color: "white",
  });

  chrome.action.setBadgeBackgroundColor({
    // mid-blue from app.scss
    color: backgroundColor,
  });

  log(`Finished setting badge text and background color`);
};

export const clearBadge = () => {
  log(`Clearing badge text and background color`);

  chrome.action.setBadgeText({
    text: "",
  });

  chrome.action.setBadgeBackgroundColor({
    color: "transparent",
  });

  log(`Finished clearing badge text and background color`);
};
