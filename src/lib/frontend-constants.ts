// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// Frontend-specific constants
// Backend constants are in the backend constants file.

export enum LabelColor {
  Grey = "grey",
  Green = "green",
  Yellow = "yellow",
  Red = "red",
}

export const HOW_MANY_TRANSACTIONS_TO_GET_AT_ONCE = 10;

export const warningUnverifiedAccount =
  "Only send money to verified recipients. We will notify you once the address is verified.";

// Used to validate 12, 12.34, etc.
export const NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS = "^d*(.d{0,2})?$";
