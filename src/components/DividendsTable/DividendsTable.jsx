import { Table, TableCaption } from '@/components/ui/table';
import useFetchCurrencyExchange from '@/hooks/useFetchCurrencyExchange';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React from 'react';

import DividendsTableHeader from './DividendsTableHeader';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const dateRange = getDateRangeFromFileData(fileData);

  console.log('DividendsTable fileData: ', fileData);

  const {
    data: currencyExchangeData,
    isLoading,
    isError,
  } = useFetchCurrencyExchange(dateRange ?? {});

  console.log('currencyExchangeData: ', currencyExchangeData);

  if (
    !fileData ||
    !fileData.length ||
    dateRange === null ||
    isLoading ||
    isError
  ) {
    return null;
  }

  return (
    <Table className="mt-5">
      <TableCaption>A list of dividends.</TableCaption>

      <DividendsTableHeader />
    </Table>
  );
}
