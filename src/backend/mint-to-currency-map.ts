import type { CurrencyDetails } from "./types";
    
export const mintToCurrencyMap: Record<string, CurrencyDetails> = {
  "So11111111111111111111111111111111111111112": {
    "mintAddress": "So11111111111111111111111111111111111111112",
    "decimals": 9,
    "symbol": "WSOL",
    "logo": "/assets/token-logos/sol-coin-grey.svg"
  },
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
    "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "decimals": 6,
    "symbol": "USDC",
    "logo": "/assets/token-logos/usdc-coin-grey.svg"
  },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": {
    "mintAddress": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "decimals": 6,
    "symbol": "USDT",
    "logo": "/assets/token-logos/usdt-coin-grey.svg"
  },
  "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX": {
    "mintAddress": "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
    "decimals": 6,
    "symbol": "USDH",
    "logo": "/assets/token-logos/usdh-coin-grey.svg"
  },
  "native": {
    "mintAddress": "native",
    "symbol": "SOL",
    "decimals": 9,
    "logo": "/assets/token-logos/sol-coin-grey.svg"
  }
}