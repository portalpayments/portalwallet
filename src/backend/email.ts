// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
export const getEmailLink = (walletAddressInBase58: string) => {
  const recipient = `verify@getportal.app`;
  const subject = encodeURIComponent(
    `Please add wallet ${walletAddressInBase58} to the portal alpha program!`
  );
  const body = encodeURIComponent(`Hi here! 
  
I own the new wallet address ${walletAddressInBase58} 😃! I'd like to get verified and claim my $5 USDC! 💰

Thanks!`);

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
};
