import { TableCell, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/formatters';
import { calculateTaxes } from '@/lib/taxCalculations';
import React from 'react';

export default function DividendsTableRow({ data }) {
  const { date, ticker, dividendPerShare, total, curExchange } = data;
  const { absTax, income, localIncome, pit, militaryTax, totalTax, netIncome } =
    calculateTaxes(data);

  // Calculate Effective Tax Rate for USD (US withholding tax)
  const etrUsd = total > 0 ? (absTax / total) * 100 : 0;

  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>{ticker}</TableCell>
      <TableCell>{formatNumber(dividendPerShare)}</TableCell>
      <TableCell>
        {dividendPerShare ? Math.round(total / dividendPerShare) : 0}
      </TableCell>
      <TableCell>{total}</TableCell>
      <TableCell>{absTax}</TableCell>
      <TableCell>{formatNumber(etrUsd)}</TableCell>
      <TableCell>{formatNumber(income)}</TableCell>
      <TableCell>{formatNumber(curExchange)}</TableCell>
      <TableCell>{formatNumber(localIncome)}</TableCell>
      <TableCell>{formatNumber(pit)}</TableCell>
      <TableCell>{formatNumber(militaryTax)}</TableCell>
      <TableCell>{formatNumber(totalTax)}</TableCell>

      <TableCell>{formatNumber(netIncome)}</TableCell>
    </TableRow>
  );
}
