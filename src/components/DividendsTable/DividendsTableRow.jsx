import { TableCell, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/formatters';
import React from 'react';

export default function DividendsTableRow({ data }) {
  const { date, ticker, dividendPerShare, total, tax, curExchange = 0 } = data;
  const absTax = Math.abs(tax);
  const income = total - absTax;
  const localIncome = income * curExchange;
  const pit = localIncome * 0.09;
  const militaryTax = localIncome * 0.05;
  const totalTax = pit + militaryTax;
  const netIncome = localIncome - totalTax;

  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>{ticker}</TableCell>
      <TableCell>{formatNumber(dividendPerShare)}</TableCell>
      <TableCell>{dividendPerShare ? Math.round(total / dividendPerShare) : 0}</TableCell>
      <TableCell>{total}</TableCell>
      <TableCell>{absTax}</TableCell>
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
