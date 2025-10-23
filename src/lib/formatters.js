/**
 * Returns the currency symbol for a given currency code.
 *
 * @param {string} currencyCode The currency code (e.g., 'USD', 'EUR').
 * @returns {string} The corresponding currency symbol ('$' or '€') or the code itself if not found.
 */
export function getCurrencySymbol(currencyCode) {
  switch (currencyCode) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return currencyCode;
  }
}
