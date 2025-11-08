import { useMemo } from 'react';

export const useDividendsSummary = (hydratedFileData) => {
  const summary = useMemo(() => {
    if (!hydratedFileData) {
      return null;
    }
    return hydratedFileData.reduce(
      (acc, item) => {
        const absTax = Math.abs(item.tax);
        const income = item.total - absTax;
        const localIncome = income * item.curExchange;
        const pit = localIncome * 0.09;
        const militaryTax = localIncome * 0.05;
        const totalTax = pit + militaryTax;
        const netIncome = localIncome - totalTax;

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
  }, [hydratedFileData]);

  return summary;
};

export default useDividendsSummary;
