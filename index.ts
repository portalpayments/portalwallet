#!/usr/bin/env ts-node

import { makeFullWalletWithTokens } from "./lib/vmwallet";

const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

const fullName = "19810321";

const password = "swag";

(async () => {
  await makeFullWalletWithTokens(phrase, fullName, password);
})();
