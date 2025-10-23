import { Table, TableCaption } from '@/components/ui/table';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React from 'react';

import DividendsTableHeader from './DividendsTableHeader';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const dateRange = getDateRangeFromFileData(fileData);
  console.log('DividendsTable dateRange: ', dateRange);

  console.log('DividendsTable fileData: ', fileData);

  if (!fileData || !fileData.length) {
    return null;
  }

  return (
    <Table className="mt-5">
      <TableCaption>A list of dividends.</TableCaption>

      <DividendsTableHeader />
    </Table>
  );
}
