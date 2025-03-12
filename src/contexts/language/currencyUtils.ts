
import { Currency } from './types';

// Currency conversion rates (base: USD)
export const currencyRates = {
  USD: 1,
  BRL: 5.08,
  EUR: 0.92,
  ETH: 0.0000464 // ETH per USD (approx. value)
};

// JestCoin value in different currencies
export const jestCoinValue = {
  USD: 0.25, // $0.25 USD per JestCoin
  BRL: 0.25 * currencyRates.BRL, // BRL per JestCoin
  EUR: 0.25 * currencyRates.EUR, // EUR per JestCoin
  ETH: 0.0000125 // ETH per JestCoin (direct value)
};

// Currency symbols
export const currencySymbols = {
  USD: '$',
  BRL: 'R$',
  EUR: '€',
  ETH: 'Ξ'
};

/**
 * Format currency based on current selection
 */
export const formatCurrencyValue = (amount: number, currency: Currency): string => {
  if (currency === 'ETH') {
    // For ETH, show more decimal places
    return `${currencySymbols[currency]}${amount.toFixed(6)}`;
  }
  
  // For fiat currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  }).format(amount);
};

/**
 * Convert any amount to equivalent JestCoins
 */
export const convertToJestCoinValue = (amount: number, currency: Currency): number => {
  return amount / jestCoinValue[currency];
};

/**
 * Convert JestCoins to current currency
 */
export const convertFromJestCoinValue = (jestCoins: number, currency: Currency): number => {
  return jestCoins * jestCoinValue[currency];
};
