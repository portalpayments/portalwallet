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
