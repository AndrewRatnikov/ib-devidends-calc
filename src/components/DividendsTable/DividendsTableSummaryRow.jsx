import { TableCell, TableFooter, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/formatters';
import React from 'react';

export default function DividendsTableSummaryRow({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4}>Total</TableCell>
        <TableCell>{formatNumber(summary.total)}</TableCell>
        <TableCell>{formatNumber(summary.tax)}</TableCell>
        <TableCell>{formatNumber(summary.income)}</TableCell>
        <TableCell>{/* curExchange */}</TableCell>
        <TableCell>{formatNumber(summary.localIncome)}</TableCell>
        <TableCell>{formatNumber(summary.pit)}</TableCell>
        <TableCell>{formatNumber(summary.militaryTax)}</TableCell>
        <TableCell>{formatNumber(summary.totalTax)}</TableCell>
        <TableCell>{formatNumber(summary.netIncome)}</TableCell>
      </TableRow>
    </TableFooter>
  );
}
