import { calculateTaxes } from '@/lib/taxCalculations';
import { useMemo } from 'react';

export const useDividendsSummary = (hydratedFileData) => {
  const summary = useMemo(() => {
    if (!hydratedFileData) {
      return null;
    }
    const totals = hydratedFileData.reduce(
      (acc, item) => {
        const {
          absTax,
          income,
          localIncome,
          pit,
          militaryTax,
          totalTax,
          netIncome,
        } = calculateTaxes(item);

        acc.total += item.total;
        acc.tax += absTax;
        acc.income += income;
        acc.localIncome += localIncome;
        acc.pit += pit;
        acc.militaryTax += militaryTax;
        acc.totalTax += totalTax;
        acc.netIncome += netIncome;

        return acc;
      },
      {
        total: 0,
        tax: 0,
        income: 0,
        localIncome: 0,
        pit: 0,
        militaryTax: 0,
        totalTax: 0,
        netIncome: 0,
      },
    );

    // Calculate effective tax rates for summary
    const etrUsd = totals.total > 0 ? (totals.tax / totals.total) * 100 : 0;
    return {
      ...totals,
      etrUsd,
    };
  }, [hydratedFileData]);

  return summary;
};

export default useDividendsSummary;
