import { TAX_RATE_PIT, TAX_RATE_MILITARY } from './constants';

/**
 * Calculate all tax-related values for a dividend item
 *
 * @param {Object} item - Dividend item
 * @param {number} item.total - Total dividend amount
 * @param {number} item.tax - Tax withheld (usually negative)
 * @param {number} item.curExchange - Currency exchange rate
 * @returns {Object} Calculated tax values
 * @returns {number} returns.absTax - Absolute value of tax withheld
 * @returns {number} returns.income - Income after foreign tax
 * @returns {number} returns.localIncome - Income in local currency
 * @returns {number} returns.pit - Personal Income Tax
 * @returns {number} returns.militaryTax - Military Tax
 * @returns {number} returns.totalTax - Total local taxes (PIT + Military)
 * @returns {number} returns.netIncome - Net income after all taxes
 */
export function calculateTaxes(item) {
  const absTax = Math.abs(item.tax);
  const income = item.total - absTax;
  const localIncome = income * item.curExchange;
  const pit = localIncome * TAX_RATE_PIT;
  const militaryTax = localIncome * TAX_RATE_MILITARY;
  const totalTax = pit + militaryTax;
  const netIncome = localIncome - totalTax;

  return {
    absTax,
    income,
    localIncome,
    pit,
    militaryTax,
    totalTax,
    netIncome,
  };
}
