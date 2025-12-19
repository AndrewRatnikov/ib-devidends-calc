import Decimal from 'decimal.js';

import { TAX_RATE_MILITARY, TAX_RATE_PIT } from './constants';

/**
 * Calculate all tax-related values for a dividend item
 * Uses Decimal.js for precise financial calculations to avoid floating-point errors
 *
 * @param {Object} item - Dividend item
 * @param {number} item.total - Total dividend amount
 * @param {number} item.tax - Tax withheld (usually negative)
 * @param {number} item.curExchange - Currency exchange rate
 * @returns {Object} Calculated tax values (all values returned as numbers)
 * @returns {number} returns.absTax - Absolute value of tax withheld
 * @returns {number} returns.income - Income after foreign tax
 * @returns {number} returns.localIncome - Income in local currency
 * @returns {number} returns.pit - Personal Income Tax
 * @returns {number} returns.militaryTax - Military Tax
 * @returns {number} returns.totalTax - Total local taxes (PIT + Military)
 * @returns {number} returns.netIncome - Net income after all taxes
 */
export function calculateTaxes(item) {
  const absTaxDecimal = new Decimal(Math.abs(item.tax));
  const totalDecimal = new Decimal(item.total);
  const curExchangeDecimal = new Decimal(item.curExchange);

  const incomeDecimal = totalDecimal.minus(absTaxDecimal);
  const localIncomeDecimal = incomeDecimal.times(curExchangeDecimal);
  const pitDecimal = localIncomeDecimal.times(TAX_RATE_PIT);
  const militaryTaxDecimal = localIncomeDecimal.times(TAX_RATE_MILITARY);
  const totalTaxDecimal = pitDecimal.plus(militaryTaxDecimal);
  const netIncomeDecimal = localIncomeDecimal.minus(totalTaxDecimal);

  return {
    absTax: absTaxDecimal.toNumber(),
    income: incomeDecimal.toNumber(),
    localIncome: localIncomeDecimal.toNumber(),
    pit: pitDecimal.toNumber(),
    militaryTax: militaryTaxDecimal.toNumber(),
    totalTax: totalTaxDecimal.toNumber(),
    netIncome: netIncomeDecimal.toNumber(),
  };
}
