import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

export default function DividendsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>

        <TableHead>Ticker</TableHead>

        <TableHead>Dividend Per Share</TableHead>

        <TableHead>Number of shares</TableHead>

        <TableHead>Total Dividend, $</TableHead>

        <TableHead>Tax, $</TableHead>

        <TableHead>Net Income, $</TableHead>

        <TableHead>usd/uah</TableHead>

        <TableHead>Income, ₴</TableHead>

        <TableHead>Personal Income Tax, 9%</TableHead>

        <TableHead>Military Tax, 5%</TableHead>

        <TableHead>Total Tax, 14%</TableHead>

        <TableHead>Net Income, ₴</TableHead>
      </TableRow>
    </TableHeader>
  );
}
