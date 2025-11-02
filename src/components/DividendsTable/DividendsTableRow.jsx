import { TableCell, TableRow } from '@/components/ui/table';
import React from 'react';

export default function DividendsTableRow({ data }) {
  const { date, ticker, dividendPerShare, total, tax, curExchange } = data;
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
      <TableCell>{dividendPerShare}</TableCell>
      <TableCell>{Math.round(total / dividendPerShare)}</TableCell>
      <TableCell>{total}</TableCell>
      <TableCell>{absTax}</TableCell>
      <TableCell>{income}</TableCell>
      <TableCell>{curExchange}</TableCell>
      <TableCell>{localIncome}</TableCell>
      <TableCell>{pit}</TableCell>
      <TableCell>{militaryTax}</TableCell>
      <TableCell>{totalTax}</TableCell>
      <TableCell>{netIncome}</TableCell>
    </TableRow>
  );
}
